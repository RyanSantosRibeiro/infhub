# Design System - InfHub

Este documento detalha as diretrizes visuais, paleta de cores e estética geral da interface do InfHub, garantindo que a plataforma tenha um visual "WOW", premium e perfeitamente alinhado com o foco principal: criadores do TikTok Shop e Instagram.

## 🎨 Identidade Visual (Conceito Geral)

A estética do InfHub será **Dark Mode First** (Foco absoluto no modo escuro).
Inspirado nas interfaces de softwares profissionais de edição, mas fortemente influenciado pela identidade visual energética do **TikTok / TikTok Shop**.

O design deve transparecer três pilares:
- **Alta Tecnologia & IA:** Uso de brilhos sutis (glow), bordas com efeitos luminosos dinâmicos e fundos em "glassmorphism" (vidro fosco).
- **Ação & Conversão:** Cores neon de alto contraste para guiar o olhar do usuário direto para os botões principais e áreas de configuração.
- **Familiaridade:** Fazer o criador de conteúdo do TikTok se sentir "em casa".

## 🖌️ Paleta de Cores (Inspiração TikTok Shop)

O TikTok utiliza um contraste extremo entre o fundo escuro e cores neon vibrantes: Ciano (Azul Água) e Magenta (Vermelho/Rosa). A nossa paleta vai adotar essa combinação para uma estética agressiva e moderna.

### Cores de Fundo (Backgrounds & Surfaces)
- **Background Principal:** Escuro profundo com um levíssimo toque de azul noturno para não ser um preto chapado e sem vida.
  - Sugestão Tailwind: `bg-slate-950` (`#020617`) ou `#0B0F19`
- **Superfícies (Painéis Laterais, Modais, Cards):**
  - Sugestão Tailwind: `bg-slate-900` (`#0F172A`)
  - Uso de bordas ultrafinas para delinear componentes: `border-slate-800` (`#1E293B`)
- **Glassmorphism:** Fundos semitransparentes com *backdrop-blur* pesados para menus flutuantes (ex: o modal de Configuração de Fontes).

### Cores de Destaque (Brand & Accents)
- **InfHub Magenta/Red:** `#FE2C55` (Cor inspirada no vermelho do TikTok)
  - **Uso:** Botões primários de conversão ("Assinar", "Pagar"), alertas, *badges* e interações de exclusão (lixeira).
- **InfHub Cyan/Blue:** `#25F4EE` (Cor inspirada no ciano do TikTok)
  - **Uso:** Links, textos de destaque no código, interruptores (toggles) ativados, e sliders (barras de progresso/volume).

### Gradientes Especiais ("Mágica da IA")
Para elementos que representam a Inteligência Artificial (ex: botão "✨ Gerar com IA", "Refinar slide" ou badges "Pro"), não usaremos cores sólidas. Usaremos uma fusão vibrante.
- **Gradiente IA:** Uma transição diagonal do Ciano para o Magenta.
  - Tailwind: `bg-gradient-to-r from-[#25F4EE] via-purple-500 to-[#FE2C55]`

## 🖋️ Tipografia

Para garantir legibilidade perfeita no modo escuro e um tom "tech":

- **Fonte de Títulos (Headings):** `Outfit` ou `Plus Jakarta Sans`. Trazem um aspecto muito moderno, arrojado e limpo, perfeito para os títulos dos slides gerados e grandes chamadas na landing page.
- **Fonte de Interface (Body/UI):** `Inter`. A fonte padrão para garantir leitura clara nos painéis de ferramentas, botões pequenos e sliders do Studio.

## 📦 Componentes & Interações (Aesthetics UI)

### Botões e Call-to-Actions (CTAs)
- **Primários (Ação Principal):** Fundo com o gradiente da IA, texto em branco com peso `bold`, cantos levemente arredondados (`rounded-xl`).
  - *Interação:* Ao passar o mouse (hover), a intensidade do gradiente muda e cria-se um leve brilho externo (Glow Effect) da mesma cor.
- **Secundários (Ações de Interface):** Fundo `slate-800`, borda fina, texto cinza claro.
  - *Interação:* Fundo clareia para `slate-700` no hover.

### Layout do Editor (Studio)
- **Canvas Principal (Preview):** A área onde o carrossel fica visível deve parecer uma "mesa de edição". O fundo será o mais escuro possível, e os slides flutuarão acima com uma leve sombra (Drop Shadow) para dar profundidade.
- **Controles (Sliders e Toggles):** A trilha de preenchimento dos sliders (como Opacidade e Zoom) será na cor Ciano (`#25F4EE`). Os botões de ativação (como o de "Glass ao redor do conteúdo") acenderão em Magenta.

### Micro-interações (Framer Motion)
Nada de elementos estáticos e secos.
- **Modais:** O modal de Login e os modais de geração de IA devem surgir com um efeito de escala elástica (spring animation).
- **Abas:** Ao trocar de ferramentas no menu lateral (ex: de "Imagens" para "Texto"), um indicador animado deve deslizar suavemente para a nova aba selecionada.
