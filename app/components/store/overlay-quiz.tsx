"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, CameraSlash, Check, CheckCircle, Lightbulb, LinkSimple, Palette, Sparkle } from "@phosphor-icons/react";
import { CheckoutModal, type OverlayBrief, type OverlayPlan } from "./checkout-modal";
import { animations, categories, extraElements, headings, palettes, platforms, sceneOptions, styles, webcams } from "./quiz-options";
import "./quiz.css";
import "./overlay-quiz.css";

const plans: { id: OverlayPlan; name: string; price: string; description: string }[] = [
  { id: "ready", name: "Ready", price: "29,90", description: "Um modelo pronto com seu nome e @." },
  { id: "custom", name: "Custom", price: "59,90", description: "Sua identidade em um modelo personalizável." },
  { id: "ai", name: "AI Custom", price: "99,90", description: "Um universo visual criado por IA para você." },
];

function Choice({ name, value, selected, onChange, children, className = "", multiple = false }: {
  name: string; value: string; selected: boolean; onChange: () => void;
  children: ReactNode; className?: string; multiple?: boolean;
}) {
  return <label className={`quiz-choice ${className} ${selected ? "is-selected" : ""}`}>
    <input type={multiple ? "checkbox" : "radio"} name={name} value={value} checked={selected} onChange={onChange} />
    {children}
    <span className={`quiz-selection-mark ${multiple ? "is-checkbox" : ""}`} aria-hidden="true">{selected && <Check size={10} weight="bold" />}</span>
  </label>;
}

