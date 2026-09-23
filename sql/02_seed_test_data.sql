-- =============================================================================
-- InfHub — Dados de Teste (Seed)
-- =============================================================================
-- Execute APENAS em ambiente de desenvolvimento/staging.
-- Requer que o schema 01_schema.sql já tenha sido executado.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 1 — PLANOS
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.plans (id, name, description, price_brl, tokens_per_month, is_active, features, sort_order)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'Starter',
    'Ideal para criadores que estão começando.',
    29.90,
    100,
    true,
    '[
      "100 tokens por mês",
      "Geração de carrosséis com IA",
      "Exportação em alta resolução",
      "Suporte por e-mail"
    ]'::jsonb,
    1
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'Pro',
    'Para criadores que já vendem e querem escalar.',
    79.90,
    400,
    true,
    '[
      "400 tokens por mês",
      "Tudo do Starter",
      "Modelos de IA exclusivos",
      "Geração de vídeos TikTok Shop",
      "Suporte prioritário"
    ]'::jsonb,
    2
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'Business',
    'Para agências e times de marketing.',
    199.90,
    1500,
    true,
    '[
      "1.500 tokens por mês",
      "Tudo do Pro",
      "Acesso a múltiplos perfis",
      "API de integração",
      "Gerente de conta dedicado"
    ]'::jsonb,
    3
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 2 — TEMPLATES
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO public.templates (id, name, slug, description, category, default_styles, slide_schema, is_active, sort_order)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'Minimalista',
    'minimalista',
    'O estilo mais versátil. Fundo branco ou preto, tipografia grande e clean. Funciona para qualquer nicho.',
    'Mais popular',
    '{
      "accent_color": "#7C3AED",
      "gradient": { "from": "#7C3AED", "to": "#06B6D4", "direction": "to-r" },
      "font_heading": "Outfit",
      "font_body": "Inter",
      "overlay": { "style": "none", "opacity": 0 }
    }'::jsonb,
    '[
      { "type": "cover",   "content_layout": "middle_center", "glass_effect": false },
      { "type": "content", "content_layout": "bottom_left",   "glass_effect": false },
      { "type": "cta",     "content_layout": "middle_center", "glass_effect": false }
    ]'::jsonb,
    true,
    1
  ),
  (
    'b1000000-0000-0000-0000-000000000002',
    'TechViral',
    'techviral',
    'Impacto visual máximo. Imagem de fundo sangrada, tipografia pesada e marca-texto em gradiente.',
    'Mais popular',
    '{
      "accent_color": "#FE2C55",
      "gradient": { "from": "#25F4EE", "to": "#FE2C55", "direction": "to-r" },
      "font_heading": "Outfit",
      "font_body": "Inter",
      "overlay": { "style": "base_strong", "opacity": 90 }
    }'::jsonb,
    '[
      { "type": "cover",   "content_layout": "bottom_left",   "glass_effect": false },
      { "type": "content", "content_layout": "bottom_left",   "glass_effect": false },
      { "type": "cta",     "content_layout": "middle_center", "glass_effect": false }
    ]'::jsonb,
    true,
    2
  ),
  (
    'b1000000-0000-0000-0000-000000000003',
    'Profile',
    'profile',
    'Estilo X/Twitter. Simula uma thread viral com foto de perfil, verificação e formatação de rede social.',
    'Novo',
    '{
      "accent_color": "#1D9BF0",
      "gradient": { "from": "#1D9BF0", "to": "#1D9BF0", "direction": "to-r" },
      "font_heading": "Inter",
      "font_body": "Inter",
      "overlay": { "style": "none", "opacity": 0 }
    }'::jsonb,
    '[
      { "type": "cover",   "content_layout": "top_left",    "glass_effect": false, "thumbnail_layout": "one_landscape" },
      { "type": "content", "content_layout": "top_left",    "glass_effect": false, "thumbnail_layout": "four_grid" },
      { "type": "cta",     "content_layout": "middle_left", "glass_effect": false, "thumbnail_layout": "none" }
    ]'::jsonb,
    true,
    3
  ),
  (
    'b1000000-0000-0000-0000-000000000004',
    'Creators',
    'creators',
    'Para lifestyle e criadores de conteúdo pessoal. Cores quentes, glassmorphism e imagens em destaque.',
    'Novo',
    '{
      "accent_color": "#F59E0B",
      "gradient": { "from": "#F59E0B", "to": "#EF4444", "direction": "to-br" },
      "font_heading": "Outfit",
      "font_body": "Inter",
      "overlay": { "style": "base_soft", "opacity": 70 }
    }'::jsonb,
    '[
      { "type": "cover",   "content_layout": "bottom_left",   "glass_effect": true },
      { "type": "content", "content_layout": "bottom_left",   "glass_effect": true },
      { "type": "cta",     "content_layout": "middle_center", "glass_effect": true }
    ]'::jsonb,
    true,
    4
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 3 — USUÁRIOS DE TESTE
-- ─────────────────────────────────────────────────────────────────────────────
-- Nota: No Supabase, auth.users é gerenciado pelo GoTrue.
-- Em projetos reais, use o painel Auth > Users para criar usuários de teste.
-- O bloco abaixo é compatível com o SQL Editor do Supabase (service_role).
-- Os UUIDs são fixos para facilitar testes repetíveis.
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  user1_id UUID := 'c1000000-0000-0000-0000-000000000001';
  user2_id UUID := 'c1000000-0000-0000-0000-000000000002';

  plan_pro_id      UUID := 'a1000000-0000-0000-0000-000000000002';
  plan_starter_id  UUID := 'a1000000-0000-0000-0000-000000000001';

  tmpl_techviral   UUID := 'b1000000-0000-0000-0000-000000000002';
  tmpl_minimalista UUID := 'b1000000-0000-0000-0000-000000000001';

  sub1_id   UUID;
  sub2_id   UUID;
  txn1_id   UUID;
  txn2_id   UUID;
  car1_id   UUID;
  car2_id   UUID;
  proj1_id  UUID;
  asset1_id UUID;

