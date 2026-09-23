-- =============================================================================
-- InfHub — Schema Completo (Supabase / PostgreSQL)
-- =============================================================================
-- Baseado em: docs/Database.md e docs/Security.md
-- Execute no SQL Editor do Supabase na ordem apresentada.
-- =============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 1 — ENUMS
-- ─────────────────────────────────────────────────────────────────────────────

-- Status da assinatura do usuário
CREATE TYPE subscription_status AS ENUM (
  'active',     -- Pagamento em dia
  'past_due',   -- Pagamento atrasado (período de carência)
  'canceled',   -- Cancelou voluntariamente
  'inactive'    -- Nunca assinou ou expirou
);

-- Tipo de transação financeira
CREATE TYPE transaction_type AS ENUM (
  'subscription_payment',  -- Pagamento recorrente da assinatura
  'one_time_purchase',     -- Compra avulsa de pacote de tokens
  'ai_package_purchase'    -- Compra avulsa específica do Produto 1 (IA)
);

-- Status do pagamento (espelhando Mercado Pago)
CREATE TYPE payment_status AS ENUM (
  'pending',   -- Aguardando confirmação
  'approved',  -- Pagamento aprovado
  'rejected',  -- Pagamento recusado
  'refunded'   -- Estorno realizado
);

-- Tipo de movimentação no saldo de tokens
CREATE TYPE ledger_type AS ENUM (
  'credit',  -- Entrada de tokens (compra, assinatura, bônus)
  'debit'    -- Saída de tokens (uso de serviço)
);

-- Origem da movimentação de tokens
CREATE TYPE ledger_source AS ENUM (
  'subscription',    -- Crédito mensal da assinatura
  'purchase',        -- Compra avulsa
  'ai_project',      -- Débito por geração de IA
  'carousel_export', -- Débito por exportação de carrossel
  'bonus',           -- Crédito promocional/bônus
  'refund'           -- Estorno de tokens
);

-- Status de um projeto de IA
CREATE TYPE ai_project_status AS ENUM (
  'pending',     -- Aguardando processamento
  'processing',  -- IA está gerando
  'completed',   -- Geração concluída com sucesso
  'failed'       -- Falha na geração
);

-- Tipo de asset gerado pela IA
CREATE TYPE ai_asset_type AS ENUM (
  'image',
  'video'
);

-- Formato do post (carrossel)
CREATE TYPE post_format AS ENUM (
  'carousel',  -- 4:5 (1080x1350px)
  'square',    -- 1:1 (1080x1080px)
  'stories'    -- 9:16 (1080x1920px)
);

-- Layout de posicionamento do conteúdo no slide
CREATE TYPE content_layout AS ENUM (
  'top_left',    'top_center',    'top_right',
  'middle_left', 'middle_center', 'middle_right',
  'bottom_left', 'bottom_center', 'bottom_right'
);

-- Modo de imagem no carrossel
CREATE TYPE image_mode AS ENUM (
  'none',        -- Sem imagens
  'background',  -- Imagem de fundo
  'grid',        -- Grade de imagens
  'interleaved'  -- Intercalar ambas
);

-- Layout de thumbnails (template Profile/Twitter)
CREATE TYPE thumbnail_layout AS ENUM (
  'none',           -- Sem thumbnail
  'one_landscape',  -- 1 thumbnail 16:9
  'one_square',     -- 1 quadrada
  'two_vertical',   -- 2 verticais
  'four_grid'       -- 4 quadradas (2x2)
);

-- Posição de imagens relativa ao texto
CREATE TYPE image_position AS ENUM (
  'above_header',
  'below_header',
  'after_first_paragraph',
  'below_text'
);

-- Modo de enquadramento da imagem
CREATE TYPE image_fit AS ENUM (
  'cover',   -- Preencher (corta para cobrir)
  'contain'  -- Inteira (mostra tudo, pode ter bordas)
);

-- Estilo de sobreposição/sombra na imagem
CREATE TYPE overlay_style AS ENUM (
  'none',
  'base_strong',  -- Escurece a base
  'base_soft',    -- Escurece suavemente a base
  'full_dark',    -- Escurece o slide inteiro
  'full_soft'     -- Leve escurecimento geral
);

