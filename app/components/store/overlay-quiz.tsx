"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft, ArrowRight, Broadcast, ChatCircleDots, Check,
  GameController, GraduationCap, MicrophoneStage, MusicNotes, Sparkle,
  MonitorPlay, DeviceMobileCamera, Desktop, ShareNetwork
} from "@phosphor-icons/react";
import { CheckoutModal, type OverlayBrief, type OverlayPlan } from "./checkout-modal";
import "./quiz.css";

const categories = [
  { name: "Game", icon: GameController, description: "Seu próximo GG" },
  { name: "Podcast", icon: MicrophoneStage, description: "Dê voz às ideias" },
  { name: "Just Chatting", icon: ChatCircleDots, description: "Papo que conecta" },
  { name: "Programação", icon: Desktop, description: "Codando ao vivo" },
  { name: "Aula", icon: GraduationCap, description: "Conhecimento ao vivo" },
  { name: "Business", icon: ShareNetwork, description: "Empreendedorismo" },
  { name: "Música", icon: MusicNotes, description: "O palco é seu" },
  { name: "IRL", icon: Broadcast, description: "A vida sem roteiro" },
  { name: "Outro", icon: Sparkle, description: "Conteúdo único" },
];

const platforms = [
  { name: "YouTube" },
  { name: "Twitch" },
  { name: "Kick" },
  { name: "TikTok" },
  { name: "Várias plataformas" },
];

const styles = [
  { name: "Minimalista", className: "minimal", description: "Menos, mas com presença" },
  { name: "Clean", className: "clean", description: "Claro e organizado" },
  { name: "Futurista", className: "future", description: "Um passo à frente" },
  { name: "Gamer", className: "gamer", description: "Ação e energia" },
  { name: "Dark", className: "dark", description: "Misterioso e elegante" },
  { name: "Neon", className: "neon", description: "Luzes e cores vivas" },
  { name: "Luxury", className: "luxury", description: "Premium e sofisticado" },
  { name: "Corporate", className: "corporate", description: "Profissional" },
  { name: "Anime", className: "anime", description: "Estilo animação oriental" },
  { name: "Pixel", className: "pixel", description: "Retro e 8-bits" },
  { name: "Outro", className: "other", description: "Algo diferente" },
];

const webcams = [
  "Superior esquerda",
  "Superior direita",
  "Inferior esquerda",
  "Inferior direita",
  "Sem webcam"
];

const extraElements = [
  "Chat",
  "Seguidores",
  "Meta",
  "Patrocinador",
  "Redes sociais",
  "QR Code",
  "Nada"
];

const defaultScenes = [
  "Em breve (Starting Soon)",
  "Já volto (Be Right Back)",
  "Fim de live (Ending)",
  "Just Chatting (Apenas Conversa)",
  "Gameplay (Jogo/Tela Principal)"
];

const animations = [
  { name: "Discreta", description: "Movimentos suaves e sutis" },
  { name: "Intermediária", description: "Equilíbrio entre estático e dinâmico" },
  { name: "Chamativa", description: "Animações impactantes e constantes" }
];

const plans: { id: OverlayPlan; name: string; price: string; description: string }[] = [
  { id: "ready", name: "Ready", price: "29,90", description: "Um modelo pronto com seu nome e @." },
  { id: "custom", name: "Custom", price: "59,90", description: "Sua identidade em um modelo personalizável." },
  { id: "ai", name: "AI Custom", price: "99,90", description: "Um universo visual criado por IA para você." },
];

