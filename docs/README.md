# InfHub - Plataforma para Criadores de Conteúdo

Uma plataforma desenvolvida para ajudar criadores de conteúdo a gerarem materiais visuais de alta conversão usando Inteligência Artificial e ferramentas de edição rápida.

## 🚀 Principais Produtos

### 1. Modelos de IA + Personalização (Foco em TikTok Shop)
Permite a criação de imagens e vídeos de alta qualidade para vendas.
- **Fluxo do Usuário:**
  - O usuário faz o upload de uma foto própria ou seleciona um modelo (avatar/IA) pré-existente.
  - O usuário faz o upload do produto que deseja vender.
  - **Entregável:** O sistema gera um pacote contendo *X imagens* e *1 vídeo completo* focado em vendas para o TikTok Shop.

### 2. Criador de Carrossel para Instagram (Infocards)
Uma ferramenta de design focada na criação de infocards em sequência.
- **Recursos para o Usuário:**
  - Geração ou upload de imagens em sequência.
  - Edição de conteúdo: Título, subtítulo, botão de ação (CTA).
  - Posicionamento de elementos: Esquerda, direita, centro, superior, inferior, etc.
  - Exportação das imagens finais em formato de carrossel.
- **Painel Administrativo/Editor:**
  - Seleção de qual imagem (slide) do carrossel está sendo editada.
  - Personalização de estilos: Cor de destaque, gradientes (degradê), fontes, etc.

## 💰 Modelo de Negócios e Monetização

O sistema de cobrança é baseado em **Tokens**, processado via **Mercado Pago**.

- **Assinatura Mensal (Recomendado):**
  - O usuário paga um valor fixo mensal e recebe *X tokens*.
  - Os tokens podem ser gastos livremente em qualquer serviço da plataforma (IA ou Carrossel).
  - O plano de assinatura foi desenhado para ser sempre a opção com melhor custo-benefício.
- **Compras Avulsas (Testes/On-demand):**
  - O usuário pode comprar pacotes avulsos de tokens ou pagar um valor *Y* específico por um pacote do "Produto 1" (Modelos de IA).
  - Ideal para quem quer testar a plataforma antes de se comprometer, mas estrategicamente precificado para incentivar a assinatura.

## 🛠 Stack Tecnológico

- **Frontend:** Next.js (React, TailwindCSS)
- **Backend as a Service:** Supabase
  - **Autenticação:** Supabase Auth
  - **Banco de Dados:** PostgreSQL (Supabase)
  - **Armazenamento (Storage):** Supabase Storage (para fotos, vídeos, imagens do carrossel)
- **Pagamentos:** Mercado Pago (Checkout, Webhooks para controle de assinatura e adição de tokens)

## 🗺 Próximos Passos (Roadmap)

1. **Estruturação Inicial (Concluído)**: Definição de escopo e produtos descritos neste documento.
2. **Modelagem de Dados**: Estruturar as tabelas do Supabase (Usuários, Assinaturas, Tokens, Projetos de IA, Carrosséis, etc.).
3. **Configuração de Infraestrutura**: Setup inicial do Supabase, chaves do Mercado Pago e ambiente Next.js.
4. **Desenvolvimento do Core**: Autenticação de usuários e sistema de saldo de Tokens.
5. **Desenvolvimento do Produto 2 (Carrossel)**: Interface do editor visual e exportação.
6. **Desenvolvimento do Produto 1 (IA)**: Integração com APIs de geração de imagem/vídeo.

## 🖼️ Referências de Interface (Análise de Funcionalidades)

### Referência 1: Editor de Carrossel (MyPostFlow Studio)
A imagem analisada demonstra uma interface robusta para a criação e edição de carrosséis (Infocards). As principais funcionalidades extraídas da interface são:

**1. Barra Lateral Esquerda (Menu de Edição e Configuração):**
- **Configurações Gerais:**
  - Estilo do Post e Templates de Estilo (seleção rápida de temas).
  - Gerar com IA (provável assistente para geração de textos ou estruturação).
  - Identidade Visual (configurações de branding).
