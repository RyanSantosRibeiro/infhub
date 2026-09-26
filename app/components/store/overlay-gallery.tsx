"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, DownloadSimple, GameController, ChatCircleDots, Microphone, MusicNotes, SquaresFour, GraduationCap, Compass, X, Play, SlidersHorizontal, Check } from "@phosphor-icons/react";
import { templates, type OverlayTemplate } from "@/lib/store/catalog";
import { OverlayPreview } from "./overlay-preview";
import { CheckoutModal } from "./checkout-modal";

const filters = [
  { name: "Todos", icon: SquaresFour },
  { name: "Gaming", icon: GameController },
  { name: "Just Chatting", icon: ChatCircleDots },
  { name: "Podcast", icon: Microphone },
  { name: "Música", icon: MusicNotes },
  { name: "Educação", icon: GraduationCap },
  { name: "IRL", icon: Compass },
];

export function OverlayGallery() {
  const [category, setCategory] = useState("Todos");
  const [onlyFree, setOnlyFree] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [preview, setPreview] = useState<OverlayTemplate | null>(null);
  const [checkout, setCheckout] = useState<OverlayTemplate | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  const items = templates.filter(
    (t) => (category === "Todos" || t.categories.includes(category)) && (!onlyFree || t.free)
  );
  const visible = expanded || category !== "Todos" || onlyFree ? items : items.slice(0, 3);

  useEffect(() => {
    if (preview) dialog.current?.showModal();
    else dialog.current?.close();
  }, [preview]);

  return (
    <section className="gallery-section section-space" id="galeria">
      <div className="shell">
        {/* Heading com fade-up ao scroll */}
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">ENCONTRE SUA VIBE</span>
            <h2>O próximo nível da sua live<span className="lime">.</span></h2>
            <p>Seu estilo já está aqui. Só falta o seu nome.</p>
          </div>
          <a href="#criar" className="text-link">Prefere algo só seu? Crie com IA <ArrowUpRight size={17}/></a>
        </div>

        {/* Toolbar com leve delay */}
        <div className="gallery-toolbar" data-reveal data-reveal-delay="120">
          <div className="category-tabs" role="group" aria-label="Filtrar overlays por categoria">
            {filters.map(({ name, icon: Icon }) => (
              <button key={name} className={category === name ? "category-tab active" : "category-tab"}
                onClick={() => setCategory(name)} aria-pressed={category === name}>
                <Icon size={17}/>{name}
              </button>
            ))}
          </div>
          <button className={onlyFree ? "free-filter selected" : "free-filter"}
            onClick={() => setOnlyFree(!onlyFree)} aria-pressed={onlyFree}>
            {onlyFree ? <Check size={16}/> : <SlidersHorizontal size={16}/>} Só os grátis
          </button>
        </div>

        {/* Grid de cards — cada card tem delay escalonado */}
        <div className="overlay-grid" aria-live="polite">
          {visible.map((template, i) => (
            <article
              className="overlay-card"
              key={template.id}
              data-reveal
              data-reveal-delay={String(i * 100)}
            >
              <button className="preview-button" aria-label={`Ver preview de ${template.name}`}
                onClick={() => setPreview(template)}>
                <OverlayPreview template={template}/>
                <div className="card-badges">
                  {template.badge && (
                    <span className={template.badge === "NOVO" ? "card-badge new" : "card-badge"}>
                      {template.badge}
                    </span>
                  )}
                  <span className="format-badge">16:9 + 9:16</span>
                </div>
                <span className="preview-hover"><Play size={18} weight="fill"/> Ver preview</span>
              </button>
              <div className="overlay-card-info">
                <div>
                  <h3>{template.name}<span>{template.categories[0]}</span></h3>
                  <p>{template.collection}</p>
                </div>
                <div className="card-price">
                  {template.free
                    ? <strong className="lime">Grátis</strong>
                    : <><small>a partir de</small><strong>R$ 29<span>,90</span></strong></>}
                </div>
              </div>
              <div className="card-bottom">
                <span>{template.free ? "Starter pack · 3 arquivos" : "Pack completo · 16:9 + 9:16"}</span>
                {template.free
                  ? <a href="/downloads/pure-starter.zip" download>Baixar grátis <DownloadSimple size={16}/></a>
                  : <button onClick={() => setCheckout(template)}>Escolher overlay <ArrowUpRight size={16}/></button>}
              </div>
            </article>
          ))}
        </div>

        {visible.length === 0 && (
          <div className="gallery-empty">
            <p>Nenhum modelo gratuito nesta categoria por enquanto.</p>
            <button className="button-secondary" onClick={() => { setCategory("Todos"); setOnlyFree(true); }}>
              Ver todos os gratuitos <ArrowRight size={17}/>
            </button>
          </div>
        )}

        <div className="gallery-footer" data-reveal>
          <span><span className="status-dot"/> Um universo de possibilidades. Um visual que é seu.</span>
          <button className="button-secondary" onClick={() => { setExpanded(!expanded); setCategory("Todos"); setOnlyFree(false); }}>
            {expanded ? "Mostrar destaques" : "Explorar todos os overlays"}
            <ArrowRight size={17}/>
          </button>
        </div>

        <dialog
          ref={dialog}
          className="preview-dialog"
          onCancel={() => setPreview(null)}
          onClick={(e) => { if (e.target === e.currentTarget) setPreview(null); }}
          aria-labelledby="preview-heading"
        >
          {preview && <>
            <button autoFocus className="dialog-close" aria-label="Fechar preview" onClick={() => setPreview(null)}><X size={22}/></button>
            <OverlayPreview template={preview} large/>
            <div className="preview-dialog-info">
              <div>
                <span className="eyebrow">FRAME ORIGINALS</span>
                <h2 id="preview-heading">{preview.name}</h2>
                <p>{preview.collection} Preview ilustrativo do estilo do pacote.</p>
              </div>
              {preview.free
                ? <a className="button-primary" download href="/downloads/pure-starter.zip">Baixar grátis <DownloadSimple size={19}/></a>
                : <button className="button-primary" onClick={() => { setCheckout(preview); setPreview(null); }}>Personalizar meu overlay <ArrowUpRight size={19}/></button>}
            </div>
          </>}
        </dialog>

        {checkout && (
          <CheckoutModal plan="ready" templateId={checkout.id} templateName={checkout.name} onClose={() => setCheckout(null)}/>
        )}
      </div>
    </section>
  );
}