BEGIN

-- ── Criar usuários em auth.users ──────────────────────────────────────────────
-- (só funciona com service_role — conexão direta ao DB ou SQL Editor do Supabase)
INSERT INTO auth.users (
  id, instance_id, aud, role, email,
  encrypted_password, email_confirmed_at,
  raw_user_meta_data, created_at, updated_at
)
VALUES (
  user1_id,
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'maria@infhub.dev',
  crypt('Senha@123', gen_salt('bf')),
  now(),
  '{"full_name": "Maria Oliveira", "avatar_url": null}'::jsonb,
  now(), now()
),
(
  user2_id,
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'joao@infhub.dev',
  crypt('Senha@123', gen_salt('bf')),
  now(),
  '{"full_name": "João Costa", "avatar_url": null}'::jsonb,
  now(), now()
)
ON CONFLICT (id) DO NOTHING;

-- Profiles são criados pelo trigger on_auth_user_created.
-- Se o trigger não disparou (execução manual), garantimos aqui:
INSERT INTO public.profiles (id, full_name, avatar_url, instagram_handle, token_balance)
VALUES
  (user1_id, 'Maria Oliveira', null, '@mariaolive_content', 400),
  (user2_id, 'João Costa',    null, '@joaocosta_mk',       90)
ON CONFLICT (id) DO UPDATE
  SET full_name        = EXCLUDED.full_name,
      instagram_handle = EXCLUDED.instagram_handle,
      token_balance    = EXCLUDED.token_balance;


-- ── Assinaturas ───────────────────────────────────────────────────────────────
sub1_id := gen_random_uuid();
sub2_id := gen_random_uuid();

INSERT INTO public.subscriptions (
  id, user_id, plan_id, status,
  mp_subscription_id, mp_payer_id,
  current_period_start, current_period_end
)
VALUES
  (
    sub1_id, user1_id, plan_pro_id, 'active',
    'mp_sub_test_001', 'mp_payer_maria_001',
    now() - interval '5 days', now() + interval '25 days'
  ),
  (
    sub2_id, user2_id, plan_starter_id, 'active',
    'mp_sub_test_002', 'mp_payer_joao_002',
    now() - interval '10 days', now() + interval '20 days'
  );


-- ── Transações ────────────────────────────────────────────────────────────────
txn1_id := gen_random_uuid();
txn2_id := gen_random_uuid();

INSERT INTO public.transactions (
  id, user_id, type, status, amount_brl, tokens_granted, mp_payment_id, metadata
)
VALUES
  (
    txn1_id, user1_id, 'subscription_payment', 'approved',
    79.90, 400, 'mp_pay_test_001',
    '{"plan": "Pro", "cycle": 1}'::jsonb
  ),
  (
    txn2_id, user2_id, 'subscription_payment', 'approved',
    29.90, 100, 'mp_pay_test_002',
    '{"plan": "Starter", "cycle": 1}'::jsonb
  );


-- ── Token Ledger ──────────────────────────────────────────────────────────────
-- Histórico de movimentações coerente com os saldos dos profiles.