- **Edição Específica por Slide (ex: CONTEÚDO - SLIDE 01):**
  - Layout do Slide (definição da estrutura visual).
  - Conteúdo do Slide (textos, títulos, descrições).
  - Imagem (upload ou inserção de mídia no slide).
- **Estilos Globais:**
  - Cores & Gradiente (aplicação em massa para todos os slides para manter a consistência).

**2. Barra Superior (Ações e Navegação):**
- Seletor de Formato/Proporção (ex: "Stories", indicando suporte a 1080x1920px).
- Histórico de Ações: Desfazer (Undo) e Refazer (Redo).
- Navegador de Slides (`< Slide 1 de 8 >`) com botões rápidos para Adicionar (+) e Excluir.
- **Ações de Finalização:**
  - "Baixar Slide 1" (Exportação individual).
  - "Baixar Todos" (Exportação do pacote completo).
  - "Salvar" (Gravar progresso do projeto).
  - "Gerar Legenda" (Destaque para um recurso de IA que cria a legenda do post baseada no conteúdo).
- Opções do Sistema: Modo Claro/Escuro e menu de Perfil.

**3. Área Principal de Edição (Canvas / Preview):**
- Visualização simultânea e lado a lado dos slides, facilitando o design em sequência (storyboard).
- Exclusão rápida: Ícone de lixeira no canto superior direito de cada slide.
- **Variações de Layout Identificadas:**
  - **Capa (Slide 1):** Fundo escuro com grande tipografia e palavras-chave destacadas (highlight em gradiente).
  - **Conteúdo (Slides 2, 3 e 4):** Layout tipo "card" (cartão sobreposto ao fundo gradiente), utilizando pequenas tags/pílulas de categoria no topo (ex: "OTIMIZAÇÃO DE TEMPO"), títulos claros, texto corrido e *placeholders* (espaços reservados) para imagens. Notou-se flexibilidade na posição da imagem (abaixo ou acima do texto, dependendo do slide).

### Referência 2: Galeria de Templates (Modelos Prontos)
A segunda imagem apresenta a tela de exploração de templates, focada em agilizar o início do processo criativo. Funcionalidades extraídas:

**1. Menu Lateral de Navegação (Dashboard Geral):**
- **Geral:** Dashboard, Studio (o editor em si), Templates (página ativa), Trendings (com badge "New" para recursos em alta), Organização, Calendário (provável agendamento de posts), Members (gestão de equipes/membros).
- **Links Úteis:** Guia Completo, API Gemini (indicando integração direta com IAs generativas).
- **Rodapé:** Configurações.

**2. Cabeçalho Principal (Header):**
- **Busca Global:** Barra de pesquisa omnibox para "Buscar carrosséis, templates, organização...".
- **Ações Globais:** Botão de alternância de tema escuro/claro.

**3. Área de Listagem de Templates:**
- **Grid de Opções:** Exibição em formato de grade (grid) dos layouts pré-construídos ("Modelos prontos").
- **Estrutura do Card de Template:**
  - **Preview Visual:** Imagem em miniatura mostrando exatamente o estilo do carrossel (ex: fundos claros, escuros, ou no formato de postagem de outras redes como o Twitter/X).
  - **Nome e Categorização:** Título do estilo (ex: "Minimalista", "Profile", "Creators") acompanhado de tags visuais para segmentação (ex: "Mais popular", "Estilo Twitter/X", "Novo").
  - **Descrição Estratégica:** Breve explicação de onde aquele template brilha (ex: "O estilo mais versátil...", "Ideal para autoridade...").
  - **Call to Action (CTA):** Botão principal chamativo com gradiente vibrante ("✨ Usar template") para instanciar o carrossel no Studio.

### Referência 3: Área de Trendings (Notícias em Alta)
Esta imagem mostra uma funcionalidade focada na criação de conteúdo contextual e ágil (Newsjacking), convertendo manchetes reais em carrosséis de forma automatizada. Funcionalidades extraídas:

