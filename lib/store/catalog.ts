export type OverlayTemplate = { id: string; name: string; collection: string; categories: string[]; image: string; theme: string; label: string; free?: boolean; badge?: string; };
export const templates: OverlayTemplate[] = [
  { id: "neon-rift", name: "Neon Rift", collection: "Pra quem nasceu pra jogar.", categories: ["Gaming", "IRL"], image: "/images/hero-neon.webp", theme: "neon", label: "STARTING SOON", badge: "FAVORITO DA GALERA" },
  { id: "cozy-club", name: "Cozy Club", collection: "Seu cantinho na internet.", categories: ["Just Chatting", "Música"], image: "/images/cozy-room.webp", theme: "cozy", label: "a live já vai começar", badge: "NOVO" },
  { id: "orbit", name: "Orbit", collection: "Leve sua live mais longe.", categories: ["Gaming", "Podcast"], image: "/images/cosmic-landscape.webp", theme: "orbit", label: "BE RIGHT BACK" },
  { id: "pure", name: "Pure", collection: "Menos ruído. Mais você.", categories: ["Just Chatting", "Educação", "Podcast"], image: "", theme: "pure", label: "let’s talk.", free: true },
  { id: "after-hours", name: "After Hours", collection: "A noite tem a sua vibe.", categories: ["Música", "IRL"], image: "/images/cozy-room.webp", theme: "after", label: "AFTER HOURS" },
  { id: "nova", name: "Nova", collection: "Ideias de outro universo.", categories: ["Gaming", "Educação"], image: "/images/cosmic-landscape.webp", theme: "nova", label: "STREAM IS LOADING" },
];
export const faqs = [
  { question: "O que é um overlay e como ele funciona no OBS?", answer: "Overlay é a camada visual da sua transmissão: moldura da webcam, telas de início e pausa, chat e redes sociais. No OBS, você adiciona os arquivos como fontes de imagem ou navegador. O pacote acompanha um guia de instalação passo a passo." },
  { question: "Qual a diferença entre Ready, Custom e AI Custom?", answer: "Ready personaliza um modelo pronto com seu nome e @. Custom permite escolher também cores, estilo e disposição dos elementos. AI Custom usa suas respostas para gerar um cenário exclusivo com inteligência artificial e compor o seu pacote." },
  { question: "Preciso pagar uma assinatura?", answer: "Não. O pagamento é único por pacote. Você baixa os arquivos e pode usá-los nas suas transmissões, sem mensalidade. Uma nova personalização ou outro pacote é uma nova compra." },
  { question: "O que vem no pacote de overlays?", answer: "Telas Starting Soon, Live, PC + webcam, Just Chatting, BRB e Ending; moldura de webcam, chat box visual, barra de redes, lower third, elementos visuais de alerta e transição em HTML. Inclui versões 16:9 e 9:16 e tutorial. Eventos reais de chat e alertas dependem da sua plataforma de transmissão." },
  { question: "Como recebo meus arquivos depois da compra?", answer: "Após a aprovação do Mercado Pago, seu pacote entra na fila de geração. A página de confirmação acompanha o processo e libera o download assim que estiver pronto. Guarde o link privado do seu pedido para voltar depois." },
  { question: "Posso experimentar antes de comprar?", answer: "Sim! Filtre por Grátis na galeria e baixe o Pure Starter, com tela de início, moldura de webcam e instruções. Sem cartão e sem cadastro." },
];