const headings = [
  { title: "O que você transmite?", description: "Conta pra gente o que rola na sua live." },
  { title: "Onde você transmite?", description: "Em qual plataforma você brilha?" },
  { title: "Qual o seu estilo?", description: "Escolha a estética que tem a sua cara." },
  { title: "Quais são suas cores?", description: "Selecione de 2 a 4 cores ou nos envie a sua logo." },
  { title: "Qual seu nome ou @?", description: "Vamos colocar sua identidade nesse universo." },
  { title: "Onde você quer sua webcam?", description: "Posicione sua câmera na tela." },
  { title: "O que mais precisa aparecer?", description: "Escolha os elementos extras para sua tela." },
  { title: "Quais cenas você deseja?", description: "O sistema já marca as cinco padrão." },
  { title: "Como você quer a animação?", description: "Defina o movimento e a energia do overlay." },
  { title: "Referências", description: "Descreva algo parecido com o que você imagina ou cole links." },
  { title: "Seu próximo level.", description: "Escolha como você quer dar vida à sua live." },
];

export function OverlayQuiz({ initialCategory = "Game" }: { initialCategory?: string }) {
  const id = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);

  // States for form data
  const [category, setCategory] = useState(
    categories.find((item) => item.name.toLowerCase() === initialCategory.toLowerCase())?.name ?? "Game"
  );
  const [platform, setPlatform] = useState("Twitch");
  const [style, setStyle] = useState("Neon");
  const [colors, setColors] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [webcam, setWebcam] = useState("Superior direita");
  const [elements, setElements] = useState<string[]>([]);
  const [scenes, setScenes] = useState<string[]>([...defaultScenes]);
  const [customScenes, setCustomScenes] = useState("");
  const [animation, setAnimation] = useState("Intermediária");
  const [references, setReferences] = useState("");
  
  const [plan, setPlan] = useState<OverlayPlan>("ai");
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const heading = headings[step];
  const brief: OverlayBrief = {
    category,
    platform,
    style,
    colors,
    name: name.trim(),
    handle: handle.trim(),
    webcam,
    elements,
    scenes: customScenes.trim() ? [...scenes, customScenes.trim()] : scenes,
    animation,
    references
  };

  function changeStep(next: number) {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  }

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 10) setCheckoutOpen(true);
    else changeStep(step + 1);
  }

  function toggleElement(element: string) {
    if (element === "Nada") {
      setElements(["Nada"]);
      return;
    }
    setElements(prev => {
      const filtered = prev.filter(e => e !== "Nada");
      if (filtered.includes(element)) return filtered.filter(e => e !== element);
      return [...filtered, element];
    });
  }

  function toggleScene(scene: string) {
    setScenes(prev => {
      if (prev.includes(scene)) return prev.filter(e => e !== scene);
      return [...prev, scene];
    });
  }

  const renderStepContent = () => {
    switch (step) {
      case 0: // Category
        return (
          <fieldset className="quiz-options">
            <legend className="quiz-sr-only">Seu tipo de conteúdo</legend>
            {categories.map(({ name: categoryName, description, icon: Icon }) => (
              <label className={`quiz-choice ${category === categoryName ? "is-selected" : ""}`} key={categoryName}>
                <input type="radio" name={`${id}-category`} value={categoryName} checked={category === categoryName} onChange={() => setCategory(categoryName)} />
                <Icon size={24} weight={category === categoryName ? "fill" : "regular"} aria-hidden="true" />
                <span><strong>{categoryName}</strong><small>{description}</small></span>
                {category === categoryName && <Check size={12} weight="bold" className="quiz-choice-check" />}
              </label>
            ))}
          </fieldset>
        );
      case 1: // Platform
        return (
          <fieldset className="quiz-options">
            <legend className="quiz-sr-only">Plataforma</legend>
            {platforms.map(({ name: platName }) => (
              <label className={`quiz-choice ${platform === platName ? "is-selected" : ""}`} key={platName}>
                <input type="radio" name={`${id}-platform`} value={platName} checked={platform === platName} onChange={() => setPlatform(platName)} />
                <span><strong>{platName}</strong></span>
                {platform === platName && <Check size={12} weight="bold" className="quiz-choice-check" />}
              </label>
            ))}
          </fieldset>
        );
      case 2: // Style
        return (
          <fieldset className="quiz-options quiz-style-options">
            <legend className="quiz-sr-only">Seu estilo visual</legend>
            {styles.map((item) => (
              <label key={item.name} className={`quiz-choice quiz-style-choice ${style === item.name ? "is-selected" : ""}`}>
                <input type="radio" name={`${id}-style`} checked={style === item.name} onChange={() => setStyle(item.name)} value={item.name} />
                <span className={`quiz-style-swatch ${item.className}`} aria-hidden="true"><i /><i /><i /></span>
                <span><strong>{item.name}</strong><small>{item.description}</small></span>
                {style === item.name && <Check size={12} weight="bold" className="quiz-choice-check" />}
              </label>
            ))}
          </fieldset>
        );
      case 3: // Colors
        return (
          <div className="quiz-fields">
            <label htmlFor={`${id}-colors`}>
              Suas Cores ou Logo
              <input id={`${id}-colors`} value={colors} onChange={(event) => setColors(event.target.value)} placeholder="Ex: Roxo e Preto, ou link da sua logo" required />
            </label>
          </div>
        );
      case 4: // Name/Handle
        return (
          <div className="quiz-fields">
            <label htmlFor={`${id}-name`}>Nome do canal<input id={`${id}-name`} value={name} onChange={(event) => setName(event.target.value)} placeholder="Como a sua comunidade te chama?" required maxLength={60} autoComplete="nickname" pattern=".*\S.*" /></label>
            <label htmlFor={`${id}-handle`}>Seu @ <span>opcional</span><input id={`${id}-handle`} value={handle} onChange={(event) => setHandle(event.target.value)} placeholder="@seucanal" maxLength={80} autoComplete="off" /></label>
            <label htmlFor={`${id}-email`}>E-mail<input id={`${id}-email`} value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="voce@email.com" required maxLength={254} autoComplete="email" /></label>
            <p className="quiz-field-help">Seus dados serão usados para personalizar e identificar seu pedido.</p>
          </div>
        );
      case 5: // Webcam
        return (
          <fieldset className="quiz-options">
            <legend className="quiz-sr-only">Posição da Webcam</legend>
            {webcams.map((cam) => (
              <label className={`quiz-choice ${webcam === cam ? "is-selected" : ""}`} key={cam}>
                <input type="radio" name={`${id}-webcam`} value={cam} checked={webcam === cam} onChange={() => setWebcam(cam)} />
                <span><strong>{cam}</strong></span>
                {webcam === cam && <Check size={12} weight="bold" className="quiz-choice-check" />}
              </label>
            ))}
          </fieldset>
        );
      case 6: // Elements
        return (
          <fieldset className="quiz-options">
            <legend className="quiz-sr-only">Elementos na tela</legend>
            {extraElements.map((el) => (
              <label className={`quiz-choice ${elements.includes(el) ? "is-selected" : ""}`} key={el}>
                <input type="checkbox" name={`${id}-elements`} value={el} checked={elements.includes(el)} onChange={() => toggleElement(el)} />
                <span><strong>{el}</strong></span>
                {elements.includes(el) && <Check size={12} weight="bold" className="quiz-choice-check" />}
              </label>
            ))}
          </fieldset>
        );
      case 7: // Scenes
        return (
          <fieldset className="quiz-options">
            <legend className="quiz-sr-only">Cenas</legend>
            {defaultScenes.map((scene) => (
              <label className={`quiz-choice ${scenes.includes(scene) ? "is-selected" : ""}`} key={scene}>
                <input type="checkbox" name={`${id}-scenes`} value={scene} checked={scenes.includes(scene)} onChange={() => toggleScene(scene)} />
                <span><strong>{scene}</strong></span>
                {scenes.includes(scene) && <Check size={12} weight="bold" className="quiz-choice-check" />}
              </label>
            ))}
            <div className="quiz-fields" style={{ marginTop: 16 }}>
              <label htmlFor={`${id}-custom-scenes`}>Outras cenas? <span>opcional</span>
                <input id={`${id}-custom-scenes`} value={customScenes} onChange={(e) => setCustomScenes(e.target.value)} placeholder="Ex: Tela de react com convidados" />
              </label>
            </div>
          </fieldset>
        );
      case 8: // Animation
        return (
          <fieldset className="quiz-options">
            <legend className="quiz-sr-only">Animação</legend>
            {animations.map((anim) => (
              <label className={`quiz-choice ${animation === anim.name ? "is-selected" : ""}`} key={anim.name}>
                <input type="radio" name={`${id}-animation`} value={anim.name} checked={animation === anim.name} onChange={() => setAnimation(anim.name)} />
                <span><strong>{anim.name}</strong><small>{anim.description}</small></span>
                {animation === anim.name && <Check size={12} weight="bold" className="quiz-choice-check" />}
              </label>
            ))}
          </fieldset>
        );
      case 9: // References
        return (
          <div className="quiz-fields">
            <label htmlFor={`${id}-references`}>
              Referências
              <textarea id={`${id}-references`} rows={4} value={references} onChange={(event) => setReferences(event.target.value)} placeholder="Descreva algo parecido com o que imaginou ou cole links aqui..." />
            </label>
          </div>
        );
      case 10: // Plan
        return (
          <fieldset className="quiz-plan-options">
            <legend className="quiz-sr-only">Escolha seu pacote</legend>
            {plans.map((item) => (
              <label key={item.id} className={`quiz-plan-choice ${plan === item.id ? "is-selected" : ""}`}>
                <input type="radio" name={`${id}-plan`} value={item.id} checked={plan === item.id} onChange={() => setPlan(item.id)} />
                <span className="quiz-radio" aria-hidden="true">{plan === item.id && <span />}</span>
                <span className="quiz-plan-info"><strong>{item.name}{item.id === "ai" && <Sparkle size={14} weight="fill" />}</strong><small>{item.description}</small></span>
                <span className="quiz-plan-price"><small>R$</small> {item.price}</span>
              </label>
            ))}
            <p className="quiz-plan-note"><Check size={13} /> Pagamento único. Seu para sempre.</p>
          </fieldset>
        );
      default:
        return null;
    }
  };

  const totalSteps = headings.length;

  return (
    <>
      <section className="quiz-card" aria-labelledby={`${id}-title`}>
        <div className="quiz-eyebrow">
          <span><Sparkle size={15} weight="fill" /> FEITO PRA SUA LIVE</span>
          <span className="quiz-step-number">{String(step + 1).padStart(2, '0')}<span> / {totalSteps}</span></span>
        </div>
        <div className="quiz-progress" aria-label={`Etapa ${step + 1} de ${totalSteps}`}>
          {headings.map((item, index) => <span key={item.title} className={index <= step ? "is-complete" : ""} />)}
        </div>
        <div className="quiz-heading" aria-live="polite">
          <h2 id={`${id}-title`} ref={headingRef} tabIndex={-1}>{heading.title}</h2>
          <p>{heading.description}</p>
        </div>
        <form onSubmit={handleContinue}>
          {renderStepContent()}
          <div className="quiz-actions">
            {step > 0 && <button type="button" className="quiz-back" aria-label="Voltar para a etapa anterior" onClick={() => changeStep(step - 1)}><ArrowLeft size={19} /></button>}
            <button type="submit" className="quiz-primary">{step === 10 ? "Quero meu overlay" : "Continuar"}<ArrowRight size={19} weight="bold" /></button>
          </div>
        </form>
        <p className="quiz-footnote">{step === 10 ? "Pagamento via Mercado Pago · sem assinatura" : "Leva menos de 3 minutos. Sem compromisso."}</p>
      </section>
      {checkoutOpen && <CheckoutModal plan={plan} brief={brief} initialEmail={email} onClose={() => setCheckoutOpen(false)} />}
    </>
  );
}