**1. Cabeçalho, Busca e Filtros:**
- **Título e Proposta de Valor:** "Trendings: Pesquise manchetes reais e gere carrosséis baseados em notícias atuais".
- **Busca Específica:** Uma barra de pesquisa focada em buscar dados dentro do painel de notícias ("Pesquise por tema, nicho ou evento...").
- **Filtros Temporais (Período):** Botões em formato de tags ("Hoje", "Esta semana", "Este mês", "Qualquer data") para afunilar a busca de tendências.
- **Resumo de Resultados:** Um indicador visual mostrando o volume de notícias encontradas (ex: "24 manchetes em destaque agora · Hoje").

**2. Listagem de Notícias (Feed):**
- Apresentação em formato de grade (grid) contendo as principais manchetes.
- **Estrutura do Card de Notícia:**
  - **Identificação e Recência:** A fonte da notícia (ex: G1, CNN Brasil, Folha de S.Paulo, com ponto de identificação por cor) posicionada à esquerda e o tempo decorrido desde a publicação (ex: "5h atrás") à direita.
  - **Conteúdo em Texto:** Título da notícia em destaque (negrito) e uma linha de subtítulo/resumo para dar contexto.
  - **Ações Disponíveis:**
    - Link secundário: "Ler completa" para abrir a matéria original.
    - **Ação Principal (Conversão Mágica):** Botão destacado "✨ Gerar carrossel". Essa é a funcionalidade chave da página: ao clicar, o sistema deve integrar com a IA para ler a notícia, resumir, criar os tópicos do slide e enviar tudo pré-preenchido para a tela do editor (Studio).

### Referência 4: Assistente de Criação com IA (Wizard)
Estas imagens detalham o fluxo passo a passo (modal de 6 etapas) para geração automatizada de carrosséis usando Inteligência Artificial. Este é o coração da funcionalidade "Gerar com IA" que propomos. Funcionalidades extraídas por etapa:

**Passo 1/6: Formato do Post**
- Escolha da proporção (Aspect Ratio) do conteúdo final:
  - Carrossel tradicional (4:5 - 1080x1350px)
  - Quadrado (1:1 - 1080x1080px)
  - Stories / Reels (9:16 - 1080x1920px)

**Passo 2/6: Conteúdo Base e Parâmetros**
- **Input de Texto (Prompt):** Área de texto livre "Sobre o que é o conteúdo?" para instruir a IA.
- **Integração Externa:** Botão auxiliar "Buscar notícias recentes sobre o tema", que deve injetar dados da web/trendings no prompt.
- **Controle de Autonomia da IA:** Checkbox "Conteúdo exato". Se marcado, a IA funciona apenas como um "paginador" (distribuindo o texto fornecido pelos slides sem reescrever ou adicionar conteúdo novo).
- **Volume e Idioma:** Seletor de Idioma (ex: Português BR) e um grid visual de botões numéricos (1 a 20) para ditar à IA exatamente quantos slides o carrossel deve ter.

**Passo 3/6: Estilo Visual Base**
- Seleção de layout estrutural base a partir dos Templates do sistema (ex: Minimalista, Profile, TechViral). A IA usará este esqueleto visual para preencher os dados.

**Passo 4/6: Engenharia de Imagens**
- **Direcionamento de Layout:** Escolha de como as mídias se comportarão (Sem imagens, Imagem de fundo, Grade de imagens, Intercalar ambas).
- **Geração Mágica (Integração LLM/Vision):** Toggle/Checkbox para "Gerar imagens com IA" usando provedores (ex: Google Gemini, DALL-E, Midjourney).
- **Prompt Estético:** Campo de texto dedicado ao estilo da imagem (ex: "Fotografia editorial, tons neutros, fundo clean..."). Permite separar o prompt de texto do prompt de imagem.
- **Referências Visuais (Image-to-Image):** Input para upload ou "colar imagem" para que a IA extraia cores, estilos ou contextos visuais.

