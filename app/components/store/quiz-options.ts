import {
  Aperture, Briefcase, Broadcast, CameraSlash, ChatCircleDots, Code,
  Coffee, FlagCheckered, GameController, GraduationCap, Handshake,
  MicrophoneStage, MinusCircle, MonitorPlay, MusicNotes, Play,
  QrCode, ShareNetwork, Sparkle, Stack, Target, TiktokLogo,
  TwitchLogo, Users, Waveform, Wind, YoutubeLogo, Lightning,
} from "@phosphor-icons/react";

export const categories = [
  { name: "Game", icon: GameController, description: "Seu próximo GG" },
  { name: "Podcast", icon: MicrophoneStage, description: "Dê voz às ideias" },
  { name: "Just Chatting", icon: ChatCircleDots, description: "Papo que conecta" },
  { name: "Programação", icon: Code, description: "Codando ao vivo" },
  { name: "Aula", icon: GraduationCap, description: "Conhecimento ao vivo" },
  { name: "Business", icon: Briefcase, description: "Empreendedorismo" },
  { name: "Música", icon: MusicNotes, description: "O palco é seu" },
  { name: "IRL", icon: Broadcast, description: "A vida sem roteiro" },
  { name: "Outro", icon: Sparkle, description: "Do seu jeito" },
];

export const platforms = [
  { name: "YouTube", icon: YoutubeLogo, description: "Dê o play na sua live", tone: "youtube" },
  { name: "Twitch", icon: TwitchLogo, description: "O chat é sua casa", tone: "twitch" },
  { name: "Kick", icon: MonitorPlay, description: "Entre no jogo", tone: "kick" },
  { name: "TikTok", icon: TiktokLogo, description: "Conecte-se ao vivo", tone: "tiktok" },
  { name: "Várias plataformas", icon: ShareNetwork, description: "Sua comunidade, em todo lugar", tone: "multi" },
];

export const styles = [
  { name: "Minimalista", className: "minimal", description: "Menos é mais" },
  { name: "Clean", className: "clean", description: "Leve e organizado" },
  { name: "Futurista", className: "future", description: "Além do agora" },
  { name: "Gamer", className: "gamer", description: "Pura energia" },
  { name: "Dark", className: "dark", description: "Presença e mistério" },
  { name: "Neon", className: "neon", description: "Deixe brilhar" },
  { name: "Luxury", className: "luxury", description: "Cada detalhe importa" },
  { name: "Corporate", className: "corporate", description: "Sua melhor versão" },
  { name: "Anime", className: "anime", description: "Seu próprio universo" },
  { name: "Pixel", className: "pixel", description: "Nostalgia em 8-bits" },
  { name: "Outro", className: "other", description: "Fora da caixinha" },
];

export const webcams = [
  { name: "Superior esquerda", position: "top-left" },
  { name: "Superior direita", position: "top-right" },
  { name: "Inferior esquerda", position: "bottom-left" },
  { name: "Inferior direita", position: "bottom-right" },
  { name: "Sem webcam", position: "none", icon: CameraSlash },
];

export const extraElements = [
  { name: "Chat", icon: ChatCircleDots, description: "A conversa na tela" },
  { name: "Seguidores", icon: Users, description: "Sua comunidade" },
  { name: "Meta", icon: Target, description: "Cada conquista conta" },
  { name: "Patrocinador", icon: Handshake, description: "Espaço para parceiros" },
  { name: "Redes sociais", icon: ShareNetwork, description: "Conecte seus canais" },
  { name: "QR Code", icon: QrCode, description: "Um atalho na tela" },
  { name: "Nada", icon: MinusCircle, description: "Só o essencial" },
];

export const sceneOptions = [
  { name: "Em breve (Starting Soon)", title: "Em breve", description: "Starting Soon", icon: Play },
  { name: "Já volto (Be Right Back)", title: "Já volto", description: "Be Right Back", icon: Coffee },
  { name: "Fim de live (Ending)", title: "Fim de live", description: "Stream Ending", icon: FlagCheckered },
  { name: "Just Chatting (Apenas Conversa)", title: "Just Chatting", description: "Apenas conversa", icon: ChatCircleDots },
  { name: "Gameplay (Jogo/Tela Principal)", title: "Gameplay", description: "Jogo / tela principal", icon: GameController },
];

export const animations = [
  { name: "Discreta", description: "Movimentos suaves. O foco fica em você.", icon: Wind, level: "soft" },
  { name: "Intermediária", description: "Um pouco de movimento, na medida certa.", icon: Waveform, level: "medium" },
  { name: "Chamativa", description: "Energia e presença em cada detalhe.", icon: Lightning, level: "bold" },
];

export const palettes = [
  { name: "Neon night", colors: ["#AA7DF7", "#17121F", "#59E1E8"] },
  { name: "Cozy mood", colors: ["#E9B8CB", "#F3DFB7", "#665477"] },
  { name: "Cyber green", colors: ["#C6F779", "#151D1A", "#E3E8DB"] },
  { name: "Ocean blue", colors: ["#69CFF6", "#112C4C", "#D6F1FA"] },
];

export const headings = [
  { title: "O que você transmite?", description: "Todo conteúdo tem uma identidade. Qual é a sua?", group: "Sua live", hint: "Escolha uma opção", icon: Broadcast },
  { title: "Onde você transmite?", description: "Vamos pensar no visual para a sua comunidade.", group: "Sua live", hint: "Escolha uma opção", icon: MonitorPlay },
  { title: "Qual é o seu estilo?", description: "Encontre a estética que tem a sua cara.", group: "Identidade", hint: "Escolha uma estética", icon: Sparkle },
  { title: "Sua paleta, sua assinatura.", description: "Comece com uma combinação ou conte suas próprias cores.", group: "Identidade", hint: "2 a 4 cores ou um link de logo", icon: Aperture },
  { title: "Agora, o protagonista.", description: "Como você quer aparecer na sua próxima live?", group: "Identidade", hint: "Sua identidade no overlay", icon: Users },
  { title: "Qual o lugar da webcam?", description: "Escolha onde você quer aparecer na tela.", group: "Seu layout", hint: "Os desenhos mostram a posição", icon: MonitorPlay },
  { title: "O que mais vai na tela?", description: "Deixe espaço para o que faz parte da sua live.", group: "Seu layout", hint: "Pode escolher mais de um", icon: Stack },
  { title: "Cada momento, uma cena.", description: "As cinco essenciais já estão selecionadas. Ajuste como quiser.", group: "Seu layout", hint: "Selecione as cenas do seu pack", icon: MonitorPlay },
  { title: "Qual é o ritmo da sua live?", description: "Do sutil ao vibrante. Você escolhe a energia.", group: "Os detalhes", hint: "Escolha a intensidade", icon: Waveform },
  { title: "Tem algo em mente?", description: "Uma referência ajuda a traduzir o que você imaginou.", group: "Os detalhes", hint: "Opcional · vale uma ideia ou um link", icon: Sparkle },
  { title: "Seu próximo level.", description: "Tudo com a sua cara. Agora escolha seu pacote.", group: "Seu pacote", hint: "Pagamento único, sem assinatura", icon: Sparkle },
];
