-- Run in the Supabase SQL editor. No existing tables or policies are removed.
begin;

create table if not exists public.overlay_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  email text not null,
  access_token_hash text not null check (length(access_token_hash) = 64),
  plan text not null check (plan in ('ready', 'custom', 'ai')),
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'BRL' check (currency = 'BRL'),
  brief jsonb not null,
  template_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'generating', 'ready', 'failed')),
  preference_id text,
  payment_id text unique,
  payment_status text,
  paid_at timestamptz,
  download_path text,
  failure_code text
);

create table if not exists public.overlay_generation_jobs (
  order_id uuid primary key references public.overlay_orders(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued', 'running', 'complete', 'failed')),
  attempts integer not null default 0,
  available_at timestamptz not null default now(),
  locked_until timestamptz,
  lock_token uuid,
  last_error text,
  updated_at timestamptz not null default now()
);
create index if not exists overlay_generation_queue_idx on public.overlay_generation_jobs(status, available_at);

create table if not exists public.overlay_checkout_limits (
  key_hash text primary key,
  window_started timestamptz not null default now(),
  attempts integer not null default 1
);

alter table public.overlay_orders enable row level security;
alter table public.overlay_generation_jobs enable row level security;
alter table public.overlay_checkout_limits enable row level security;
-- Deliberately no anon/authenticated policies. Only the server service role accesses orders.
revoke all on public.overlay_orders, public.overlay_generation_jobs, public.overlay_checkout_limits from anon, authenticated;
grant all on public.overlay_orders, public.overlay_generation_jobs, public.overlay_checkout_limits to service_role;

create or replace function public.overlay_allow_checkout(p_key text, p_limit integer default 5)
returns boolean language plpgsql security definer set search_path = '' as $$
declare current_attempts integer;
begin
  delete from public.overlay_checkout_limits where window_started < now() - interval '1 day';
  insert into public.overlay_checkout_limits(key_hash) values (p_key)
  on conflict (key_hash) do update set
    attempts = case when overlay_checkout_limits.window_started < now() - interval '10 minutes' then 1 else overlay_checkout_limits.attempts + 1 end,
    window_started = case when overlay_checkout_limits.window_started < now() - interval '10 minutes' then now() else overlay_checkout_limits.window_started end
  returning attempts into current_attempts;
  return current_attempts <= p_limit;
end;
$$;

-- Approval and queue creation are one transaction. Duplicate webhook deliveries are harmless.
create or replace function public.overlay_approve_payment(p_order_id uuid, p_payment_id text, p_amount_cents integer)
returns boolean language plpgsql security definer set search_path = '' as $$
declare target public.overlay_orders;
begin
  select * into target from public.overlay_orders where id = p_order_id for update;
  if not found or target.amount_cents <> p_amount_cents then return false; end if;
  if target.payment_id is not null then return target.payment_id = p_payment_id and target.payment_status = 'approved'; end if;
  update public.overlay_orders set payment_id = p_payment_id, payment_status = 'approved',
    status = 'paid', paid_at = now(), updated_at = now(), failure_code = null where id = p_order_id;
  insert into public.overlay_generation_jobs(order_id) values (p_order_id) on conflict (order_id) do nothing;
  return true;
end;
$$;

create or replace function public.overlay_revoke_payment(p_order_id uuid, p_payment_id text, p_status text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.overlay_orders set status = 'failed', payment_status = p_status,
    failure_code = 'payment_reversed', download_path = null, updated_at = now()
  where id = p_order_id and payment_id = p_payment_id;
  if found then
    update public.overlay_generation_jobs set status = 'failed', lock_token = null,
      last_error = 'payment_reversed', updated_at = now() where order_id = p_order_id;
  end if;
end;
$$;

-- Lease recovers jobs interrupted by a server restart. SKIP LOCKED supports concurrent workers.
create or replace function public.overlay_claim_generation(p_order_id uuid default null)
returns setof public.overlay_generation_jobs language plpgsql security definer set search_path = '' as $$
declare job public.overlay_generation_jobs;
begin
  with exhausted as (
    update public.overlay_generation_jobs set status = 'failed', last_error = 'attempts_exhausted', updated_at = now()
    where status = 'running' and locked_until < now() and attempts >= 3 returning order_id
  ) update public.overlay_orders set status = 'failed', failure_code = 'generation_failed', updated_at = now()
    where id in (select order_id from exhausted) and status = 'generating';

  select j.* into job from public.overlay_generation_jobs j
  join public.overlay_orders o on o.id = j.order_id
  where (p_order_id is null or j.order_id = p_order_id) and j.attempts < 3
    and o.payment_status = 'approved' and o.status in ('paid', 'generating')
    and ((j.status = 'queued' and j.available_at <= now()) or (j.status = 'running' and j.locked_until < now()))
  order by j.available_at for update of j skip locked limit 1;
  if not found then return; end if;

  update public.overlay_generation_jobs set status = 'running', attempts = attempts + 1,
    lock_token = gen_random_uuid(), locked_until = now() + interval '8 minutes', updated_at = now()
    where order_id = job.order_id returning * into job;
  update public.overlay_orders set status = 'generating', updated_at = now() where id = job.order_id;
  return next job;
end;
$$;

create or replace function public.overlay_finish_generation(p_order_id uuid, p_lock_token uuid, p_path text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  update public.overlay_generation_jobs set status = 'complete', locked_until = null, updated_at = now()
  where order_id = p_order_id and lock_token = p_lock_token and status = 'running' and locked_until > now();
  if not found then return false; end if;
  update public.overlay_orders set status = 'ready', download_path = p_path, failure_code = null, updated_at = now()
  where id = p_order_id and payment_status = 'approved';
  return found;
end;
$$;

create or replace function public.overlay_fail_generation(p_order_id uuid, p_lock_token uuid, p_error text)
returns void language plpgsql security definer set search_path = '' as $$
declare try_count integer;
begin
  update public.overlay_generation_jobs set status = case when attempts >= 3 then 'failed' else 'queued' end,
    last_error = left(p_error, 80), locked_until = null, available_at = now() + interval '1 minute', updated_at = now()
  where order_id = p_order_id and lock_token = p_lock_token and status = 'running' returning attempts into try_count;
  if found then
    update public.overlay_orders set status = case when try_count >= 3 then 'failed' else 'paid' end,
      failure_code = case when try_count >= 3 then 'generation_failed' else null end, updated_at = now()
    where id = p_order_id and payment_status = 'approved';
  end if;
end;
$$;

revoke all on function public.overlay_allow_checkout(text, integer) from public, anon, authenticated;
revoke all on function public.overlay_approve_payment(uuid, text, integer) from public, anon, authenticated;
revoke all on function public.overlay_revoke_payment(uuid, text, text) from public, anon, authenticated;
revoke all on function public.overlay_claim_generation(uuid) from public, anon, authenticated;
revoke all on function public.overlay_finish_generation(uuid, uuid, text) from public, anon, authenticated;
revoke all on function public.overlay_fail_generation(uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.overlay_allow_checkout(text, integer) to service_role;
grant execute on function public.overlay_approve_payment(uuid, text, integer) to service_role;
grant execute on function public.overlay_revoke_payment(uuid, text, text) to service_role;
grant execute on function public.overlay_claim_generation(uuid) to service_role;
grant execute on function public.overlay_finish_generation(uuid, uuid, text) to service_role;
grant execute on function public.overlay_fail_generation(uuid, uuid, text) to service_role;

insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('overlay-deliveries', 'overlay-deliveries', false, 52428800, array['application/zip', 'image/png'])
on conflict (id) do nothing;

commit;