**Passo 5/6: Ajuste Fino e Branding (Tipografia)**
- **Mapeamento de Mídia:** Seletor de índice de slides (1, 2, 3...) para definir exatamente quais telas terão imagens geradas pela IA e quais serão apenas texto.
- **Watermark / Handle:** Campo para inserir o "@ do Instagram", que o sistema aplica automaticamente nos cantos predefinidos do layout escolhido.
- **Combinação de Fontes:** Dropdown de tipografia para pareamento de fontes (ex: "Space + Inter").

*(Nota: O passo 6/6 não foi visualizado, presumivelmente engloba a tela de processamento ("Gerando...") ou o resumo final antes de instanciar o Studio).*

### Referência 5: Edição Fina de Imagens (Studio)
Esta imagem mostra a interface do editor principal (Studio) quando o usuário seleciona e edita uma imagem específica dentro de um slide. Funcionalidades extraídas:

**1. Painel Lateral (Propriedades da Imagem):**
- **Contexto Ativo:** Menu específico de "Imagem de Fundo" aberto para ajustes detalhados.
- **Controle de Mídia:**
  - Preview/Miniatura da imagem atual com ícone rápido de exclusão (lixeira) on-hover.
  - Suporte de Clipboard: Botão "Colar Imagem" para facilitar a importação rápida.
  - **Ação Rápida de IA:** Botão "✨ Gerar Imagem com IA" disponível diretamente nas propriedades. Isso permite regenerar ou substituir a imagem pontualmente sem precisar refazer todo o carrossel.
- **Controles Geométricos (Sliders Visuais):**
  - **Panorâmica (Posição):** Controles independentes para deslocar a imagem no eixo X (`<-->`, Posição Horizontal) e no eixo Y (`⬆⬇`, Posição Vertical).
  - **Escala:** Slider de "Zoom %" para aproximar cortes específicos da imagem.
- **Efeitos e Transformações:**
  - **Espelhamento:** Toggle switch para "Espelhar horizontalmente" a imagem (Flip).
  - **Transparência:** Slider de "Opacidade %" para criar efeitos de marca d'água ou fundos mais sutis sob o texto.
- **Modos de Enquadramento:**
  - Controles rápidos de preenchimento CSS (Object-Fit): "Preencher" (Cover) e "Inteira/Fundo" (Contain).