-- Maria (Pro): recebeu 400 tokens, usou 10 em um projeto de IA → saldo = 400 (já setado acima)
-- Adicionamos o crédito inicial e o débito
INSERT INTO public.token_ledger (user_id, type, amount, source, reference_id, balance_after, description)
VALUES
  -- Maria: crédito da assinatura Pro
  (user1_id, 'credit', 400, 'subscription', txn1_id, 400,
   'Crédito mensal - Plano Pro'),
  -- Maria: débito de projeto de IA (será referenciado pelo projeto abaixo)
  (user1_id, 'debit',  10,  'ai_project',   null,    390,
   'Geração de conteúdo IA - TikTok Shop'),
  -- Maria: recebeu 10 de bônus de boas-vindas
  (user1_id, 'credit', 10,  'bonus',         null,    400,
   'Bônus de boas-vindas'),
  -- João: crédito da assinatura Starter
  (user2_id, 'credit', 100, 'subscription', txn2_id, 100,
   'Crédito mensal - Plano Starter'),
  -- João: usou 10 tokens num carrossel com IA
  (user2_id, 'debit',  10,  'carousel_export', null, 90,
   'Exportação de carrossel - Plano Starter');


-- ── Projetos de IA (Maria) ────────────────────────────────────────────────────
proj1_id := gen_random_uuid();

INSERT INTO public.ai_projects (
  id, user_id, status, tokens_cost,
  product_image_url, model_image_url, selected_model_id, prompt,
  processing_started_at, processing_finished_at
)
VALUES (
  proj1_id,
  user1_id,
  'completed',
  10,
  'ai-assets/' || user1_id || '/' || proj1_id || '/input/produto.jpg',
  null,
  'model_brunette_01',
  'Crie um conteúdo impactante para TikTok Shop. Tom jovem e descontraído.',
  now() - interval '2 hours',
  now() - interval '1 hour 55 minutes'
);

-- Atualiza a referência no ledger com o project_id real
UPDATE public.token_ledger
SET reference_id = proj1_id
WHERE user_id = user1_id
  AND source = 'ai_project'
  AND reference_id IS NULL;


-- ── Assets gerados pela IA ────────────────────────────────────────────────────
asset1_id := gen_random_uuid();

INSERT INTO public.ai_generated_assets (id, project_id, asset_type, file_url, file_size_bytes, metadata)
VALUES
  (
    gen_random_uuid(), proj1_id, 'image',
    'ai-assets/' || user1_id || '/' || proj1_id || '/output/img_01.jpg',
    1024 * 850,
    '{"width": 1080, "height": 1350, "format": "jpeg"}'::jsonb
  ),
  (
    gen_random_uuid(), proj1_id, 'image',
    'ai-assets/' || user1_id || '/' || proj1_id || '/output/img_02.jpg',
    1024 * 920,
    '{"width": 1080, "height": 1350, "format": "jpeg"}'::jsonb
  ),
  (
    gen_random_uuid(), proj1_id, 'image',
    'ai-assets/' || user1_id || '/' || proj1_id || '/output/img_03.jpg',
    1024 * 780,
    '{"width": 1080, "height": 1350, "format": "jpeg"}'::jsonb
  ),
  (
    gen_random_uuid(), proj1_id, 'video',
    'ai-assets/' || user1_id || '/' || proj1_id || '/output/video_01.mp4',
    1024 * 1024 * 12,
    '{"width": 1080, "height": 1920, "duration_seconds": 15, "format": "mp4"}'::jsonb
  );


-- ── Carrosséis ────────────────────────────────────────────────────────────────
car1_id := gen_random_uuid();
car2_id := gen_random_uuid();

