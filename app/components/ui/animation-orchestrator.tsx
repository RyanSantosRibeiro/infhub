"use client";

import { useEffect } from "react";

/**
 * Monta um IntersectionObserver global que detecta todos os elementos
 * com data-reveal (ou data-reveal-stagger) e adiciona .is-visible.
 * Deve ser montado uma vez na raiz da página.
 */
export function AnimationOrchestrator() {
  useEffect(() => {
    // Respeita prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay ?? "0";
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-visible");
          observer.unobserve(el);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    function observe() {
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (!el.classList.contains("is-visible")) observer.observe(el);
      });
    }

    observe();

    // Re-observa se o DOM mudar (filtros na galeria, etc.)
    const mutation = new MutationObserver(observe);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutation.disconnect();
    };
  }, []);

  return null;
}
