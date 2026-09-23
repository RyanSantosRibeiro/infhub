# Estrutura de Layout e Roteamento (Next.js App Router)

Este documento define a arquitetura de páginas, roteamento e as bibliotecas de interface que serão utilizadas no desenvolvimento do **InfHub**.

## 🗺️ Mapa de Rotas

O sistema será dividido em uma área pública (landing pages focadas em conversão) e uma área privada (o software em si).

### Páginas Principais (Públicas)
- `/` **(Home):** Landing page principal focada em exibir os **Modelos de IA** (Produto 1). Terá vitrines de imagens geradas, demonstração do fluxo e chamadas para ação.
- `/post-generator`: Landing page de vendas específica para o **Criador de Carrosséis** (Produto 2). Focada em demonstrar o Studio, os templates de alto engajamento e a automação com IA.

### Páginas Privadas (Requer Autenticação)
- `/admin`: O coração da plataforma. Raiz do painel de controle logado.
  - `/admin/studio`: O editor visual avançado (área principal de trabalho do usuário).
  - `/admin/templates`: Galeria de modelos prontos para carrosséis.
  - `/admin/trendings`: Feed de notícias para newsjacking.
- `/minha-conta`: Gerenciamento do perfil do usuário.
  - `/minha-conta/assinatura`: Área financeira onde o usuário visualiza o saldo de tokens, adere aos planos mensais (Mercado Pago) e compra tokens avulsos.

## 🔐 Autenticação Orientada a Eventos (Modais)

A plataforma **não terá** páginas isoladas de `/login` ou `/register`.
- **Fluxo via Modal Global:** Todo o fluxo de Entrada (Login), Cadastro e Saída (Logoff) será renderizado como um Modal (Popup elegante) sobreposto à tela atual.
- **Gatilho Inteligente:** Se um usuário não-autenticado clicar em botões como "Gerar Imagem" ou "Acessar Studio" nas Landing Pages, o Modal de Login abrirá imediatamente. Após o login, ele continua exatamente de onde parou, sem perda de contexto.

## 🎨 Arquitetura de UI e Componentes

Para garantir um design premium, altamente modular e com excelente experiência de usuário, as seguintes bibliotecas formam nosso *Design System*:

### 1. Biblioteca de Componentes UI: `shadcn/ui`
- **Por que usar:** É a biblioteca mais moderna do ecossistema React/Next.js. Ela não é um pacote fechado; ela instala o código-fonte de componentes (Cards, Modais, Dropdowns, Inputs) direto na pasta do seu projeto.
- **Vantagem:** Isso garante que tudo seja **100% modular e personalizável** usando TailwindCSS. Podemos alterar bordas, sombras e aplicar efeito "Glassmorphism" em qualquer componente com extrema facilidade.

### 2. Biblioteca de Ícones: `Phosphor Icons` (ou `Lucide React`)
- **A Escolha Estilosa:** O **Phosphor Icons** é incrivelmente elegante e moderno. Ele suporta pesos diferentes (Regular, Bold, Duotone). A versão *Duotone* (duas cores simultâneas no ícone) traz um ar muito sofisticado para plataformas SaaS. Outra excelente opção nativa do shadcn/ui é o **Lucide**, que é super limpo e profissional.

### 3. Animações e Fluidez: `Framer Motion`
- Usado para dar vida à interface. O Modal de login não vai apenas "aparecer", ele fará uma transição suave. O mesmo vale para os itens do carrossel no Studio, garantindo aquele feeling de aplicativo nativo.

### 4. Estilização Global: `TailwindCSS`
- Controle absoluto sobre o design. Facilita muito a implementação de temas (Claro e Escuro) de ponta a ponta.

## 📦 Estrutura de Pastas Esperada

```text
src/
 ├── app/
 │   ├── (public)/                 # Grupo de rotas públicas
 │   │   ├── page.tsx              # Rota: / (Home - IA)
 │   │   └── post-generator/       # Rota: /post-generator
 │   ├── (private)/                # Grupo protegido (verifica a sessão ativa)
 │   │   ├── admin/                # Rotas internas do editor
 │   │   └── minha-conta/
 │   │       └── assinatura/       # Gestão de Tokens/Mercado Pago
 │   ├── components/
 │   │   ├── ui/                   # Componentes modulares (shadcn: Cards, Buttons)
 │   │   ├── auth/                 # Modal Global de Login/Register
 │   │   └── layout/               # Header, Sidebar, Footer
```