INSERT INTO public.carousels (
  id, user_id, template_id, title, format,
  global_styles, corners, ai_generation, tokens_cost, is_exported
)
VALUES
  -- Carrossel 1: Maria (TechViral, gerado com IA)
  (
    car1_id,
    user1_id,
    tmpl_techviral,
    'Claude Fable 5: Anthropic Libera IA do Mythos',
    'carousel',
    '{
      "accent_color": "#FE2C55",
      "gradient": { "from": "#25F4EE", "to": "#FE2C55", "direction": "to-r" },
      "font_heading": "Outfit",
      "font_body": "Inter",
      "overlay": { "style": "base_strong", "opacity": 90 }
    }'::jsonb,
    '{
      "top_left":     { "text": "@mariaolive_content", "enabled": true },
      "top_right":    { "text": "IA Pós-Mito",          "enabled": true },
      "bottom_left":  { "text": "O Futuro da Anthropic", "enabled": true },
      "bottom_right": { "text": "arrasta",               "enabled": true, "icon": "arrow_right" },
      "show_corners": true,
      "show_indicators": true,
      "font_size": 20,
      "border_distance": 80,
      "text_opacity": 90
    }'::jsonb,
    '{
      "prompt": "Claude Fable 5: Anthropic libera IA do Mythos",
      "exact_content": false,
      "language": "pt-BR",
      "slide_count": 5,
      "image_mode": "background",
      "generate_images": true,
      "image_style_prompt": "Fotografia editorial cinemática, tons frios, iluminação dramática",
      "reference_image_urls": []
    }'::jsonb,
    5,
    false
  ),
  -- Carrossel 2: João (Minimalista, criado manualmente)
  (
    car2_id,
    user2_id,
    tmpl_minimalista,
    '5 Erros que Todo Iniciante no Marketing Comete',
    'carousel',
    '{
      "accent_color": "#7C3AED",
      "gradient": { "from": "#7C3AED", "to": "#06B6D4", "direction": "to-r" },
      "font_heading": "Outfit",
      "font_body": "Inter",
      "overlay": { "style": "none", "opacity": 0 }
    }'::jsonb,
    '{
      "top_left":     { "text": "@joaocosta_mk", "enabled": true },
      "top_right":    { "text": "Marketing",      "enabled": false },
      "bottom_left":  { "text": "Dicas que funcionam", "enabled": true },
      "bottom_right": { "text": "arrasta",          "enabled": true, "icon": "arrow_right" },
      "show_corners": true,
      "show_indicators": true,
      "font_size": 18,
      "border_distance": 70,
      "text_opacity": 85
    }'::jsonb,
    null,  -- criado manualmente, sem IA
    0,
    true   -- já exportado
  );


-- ── Slides do Carrossel 1 (Maria / TechViral) ─────────────────────────────────
INSERT INTO public.carousel_slides (
  carousel_id, position_index,
  slide_title, slide_subtitle, body_text, tag_label, cta_text, highlighted_words,
  content_layout, glass_effect, padding_h, padding_v,
  background_image_url, image_fit, image_position_x, image_position_y, image_zoom,
  overlay_style, overlay_opacity
)
VALUES
  -- Slide 0 — Capa
  (
    car1_id, 0,
    'CLAUDE FABLE 5', 'A IA que o mundo não esperava', null, null, null,
    ARRAY['CLAUDE', 'FABLE'],
    'bottom_left', false, 170, 230,
    'carousel-assets/' || user1_id || '/' || car1_id || '/slide_0/bg.jpg',
    'cover', 40, 60, 110,
    'base_strong', 85
  ),
  -- Slide 1 — Conteúdo 1
  (
    car1_id, 1,
    'O que é o Mythos?', null,
    'O Mythos é o projeto secreto da Anthropic para treinar modelos com raciocínio simbólico avançado. Claude Fable 5 é o primeiro a usar essa arquitetura.',
    'INTELIGÊNCIA ARTIFICIAL', null,
    ARRAY['Mythos', 'raciocínio simbólico'],
    'bottom_left', false, 170, 230,
    'carousel-assets/' || user1_id || '/' || car1_id || '/slide_1/bg.jpg',
    'cover', 50, 50, 100,
    'base_strong', 90
  ),
  -- Slide 2 — Conteúdo 2
  (
    car1_id, 2,
    '3 Capacidades Inéditas', null,
    '1. Raciocínio em múltiplas etapas sem perda de contexto
2. Geração de código com verificação formal
3. Leitura e síntese de documentos de 1 milhão de tokens',
    'INOVAÇÃO', null,
    ARRAY['múltiplas etapas', 'verificação formal'],
    'bottom_left', false, 170, 230,
    'carousel-assets/' || user1_id || '/' || car1_id || '/slide_2/bg.jpg',
    'cover', 50, 50, 100,
    'base_soft', 80
  ),
  -- Slide 3 — Conteúdo 3
  (
    car1_id, 3,
    'Por que isso importa para você?', null,
    'Ferramentas que usam Claude Fable 5 vão entregar resultados 10x mais precisos. Quem se adaptar primeiro vai sair na frente.',
    'IMPACTO NO MERCADO', null,
    ARRAY['10x', 'sair na frente'],
    'bottom_left', false, 170, 230,
    null, 'cover', 50, 50, 100,
    'none', 0
  ),
  -- Slide 4 — CTA
  (
    car1_id, 4,
    'Quer criar conteúdo assim com IA?', null,
    'Acesse o InfHub e gere carrosséis virais em menos de 60 segundos.',
    null, 'Começar agora →',
    ARRAY['InfHub', '60 segundos'],
    'middle_center', false, 170, 230,
    null, 'cover', 50, 50, 100,
    'none', 0
  );