**2. Integração no Canvas (Preview):**
- Demonstra a aplicação prática dos controles: no Slide 1, uma imagem complexa (cinemática) preenche perfeitamente o fundo. Os controles de opacidade e posicionamento garantem que elementos de texto sobrepostos (ex: "CLAUDE FABLE 5" e a marca d'água "@seuperfil") continuem com excelente legibilidade.

### Referência 6: Edição Avançada de Layout e Global (Studio)
Essas três imagens detalham painéis de configuração mais profundos dentro do Studio, demonstrando como o usuário pode manipular a macroestrutura visual, textos e elementos periféricos do carrossel.

**1. Configurações de Cantos (Watermarks e Metadados):**
- **Painel "Cantos":** Controle preciso sobre os elementos que ficam nas extremidades do slide (comuns no Instagram para retenção e branding).
- **Mapeamento de 4 Pontos:** Quatro inputs de texto, cada um com um botão liga/desliga independente:
  - Superior Esquerdo (ex: Handle "@seuperfil")
  - Superior Direito (ex: Categoria "IA Pós-Mito")
  - Inferior Esquerdo (ex: Rodapé "O Futuro da Anthropic")
  - Inferior Direito (ex: CTA "arrasta")
- **Toggles Globais:**
  - "Exibir cantos": Interruptor mestre para ocultar/mostrar todas as informações periféricas.
  - "Indicadores de quantidade": Toggle para ativar os pontinhos de progresso (ex: `......`) no rodapé do slide.
- **Estilização dos Cantos:** Sliders para ajuste milimétrico: "Tamanho da fonte", "Distância das bordas" (padding) e "Opacidade do texto".
- **Ícones Rápidos:** Grid visual para selecionar ícones nativos (ex: seta `>`, bookmark, compartilhar) para o canto inferior direito, complementando o texto de arraste.

**2. Configuração de Layout de Texto:**
- **Ancoragem Espacial (Grid 3x3):** Um controle de interface elegante com 9 botões permitindo fixar o bloco de texto principal em qualquer direção geométrica do slide (Superior/Meio/Inferior x Esquerda/Centro/Direita).
- **Legibilidade (Glassmorphism):** Toggle switch "Glass ao redor do conteúdo". Um recurso vital de UI que aplica um fundo desfocado (backdrop-filter) atrás do texto para garantir que ele possa ser lido mesmo em cima de imagens ruidosas.
- **Margens e Respiro (Paddings Internos):**
  - "Horizontal": Slider de controle de espaço entre o texto e as laterais do slide.
  - "Vertical": Slider de controle de espaço entre o topo/base.
- **Produtividade (Replicação):** Botão "Aplicar configurações no próximo slide" sob a seção "REPLICAR ENTRE SLIDES", permitindo escalar configurações sem esforço manual repetitivo.

### Referência 7: Dinâmica de Layouts Internos e Estilos Temáticos
Estas imagens mostram a versatilidade do Studio ao adaptar o conteúdo para diferentes templates estruturais (focando nos templates "Profile/Twitter" e "TechViral").

**1. Template "Profile" (Estilo X/Twitter):**
- **Design no Canvas:** Simula perfeitamente uma thread/post da rede social X, contendo a foto de perfil arredondada, nome do autor, selo de verificação azul e o "handle" (ex: @eu.wesleysilv4) no cabeçalho. O corpo do texto segue a formatação clássica em lista ou parágrafos curtos.
- **Painel "Layout das Imagens" (Múltiplas Mídias):**
  - **Grade de Organização:** O sistema permite agrupar imagens dentro do slide, mimetizando os anexos das redes sociais. Opções: "Sem thumbnail", "1 thumbnail (16:9)", "2 verticais", "4 quadradas (2x2)".
  - **Ancoragem (Posição das Imagens):** Controle de fluxo do documento, decidindo onde a mídia deve ser injetada em relação ao texto: "Acima do cabeçalho", "Abaixo do cabeçalho", "Após 1º parágrafo" ou "Abaixo do texto".
  - **Input Direto:** Área de Dropzone para arrastar/soltar imagens ou o botão utilitário "Colar Imagem".
- **Refinamento com IA:** No topo da barra há um card "Refinar este slide", que funciona como um copilot local. Ele exibe prompts rápidos ("deixe mais agressivo", "encurte a descrição") para a IA reescrever apenas o conteúdo do slide atual.

**2. Template "TechViral" (Impacto Visual):**
- **Design no Canvas:** Estilo agressivo e moderno. O Slide de Capa usa imagem de fundo sangrada (ocupando toda a tela) com tipografia pesada. O Slide de Conteúdo utiliza um sistema de "Cards" com tags de categoria no topo (ex: "DESAFIO DA CRIAÇÃO MANUAL").
- **Tipografia com Highlight:** Uma funcionalidade central desse estilo é o "marca-texto" aplicado a palavras-chave (ex: "CARROSSEIS VIRAIS COM IA" destacado com gradiente rosa/roxo), aumentando drasticamente a retenção de leitura.
- **Engenharia de Legibilidade (Sobreposição / Sombra):**
  - No painel da imagem, foi identificada a seção vital "Sobreposição / Sombra", usada para adicionar um *gradient overlay* escuro por cima da imagem.
  - Possui um Dropdown de estilo (ex: "Base forte", focando em escurecer a parte de baixo) e um slider de "Opacidade" (ex: 90%). Isso é fundamental para garantir que textos brancos não "desapareçam" quando a IA gerar ou o usuário subir uma imagem de fundo muito clara.