export function OverlayQuiz({ initialCategory = "Game" }: { initialCategory?: string }) {
  const id = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(categories.find(item => item.name.toLowerCase() === initialCategory.toLowerCase())?.name ?? "Game");
  const [platform, setPlatform] = useState("Twitch");
  const [style, setStyle] = useState("Neon");
  const [colors, setColors] = useState("");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [webcam, setWebcam] = useState("Superior direita");
  const [elements, setElements] = useState<string[]>([]);
  const [scenes, setScenes] = useState<string[]>(sceneOptions.map(scene => scene.name));
  const [customScenes, setCustomScenes] = useState("");
  const [animation, setAnimation] = useState("Intermediária");
  const [references, setReferences] = useState("");
  const [plan, setPlan] = useState<OverlayPlan>("ai");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const heading = headings[step];
  const StepIcon = heading.icon;
  const totalSteps = headings.length;
  const isLastStep = step === totalSteps - 1;
  const brief: OverlayBrief = {
    category, platform, style, colors, name: name.trim(), handle: handle.trim(), webcam, elements,
    scenes: customScenes.trim() ? [...scenes, customScenes.trim()] : scenes, animation, references,
  };

  function changeStep(next: number) {
    setStep(next);
    requestAnimationFrame(() => {
      contentRef.current?.scrollTo({ top: 0, behavior: "instant" });
      headingRef.current?.focus({ preventScroll: true });
    });
  }
  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isLastStep) setCheckoutOpen(true);
    else changeStep(step + 1);
  }
  function toggleElement(element: string) {
    setElements(previous => {
      if (element === "Nada") return previous.includes("Nada") ? [] : ["Nada"];
      const filtered = previous.filter(item => item !== "Nada");
      return filtered.includes(element) ? filtered.filter(item => item !== element) : [...filtered, element];
    });
  }
  function toggleScene(scene: string) {
    setScenes(previous => previous.includes(scene) ? previous.filter(item => item !== scene) : [...previous, scene]);
  }

  function renderStepContent() {
    switch (step) {
      case 0:
        return <fieldset className="quiz-options quiz-category-options"><legend className="quiz-sr-only">Seu tipo de conteúdo</legend>
          {categories.map(({ name: option, description, icon: Icon }) => <Choice key={option} name={`${id}-category`} value={option} selected={category === option} onChange={() => setCategory(option)} className="quiz-tile">
            <span className="quiz-option-icon"><Icon size={24} weight={category === option ? "duotone" : "regular"} aria-hidden="true" /></span><span><strong>{option}</strong><small>{description}</small></span>
          </Choice>)}
        </fieldset>;
      case 1:
        return <fieldset className="quiz-options quiz-platform-options"><legend className="quiz-sr-only">Plataforma</legend>
          {platforms.map(({ name: option, description, icon: Icon, tone }) => <Choice key={option} name={`${id}-platform`} value={option} selected={platform === option} onChange={() => setPlatform(option)} className={`quiz-platform-choice platform-${tone}`}>
            <span className="quiz-option-icon"><Icon size={26} weight="fill" aria-hidden="true" /></span><span><strong>{option}</strong><small>{description}</small></span>
          </Choice>)}
        </fieldset>;
      case 2:
        return <fieldset className="quiz-options quiz-style-options"><legend className="quiz-sr-only">Seu estilo visual</legend>
          {styles.map(item => <Choice key={item.name} name={`${id}-style`} value={item.name} selected={style === item.name} onChange={() => setStyle(item.name)} className="quiz-style-choice">
            <span className={`quiz-style-swatch ${item.className}`} aria-hidden="true"><i /><i /><i /><b>LIVE</b></span><span><strong>{item.name}</strong><small>{item.description}</small></span>
          </Choice>)}
        </fieldset>;
      case 3:
        return <div className="quiz-colors-content">
          <div className="quiz-palette-grid" role="group" aria-label="Sugestões de paleta">{palettes.map(palette => {
            const value = palette.colors.join(", ");
            return <button key={palette.name} type="button" className={`quiz-palette ${colors === value ? "is-selected" : ""}`} aria-pressed={colors === value} onClick={() => setColors(value)}><span className="quiz-palette-swatches" aria-hidden="true">{palette.colors.map(color => <i key={color} style={{ backgroundColor: color }} />)}</span><span>{palette.name}{colors === value && <Check size={13} weight="bold" />}</span></button>;
          })}</div>
          <div className="quiz-fields"><label htmlFor={`${id}-colors`}>Suas cores ou link da logo<input id={`${id}-colors`} value={colors} onChange={event => setColors(event.target.value)} placeholder="Ex.: roxo e preto, #AA7DF7 ou link da logo" required maxLength={500} pattern=".*\S.*" /></label><p className="quiz-field-help"><Palette size={14} aria-hidden="true" /> Pode usar nomes de cores, códigos HEX ou um link público da sua logo.</p></div>
        </div>;
      case 4:
        return <div className="quiz-fields"><label htmlFor={`${id}-name`}>Nome do canal<input id={`${id}-name`} value={name} onChange={event => setName(event.target.value)} placeholder="Como sua comunidade te chama?" required maxLength={60} autoComplete="nickname" pattern=".*\S.*" /></label><label htmlFor={`${id}-handle`}>Seu @ <span>opcional</span><input id={`${id}-handle`} value={handle} onChange={event => setHandle(event.target.value)} placeholder="@seucanal" maxLength={80} autoComplete="off" /></label><label htmlFor={`${id}-email`}>E-mail<input id={`${id}-email`} value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="voce@email.com" required maxLength={254} autoComplete="email" /></label><p className="quiz-field-help">Seus dados serão usados para personalizar e identificar seu pedido.</p></div>;
      case 5:
        return <fieldset className="quiz-options quiz-webcam-options"><legend className="quiz-sr-only">Posição da webcam</legend>
          {webcams.map(cam => <Choice key={cam.name} name={`${id}-webcam`} value={cam.name} selected={webcam === cam.name} onChange={() => setWebcam(cam.name)} className={`quiz-webcam-choice ${cam.position === "none" ? "quiz-full-choice" : ""}`}>
            {cam.position === "none" ? <span className="quiz-option-icon"><CameraSlash size={23} aria-hidden="true" /></span> : <span className={`quiz-screen-diagram ${cam.position}`} aria-hidden="true"><span className="quiz-screen-content" /><span className="quiz-screen-camera" /><i /></span>}
            <span><strong>{cam.name}</strong>{cam.position === "none" && <small>Todo o espaço para seu conteúdo</small>}</span>
          </Choice>)}
        </fieldset>;
      case 6:
        return <fieldset className="quiz-options quiz-element-options"><legend className="quiz-sr-only">Elementos na tela</legend>
          {extraElements.map(({ name: option, icon: Icon, description }) => <Choice key={option} name={`${id}-elements`} value={option} selected={elements.includes(option)} onChange={() => toggleElement(option)} multiple className={option === "Nada" ? "quiz-full-choice" : ""}>
            <span className="quiz-option-icon"><Icon size={23} aria-hidden="true" /></span><span><strong>{option}</strong><small>{description}</small></span>
          </Choice>)}
        </fieldset>;
      case 7:
        return <div className="quiz-scenes-content"><fieldset className="quiz-options quiz-list-options"><legend className="quiz-sr-only">Cenas</legend>
          {sceneOptions.map(scene => <Choice key={scene.name} name={`${id}-scenes`} value={scene.name} selected={scenes.includes(scene.name)} onChange={() => toggleScene(scene.name)} multiple className="quiz-scene-choice">
            <span className="quiz-option-icon"><scene.icon size={21} aria-hidden="true" /></span><span><strong>{scene.title}</strong><small>{scene.description}</small></span>
          </Choice>)}
        </fieldset><div className="quiz-fields quiz-custom-scenes"><label htmlFor={`${id}-custom-scenes`}>Mais alguma cena? <span>opcional</span><input id={`${id}-custom-scenes`} value={customScenes} onChange={event => setCustomScenes(event.target.value)} maxLength={300} placeholder="Ex.: tela de react com convidados" /></label></div></div>;
      case 8:
        return <fieldset className="quiz-options quiz-list-options quiz-animation-options"><legend className="quiz-sr-only">Intensidade da animação</legend>
          {animations.map(({ name: option, description, icon: Icon, level }) => <Choice key={option} name={`${id}-animation`} value={option} selected={animation === option} onChange={() => setAnimation(option)} className={`quiz-animation-choice motion-${level}`}>
            <span className="quiz-option-icon"><Icon size={25} aria-hidden="true" /></span><span><strong>{option}</strong><small>{description}</small></span><span className="quiz-motion-meter" aria-hidden="true"><i /><i /><i /><i /><i /></span>
          </Choice>)}
        </fieldset>;
      case 9:
        return <div className="quiz-reference-content"><div className="quiz-reference-tip"><Lightbulb size={22} aria-hidden="true" /><div><strong>Pode ser uma sensação, uma cor, um universo.</strong><p>“Um visual espacial, com roxo e azul, parecido com uma nave à noite.”</p></div></div><div className="quiz-fields"><label htmlFor={`${id}-references`}>Sua inspiração <span>opcional</span><textarea id={`${id}-references`} rows={5} value={references} onChange={event => setReferences(event.target.value)} maxLength={2000} placeholder="Conte sua ideia ou cole links de referência…" /></label><div className="quiz-reference-help"><span><LinkSimple size={14} aria-hidden="true" /> Links e descrições são bem-vindos</span><span>{references.length}/2000</span></div></div></div>;
      case 10:
        return <div><div className="quiz-brief-summary"><CheckCircle size={19} weight="duotone" aria-hidden="true" /><div><strong>{name || "Seu canal"}, já temos a sua vibe.</strong><span>{category} · {platform} · {style}</span></div></div><fieldset className="quiz-plan-options"><legend className="quiz-sr-only">Escolha seu pacote</legend>
          {plans.map(item => <label key={item.id} className={`quiz-plan-choice ${plan === item.id ? "is-selected" : ""}`}><input type="radio" name={`${id}-plan`} value={item.id} checked={plan === item.id} onChange={() => setPlan(item.id)} /><span className="quiz-radio" aria-hidden="true">{plan === item.id && <span />}</span><span className="quiz-plan-info"><strong>{item.name}{item.id === "ai" && <Sparkle size={14} weight="fill" />}</strong><small>{item.description}</small></span><span className="quiz-plan-price"><small>R$</small> {item.price}</span></label>)}
        </fieldset></div>;
      default: return null;
    }
  }

  return <><section className="quiz-card quiz-wizard" aria-labelledby={`${id}-title`}>
    <header className="quiz-wizard-header"><div className="quiz-eyebrow"><span><Sparkle size={15} weight="fill" /> FEITO PRA SUA LIVE</span><span className="quiz-step-number">{String(step + 1).padStart(2, "0")}<span> / {totalSteps}</span></span></div>
      <div className="quiz-progress" role="progressbar" aria-label="Progresso do quiz" aria-valuemin={0} aria-valuemax={totalSteps} aria-valuenow={step + 1} aria-valuetext={`Etapa ${step + 1} de ${totalSteps}: ${heading.title}`}>{headings.map((item, index) => <span key={item.title} className={index < step ? "is-complete" : index === step ? "is-current" : ""} />)}</div>
      <div className="quiz-step-context"><span><StepIcon size={14} aria-hidden="true" />{heading.group}</span><span>{step === 6 ? `${elements.filter(item => item !== "Nada").length} selecionados` : step === 7 ? `${scenes.length} de 5 cenas` : "SEU OVERLAY, DO SEU JEITO"}</span></div>
      <div className="quiz-heading" aria-live="polite"><h2 id={`${id}-title`} ref={headingRef} tabIndex={-1}>{heading.title}</h2><p>{heading.description}</p></div>
    </header>
    <form className="quiz-wizard-form" onSubmit={handleContinue}>
      <div className="quiz-step-scroll" ref={contentRef}><p className="quiz-selection-hint">{heading.hint}</p><div className="quiz-step-content" key={step}>{renderStepContent()}</div></div>
      <footer className="quiz-wizard-footer"><div className="quiz-actions">{step > 0 && <button type="button" className="quiz-back" aria-label="Voltar para a etapa anterior" onClick={() => changeStep(step - 1)}><ArrowLeft size={19} /></button>}<button type="submit" className="quiz-primary">{isLastStep ? "Quero meu overlay" : step === 9 ? references.trim() ? "Ver meus pacotes" : "Pular e ver pacotes" : "Continuar"}<ArrowRight size={18} weight="bold" /></button></div><p className="quiz-footnote">{isLastStep ? "Pagamento via Mercado Pago · sem assinatura" : <><span className="quiz-next-label">A seguir</span> {headings[step + 1].title}</>}</p></footer>
    </form>
  </section>{checkoutOpen && <CheckoutModal plan={plan} brief={brief} initialEmail={email} onClose={() => setCheckoutOpen(false)} />}</>;
}