-- ── Slides do Carrossel 2 (João / Minimalista) ────────────────────────────────
INSERT INTO public.carousel_slides (
  carousel_id, position_index,
  slide_title, slide_subtitle, body_text, tag_label, cta_text, highlighted_words,
  content_layout, glass_effect, padding_h, padding_v,
  overlay_style, overlay_opacity
)
VALUES
  (
    car2_id, 0,
    '5 ERROS que vão arruinar seu marketing', 'Você provavelmente comete pelo menos 3',
    null, null, null,
    ARRAY['5 ERROS', 'arruinar'],
    'middle_center', false, 120, 180, 'none', 0
  ),
  (
    car2_id, 1,
    'Erro #1: Falar com todo mundo', null,
    'Quem fala com todo mundo, não fala com ninguém. Defina sua persona com precisão cirúrgica.',
    'DEFINIÇÃO DE PÚBLICO', null,
    ARRAY['todo mundo', 'precisão cirúrgica'],
    'bottom_left', false, 170, 230, 'none', 0
  ),
  (
    car2_id, 2,
    'Erro #2: Copiar os concorrentes', null,
    'Seu diferencial não está em fazer igual ao líder. Está em fazer o que o líder não faz.',
    'POSICIONAMENTO', null,
    ARRAY['diferencial', 'não faz'],
    'bottom_left', false, 170, 230, 'none', 0
  ),
  (
    car2_id, 3,
    'Erro #3: Ignorar os dados', null,
    'Sentimento não escala. Dados sim. Analise métricas semanalmente e ajuste com agilidade.',
    'ANÁLISE DE DADOS', null,
    ARRAY['Dados sim', 'agilidade'],
    'bottom_left', false, 170, 230, 'none', 0
  ),
  (
    car2_id, 4,
    'Me segue para mais conteúdo assim', null,
    'Todo dia um novo aprendizado sobre marketing digital para pequenos negócios.',
    null, 'Seguir @joaocosta_mk',
    ARRAY['marketing digital'],
    'middle_center', false, 170, 230, 'none', 0
  );


-- ── Audit Logs de exemplo ─────────────────────────────────────────────────────
INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, ip_address, metadata)
VALUES
  (user1_id, 'auth.register',       null,         null,    '187.0.0.1',  '{"provider": "email"}'::jsonb),
  (user1_id, 'subscription.create', 'subscription', sub1_id, '187.0.0.1', '{"plan": "Pro"}'::jsonb),
  (user1_id, 'carousel.create',     'carousel',    car1_id, '187.0.0.1', '{"template": "TechViral"}'::jsonb),
  (user1_id, 'carousel.ai_generate','carousel',    car1_id, '187.0.0.1', '{"slide_count": 5}'::jsonb),
  (user1_id, 'ai_project.create',   'ai_project',  proj1_id,'187.0.0.1', '{"tokens_cost": 10}'::jsonb),
  (user2_id, 'auth.register',       null,         null,    '189.0.0.2',  '{"provider": "email"}'::jsonb),
  (user2_id, 'subscription.create', 'subscription', sub2_id, '189.0.0.2', '{"plan": "Starter"}'::jsonb),
  (user2_id, 'carousel.create',     'carousel',    car2_id, '189.0.0.2', '{"template": "Minimalista"}'::jsonb),
  (user2_id, 'carousel.export',     'carousel',    car2_id, '189.0.0.2', '{"slides_exported": 5}'::jsonb);


END $$;


-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFICAÇÃO RÁPIDA
-- ─────────────────────────────────────────────────────────────────────────────
-- Rode essas queries após executar o seed para confirmar que tudo foi inserido.

-- SELECT * FROM public.profiles;
-- SELECT * FROM public.plans;
-- SELECT * FROM public.templates;
-- SELECT * FROM public.subscriptions;
-- SELECT * FROM public.transactions;
-- SELECT * FROM public.token_ledger;
-- SELECT * FROM public.carousels;
-- SELECT COUNT(*) AS total_slides FROM public.carousel_slides;
-- SELECT * FROM public.ai_projects;
-- SELECT * FROM public.ai_generated_assets;
-- SELECT * FROM public.audit_logs ORDER BY created_at;

-- =============================================================================
-- FIM DO SEED — InfHub v1.0 (dados de teste)
-- =============================================================================