-- Ações de auditoria
CREATE TYPE audit_action AS ENUM (
  -- Auth
  'auth.login',
  'auth.logout',
  'auth.register',
  'auth.password_reset',
  -- Profile
  'profile.update',
  -- Carrossel
  'carousel.create',
  'carousel.update',
  'carousel.delete',
  'carousel.export',
  'carousel.ai_generate',
  -- Slides
  'slide.create',
  'slide.update',
  'slide.delete',
  'slide.ai_refine',
  'slide.ai_generate_image',
  -- IA (Produto 1)
  'ai_project.create',
  'ai_project.download',
  -- Financeiro
  'subscription.create',
  'subscription.cancel',
  'transaction.payment_received',
  'tokens.purchase',
  'tokens.debit',
  'tokens.credit',
  -- Segurança
  'security.suspicious_activity',
  'security.rate_limit_hit',
  'security.unauthorized_attempt'
);


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 2 — TABELAS
-- ─────────────────────────────────────────────────────────────────────────────

-- ── 1. profiles ──────────────────────────────────────────────────────────────
-- Estende auth.users. Criada automaticamente pelo trigger on_auth_user_created.
CREATE TABLE public.profiles (
  id               UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name        TEXT,
  avatar_url       TEXT,               -- URL no Supabase Storage
  instagram_handle TEXT,               -- @handle padrão para os carrosséis
  token_balance    INTEGER NOT NULL DEFAULT 0,  -- Cache do saldo (fonte da verdade: token_ledger)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. plans ─────────────────────────────────────────────────────────────────
CREATE TABLE public.plans (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,              -- Ex: "Starter", "Pro", "Business"
  description      TEXT,
  price_brl        NUMERIC(10,2) NOT NULL,     -- Valor mensal em R$
  tokens_per_month INTEGER NOT NULL,           -- Tokens creditados por mês
  is_active        BOOLEAN NOT NULL DEFAULT true,
  features         JSONB DEFAULT '[]',         -- Lista de features para a UI
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. subscriptions ─────────────────────────────────────────────────────────
CREATE TABLE public.subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id              UUID NOT NULL REFERENCES public.plans(id),
  status               subscription_status NOT NULL DEFAULT 'inactive',
  mp_subscription_id   TEXT,           -- ID da assinatura no Mercado Pago
  mp_payer_id          TEXT,           -- ID do pagador no Mercado Pago
  current_period_start TIMESTAMPTZ,    -- Início do ciclo atual
  current_period_end   TIMESTAMPTZ,    -- Fim do ciclo atual
  canceled_at          TIMESTAMPTZ,    -- Quando cancelou (se cancelou)
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_mp   ON public.subscriptions(mp_subscription_id);

-- ── 4. transactions ──────────────────────────────────────────────────────────
CREATE TABLE public.transactions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type                 transaction_type NOT NULL,
  status               payment_status NOT NULL DEFAULT 'pending',
  amount_brl           NUMERIC(10,2) NOT NULL,     -- Valor pago em R$
  tokens_granted       INTEGER NOT NULL DEFAULT 0, -- Tokens a creditar quando approved
  mp_payment_id        TEXT,                        -- ID do pagamento no Mercado Pago
  mp_merchant_order_id TEXT,                        -- ID da ordem no Mercado Pago
  metadata             JSONB DEFAULT '{}',          -- Dados extras do webhook
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_user ON public.transactions(user_id);
CREATE INDEX idx_transactions_mp   ON public.transactions(mp_payment_id);

-- ── 5. token_ledger ──────────────────────────────────────────────────────────
-- Registro imutável de todas as movimentações de tokens.
-- token_balance em profiles é cache; esta tabela é a fonte da verdade.
CREATE TABLE public.token_ledger (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type          ledger_type NOT NULL,    -- credit ou debit
  amount        INTEGER NOT NULL,        -- Sempre positivo
  source        ledger_source NOT NULL,  -- De onde veio a movimentação
  reference_id  UUID,                    -- ID da transação, ai_project ou carousel
  balance_after INTEGER NOT NULL,        -- Saldo resultante após esta operação
  description   TEXT,                    -- Ex: "Crédito mensal - Plano Pro"
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ledger_user    ON public.token_ledger(user_id);
CREATE INDEX idx_ledger_created ON public.token_ledger(created_at DESC);

-- ── 6. templates ─────────────────────────────────────────────────────────────
CREATE TABLE public.templates (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,           -- Ex: "Minimalista", "TechViral"
  slug           TEXT NOT NULL UNIQUE,    -- Ex: "minimalista", "techviral"
  description    TEXT,                    -- Descrição estratégica para a galeria
  category       TEXT,                    -- Ex: "Mais popular", "Novo"
  preview_url    TEXT,                    -- Imagem de preview no Storage
  default_styles JSONB NOT NULL DEFAULT '{}', -- Estilos padrão (cores, fontes, overlay)
  slide_schema   JSONB NOT NULL DEFAULT '[]', -- Estrutura padrão dos slides
  is_active      BOOLEAN NOT NULL DEFAULT true,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 7. carousels ─────────────────────────────────────────────────────────────
CREATE TABLE public.carousels (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id   UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  title         TEXT NOT NULL DEFAULT 'Sem título',
  format        post_format NOT NULL DEFAULT 'carousel',

  -- Configurações globais
  -- { "accent_color": "#FE2C55", "gradient": {...}, "font_heading": "Outfit",
  --   "font_body": "Inter", "overlay": { "style": "base_strong", "opacity": 90 } }
  global_styles JSONB NOT NULL DEFAULT '{}',

  -- Configurações dos cantos (watermarks)
  -- { "top_left": {"text":"@perfil","enabled":true}, "show_corners":true,
  --   "show_indicators":true, "font_size":20, "border_distance":80, "text_opacity":90 }
  corners       JSONB NOT NULL DEFAULT '{}',

  -- Parâmetros usados na geração com IA (null se criado manualmente)
  -- { "prompt":"...", "exact_content":false, "language":"pt-BR", "slide_count":5,
  --   "image_mode":"background", "generate_images":true, "image_style_prompt":"...",
  --   "reference_image_urls":[] }
  ai_generation JSONB DEFAULT NULL,

  tokens_cost   INTEGER NOT NULL DEFAULT 0,
  is_exported   BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_carousels_user    ON public.carousels(user_id);
CREATE INDEX idx_carousels_updated ON public.carousels(updated_at DESC);

-- ── 8. carousel_slides ───────────────────────────────────────────────────────
CREATE TABLE public.carousel_slides (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  carousel_id         UUID NOT NULL REFERENCES public.carousels(id) ON DELETE CASCADE,
  position_index      INTEGER NOT NULL,  -- Ordem do slide (0, 1, 2...)

  -- Conteúdo textual
  slide_title         TEXT,
  slide_subtitle      TEXT,
  body_text           TEXT,              -- Texto corrido / parágrafos
  tag_label           TEXT,              -- Pílula de categoria (ex: "OTIMIZAÇÃO DE TEMPO")
  cta_text            TEXT,              -- Texto do botão de ação
  highlighted_words   TEXT[],            -- Palavras com marca-texto (highlight)

  -- Layout e posicionamento
  content_layout      content_layout NOT NULL DEFAULT 'bottom_left',
  glass_effect        BOOLEAN NOT NULL DEFAULT false,
  padding_h           INTEGER NOT NULL DEFAULT 170,
  padding_v           INTEGER NOT NULL DEFAULT 230,

  -- Imagem de fundo
  background_image_url TEXT,
  image_fit           image_fit DEFAULT 'cover',
  image_position_x    INTEGER DEFAULT 50,
  image_position_y    INTEGER DEFAULT 50,
  image_zoom          INTEGER DEFAULT 100,
  image_flip_h        BOOLEAN DEFAULT false,
  image_opacity       INTEGER DEFAULT 100,

  -- Sobreposição / Sombra
  overlay_style       overlay_style DEFAULT 'none',
  overlay_opacity     INTEGER DEFAULT 90,

  -- Layout de thumbnails (templates tipo Profile/Twitter)
  thumbnail_layout    thumbnail_layout DEFAULT 'none',
  image_position      image_position DEFAULT 'below_text',
  thumbnail_urls      TEXT[] DEFAULT '{}',

  -- Estilos específicos deste slide (sobrescreve global_styles)
  custom_styles       JSONB DEFAULT '{}',

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(carousel_id, position_index)
);

CREATE INDEX idx_slides_carousel ON public.carousel_slides(carousel_id);

-- ── 9. ai_projects ───────────────────────────────────────────────────────────
CREATE TABLE public.ai_projects (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status                 ai_project_status NOT NULL DEFAULT 'pending',
  tokens_cost            INTEGER NOT NULL DEFAULT 0,

  product_image_url      TEXT NOT NULL,  -- Foto do produto (Storage)
  model_image_url        TEXT,           -- Foto do modelo/pessoa (Storage)
  selected_model_id      TEXT,           -- ID de um modelo pré-existente do sistema
  prompt                 TEXT,

  error_message          TEXT,
  processing_started_at  TIMESTAMPTZ,
  processing_finished_at TIMESTAMPTZ,

  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_projects_user   ON public.ai_projects(user_id);
CREATE INDEX idx_ai_projects_status ON public.ai_projects(status);

-- ── 10. ai_generated_assets ──────────────────────────────────────────────────
CREATE TABLE public.ai_generated_assets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES public.ai_projects(id) ON DELETE CASCADE,
  asset_type      ai_asset_type NOT NULL,
  file_url        TEXT NOT NULL,
  file_size_bytes BIGINT,
  metadata        JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assets_project ON public.ai_generated_assets(project_id);

-- ── 11. audit_logs ───────────────────────────────────────────────────────────
-- Sem policies = invisível para o client. Somente service_role acessa.
CREATE TABLE public.audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action        audit_action NOT NULL,
  resource_type TEXT,
  resource_id   UUID,
  ip_address    INET,
  user_agent    TEXT,
  metadata      JSONB DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user     ON public.audit_logs(user_id);
CREATE INDEX idx_audit_action   ON public.audit_logs(action);
CREATE INDEX idx_audit_created  ON public.audit_logs(created_at DESC);
CREATE INDEX idx_audit_resource ON public.audit_logs(resource_type, resource_id);


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 3 — ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_ledger        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousels           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carousel_slides     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generated_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs          ENABLE ROW LEVEL SECURITY;

-- ── profiles ─────────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile (safe columns only)"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── plans (leitura pública) ───────────────────────────────────────────────────
CREATE POLICY "Anyone can view active plans"
  ON public.plans FOR SELECT
  USING (is_active = true);

-- ── templates (leitura pública) ───────────────────────────────────────────────
CREATE POLICY "Anyone can view active templates"
  ON public.templates FOR SELECT
  USING (is_active = true);

-- ── subscriptions (somente leitura) ──────────────────────────────────────────
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- ── transactions (somente leitura) ────────────────────────────────────────────
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

-- ── token_ledger (somente leitura) ────────────────────────────────────────────
CREATE POLICY "Users can view own ledger"
  ON public.token_ledger FOR SELECT
  USING (auth.uid() = user_id);

-- ── carousels (CRUD próprio) ──────────────────────────────────────────────────
CREATE POLICY "Users can CRUD own carousels"
  ON public.carousels FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── carousel_slides (CRUD via carrossel próprio) ──────────────────────────────
CREATE POLICY "Users can CRUD own slides"
  ON public.carousel_slides FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.carousels
      WHERE carousels.id = carousel_slides.carousel_id
        AND carousels.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carousels
      WHERE carousels.id = carousel_slides.carousel_id
        AND carousels.user_id = auth.uid()
    )
  );

-- ── ai_projects (INSERT bloqueado; ocorre via create_ai_project function) ─────
CREATE POLICY "Users can CRUD own AI projects"
  ON public.ai_projects FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── ai_generated_assets (somente leitura via projeto próprio) ────────────────
CREATE POLICY "Users can view own AI assets"
  ON public.ai_generated_assets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_projects
      WHERE ai_projects.id = ai_generated_assets.project_id
        AND ai_projects.user_id = auth.uid()
    )
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 4 — HARDENING DE SEGURANÇA (Security.md VULN-01 a VULN-04)
-- ─────────────────────────────────────────────────────────────────────────────

-- VULN-02: transactions, token_ledger e subscriptions são somente leitura pelo client
REVOKE INSERT, UPDATE, DELETE ON public.transactions  FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.transactions  FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.token_ledger  FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.token_ledger  FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.subscriptions FROM authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.subscriptions FROM anon;

-- VULN-01: UPDATE direto em profiles bloqueado; use update_my_profile()
REVOKE UPDATE ON public.profiles FROM authenticated;

-- VULN-03: INSERT direto em ai_projects bloqueado; use create_ai_project()
REVOKE INSERT ON public.ai_projects FROM authenticated;


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 5 — FUNCTIONS E TRIGGERS
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Trigger: auto-update updated_at ──────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.carousels
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.carousel_slides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.ai_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ── Trigger: criar profile ao registrar usuário ───────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── Function: log_action ──────────────────────────────────────────────────────
-- Somente service_role pode executar (REVOKE abaixo).
CREATE OR REPLACE FUNCTION public.log_action(
  p_user_id       UUID,
  p_action        audit_action,
  p_resource_type TEXT    DEFAULT NULL,
  p_resource_id   UUID    DEFAULT NULL,
  p_ip_address    INET    DEFAULT NULL,
  p_user_agent    TEXT    DEFAULT NULL,
  p_metadata      JSONB   DEFAULT '{}'
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id,
    ip_address, user_agent, metadata
  ) VALUES (
    p_user_id, p_action, p_resource_type, p_resource_id,
    p_ip_address, p_user_agent, p_metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

REVOKE EXECUTE ON FUNCTION public.log_action FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.log_action FROM anon;

-- ── Function: debit_tokens ────────────────────────────────────────────────────
-- Débito atômico com lock FOR UPDATE para evitar race conditions (VULN-04).
CREATE OR REPLACE FUNCTION public.debit_tokens(
  p_user_id      UUID,
  p_amount       INTEGER,
  p_source       ledger_source,
  p_reference_id UUID   DEFAULT NULL,
  p_description  TEXT   DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_current_balance INTEGER;
  v_new_balance     INTEGER;
BEGIN
  SELECT token_balance INTO v_current_balance
  FROM public.profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF v_current_balance < p_amount THEN
    RAISE EXCEPTION 'Saldo insuficiente. Saldo: %, Custo: %', v_current_balance, p_amount;
  END IF;

  v_new_balance := v_current_balance - p_amount;

  UPDATE public.profiles
  SET token_balance = v_new_balance, updated_at = now()
  WHERE id = p_user_id;

  INSERT INTO public.token_ledger (
    user_id, type, amount, source, reference_id, balance_after, description
  ) VALUES (
    p_user_id, 'debit', p_amount, p_source, p_reference_id, v_new_balance, p_description
  );

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- VULN-04: client não pode chamar debit_tokens diretamente
REVOKE EXECUTE ON FUNCTION public.debit_tokens FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.debit_tokens FROM anon;

-- ── Function: credit_tokens ───────────────────────────────────────────────────
-- Chamada pelo webhook do Mercado Pago via service_role (VULN-04).
CREATE OR REPLACE FUNCTION public.credit_tokens(
  p_user_id      UUID,
  p_amount       INTEGER,
  p_source       ledger_source,
  p_reference_id UUID   DEFAULT NULL,
  p_description  TEXT   DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE public.profiles
  SET token_balance = token_balance + p_amount, updated_at = now()
  WHERE id = p_user_id
  RETURNING token_balance INTO v_new_balance;

  INSERT INTO public.token_ledger (
    user_id, type, amount, source, reference_id, balance_after, description
  ) VALUES (
    p_user_id, 'credit', p_amount, p_source, p_reference_id, v_new_balance, p_description
  );

  RETURN v_new_balance;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- VULN-04: client não pode chamar credit_tokens diretamente
REVOKE EXECUTE ON FUNCTION public.credit_tokens FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.credit_tokens FROM anon;

-- ── Function: update_my_profile ───────────────────────────────────────────────
-- Permite ao usuário atualizar apenas campos seguros do perfil (VULN-01).
CREATE OR REPLACE FUNCTION public.update_my_profile(
  p_full_name        TEXT DEFAULT NULL,
  p_avatar_url       TEXT DEFAULT NULL,
  p_instagram_handle TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE public.profiles SET
    full_name        = COALESCE(p_full_name, full_name),
    avatar_url       = COALESCE(p_avatar_url, avatar_url),
    instagram_handle = COALESCE(p_instagram_handle, instagram_handle)
  WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── Function: create_ai_project ───────────────────────────────────────────────
-- Cria projeto de IA com débito atômico de tokens (VULN-03).
-- INSERT direto em ai_projects está revogado para authenticated.
CREATE OR REPLACE FUNCTION public.create_ai_project(
  p_product_image_url TEXT,
  p_model_image_url   TEXT DEFAULT NULL,
  p_selected_model_id TEXT DEFAULT NULL,
  p_prompt            TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_project_id UUID;
  v_cost       INTEGER := 10;  -- Ajuste conforme regras de negócio
BEGIN
  -- Debitar ANTES de criar (falha atomicamente se saldo insuficiente)
  PERFORM public.debit_tokens(
    auth.uid(), v_cost, 'ai_project', NULL,
    'Geração de conteúdo IA - TikTok Shop'
  );

  INSERT INTO public.ai_projects (
    id, user_id, status, tokens_cost,
    product_image_url, model_image_url, selected_model_id, prompt
  ) VALUES (
    gen_random_uuid(), auth.uid(), 'pending', v_cost,
    p_product_image_url, p_model_image_url, p_selected_model_id, p_prompt
  ) RETURNING id INTO v_project_id;

  PERFORM public.log_action(
    auth.uid(), 'ai_project.create', 'ai_project', v_project_id
  );

  RETURN v_project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 6 — SUPABASE STORAGE (BUCKETS)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public) VALUES ('ai-assets',         'ai-assets',         false);
INSERT INTO storage.buckets (id, name, public) VALUES ('carousel-assets',   'carousel-assets',   false);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars',           'avatars',           true);
INSERT INTO storage.buckets (id, name, public) VALUES ('template-previews', 'template-previews', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('exports',           'exports',           false);

--
-- Estrutura esperada:
--   ai-assets/{user_id}/{project_id}/input/  → uploads do usuário
--   ai-assets/{user_id}/{project_id}/output/ → assets gerados pela IA
--   carousel-assets/{user_id}/{carousel_id}/slide_{index}/
--   avatars/{user_id}.jpg
--   exports/{user_id}/{carousel_id}/
--


-- ─────────────────────────────────────────────────────────────────────────────
-- SEÇÃO 7 — STORAGE POLICIES (VULN-05)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── ai-assets ────────────────────────────────────────────────────────────────
CREATE POLICY "Users can upload own AI assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'ai-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own AI assets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'ai-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own AI assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'ai-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── carousel-assets ───────────────────────────────────────────────────────────
CREATE POLICY "Users can upload own carousel assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'carousel-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own carousel assets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'carousel-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own carousel assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'carousel-assets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── exports ───────────────────────────────────────────────────────────────────
CREATE POLICY "Users can view own exports"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'exports'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── avatars ───────────────────────────────────────────────────────────────────
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND name = auth.uid()::text || '.jpg'
  );

-- ── template-previews (leitura pública; upload somente via service_role) ──────
CREATE POLICY "Anyone can view template previews"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'template-previews');


-- =============================================================================
-- FIM DO SCHEMA — InfHub v1.0
-- =============================================================================
