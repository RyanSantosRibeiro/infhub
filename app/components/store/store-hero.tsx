"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Pause, Play, Sparkle, TwitchLogo, YoutubeLogo, Broadcast, MonitorPlay } from "@phosphor-icons/react";
import { OverlayQuiz } from "./overlay-quiz";

export function StoreHero() {
  const video = useRef<HTMLVideoElement>(null);
  const heroMedia = useRef<HTMLDivElement>(null);
  const quizWrap = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);

  // Reduced-motion check
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) video.current?.pause();
  }, []);

  // Parallax no vídeo de fundo
  useEffect(() => {
    const el = heroMedia.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (el) el.style.transform = `translateY(${window.scrollY * 0.28}px)`;
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cursor glow no hero
  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    function onMove(e: MouseEvent) {
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Mouse tilt no quiz card
  useEffect(() => {
    const el = quizWrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    function onMove(e: MouseEvent) {
      const rect = el!.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ((e.clientX - cx) / (rect.width / 2)) * 6;
      const dy = ((e.clientY - cy) / (rect.height / 2)) * 6;
      el!.style.transform = `perspective(900px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
    }
    function onLeave() {
      el!.style.transition = "transform 0.6s ease";
      el!.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
      setTimeout(() => { if (el) el.style.transition = ""; }, 600);
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  function toggleVideo() {
    if (!video.current) return;
    if (video.current.paused) void video.current.play();
    else video.current.pause();
  }

  const platforms = [
    <span key="obs"><MonitorPlay size={25}/> OBS Studio</span>,
    <span key="streamlabs"><Broadcast size={23}/> Streamlabs</span>,
    <span key="twitch"><TwitchLogo size={23} weight="fill"/> twitch</span>,
    <span key="youtube"><YoutubeLogo size={26} weight="fill"/> YouTube</span>,
    <span key="kick" className="kick-logo">KICK</span>,
  ];

  return (
    <>
      {/* Cursor glow — segue o mouse apenas na área do hero */}
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />

      <section className="store-hero" id="criar" aria-label="Crie sua identidade para live">
        <div className="hero-media" ref={heroMedia}>
          <video ref={video} autoPlay muted loop playsInline preload="none"
            poster="/images/hero-neon.webp"
            onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
            aria-hidden="true">
            <source src="/videos/overlay-showcase.mp4" type="video/mp4"/>
          </video>
        </div>
        <div className="hero-shade" />

        <div className="shell hero-layout">
          <div className="hero-copy">
            <div className="eyebrow-pill"><span className="status-dot"/> SUA PRÓXIMA LIVE COMEÇA AQUI</div>
            <h1>Sua live.<br/>Sua <span>identidade.</span></h1>
            <p>Você tem o conteúdo.<br/>A gente dá o <strong>visual que ele merece.</strong></p>
            <p className="hero-description">Overlays para quem joga, conversa, cria e faz acontecer. Encontre sua vibe ou crie algo só seu com IA.</p>
            <a className="hero-explore" href="#galeria">Explorar a coleção <ArrowUpRight size={19}/></a>
            <div className="hero-benefits">
              <span><Check size={15}/> Feito pra você</span>
              <span><Check size={15}/> Pronto pro OBS</span>
              <span><Check size={15}/> Sem assinatura</span>
            </div>
          </div>

          <div className="hero-quiz" ref={quizWrap} style={{ transformStyle: "preserve-3d" }}>
            <div className="quiz-overline"><Sparkle size={15} weight="fill"/> UM OVERLAY COM A SUA CARA</div>
            <OverlayQuiz />
          </div>
        </div>

        <div className="shell hero-bottom">
          <a href="#galeria" className="scroll-hint">
            <span><ArrowDown size={17}/></span> Encontre seu próximo visual
          </a>
          <button className="scene-caption" onClick={toggleVideo}
            aria-label={playing ? "Pausar vídeo de fundo" : "Reproduzir vídeo de fundo"}>
            {playing ? <Pause size={13} weight="fill"/> : <Play size={13} weight="fill"/>}
            <span>FRAME ORIGINALS</span><i/> Coleção em movimento
          </button>
        </div>
      </section>

      {/* Platform strip com marquee infinito */}
      <div className="platform-strip">
        <div className="platform-inner shell" style={{ overflow: "hidden" }}>
          <span>SEU CONTEÚDO, EM QUALQUER TELA.</span>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div className="platform-marquee-track" aria-hidden="true">
              {/* duplica para loop perfeito */}
              {[...platforms, ...platforms].map((el, i) => (
                <span key={i} style={{ marginRight: 34, display: "flex", alignItems: "center", gap: 7, fontSize: 16, fontWeight: 600, fontFamily: "var(--font-heading)" }}>{el}</span>
              ))}
            </div>
          </div>
          <span className="format-label">16:9 <i/> 9:16</span>
        </div>
      </div>
    </>
  );
}
