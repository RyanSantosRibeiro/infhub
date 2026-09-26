"use client";

import { useEffect, useRef, useCallback } from "react";

/** Observa elementos e adiciona .is-visible quando entram na viewport */
export function useReveal(selector: string, options?: IntersectionObserverInit) {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(selector);
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px", ...options }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, options]);
}

/** Parallax simples por scroll — move o elemento em translateY */
export function useScrollParallax(speed = 0.25) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (el) el.style.transform = `translateY(${window.scrollY * speed}px)`;
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return ref;
}

/** Mouse tilt — retorna handlers para aplicar em qualquer container */
export function useMouseTilt(intensity = 8) {
  const ref = useRef<HTMLElement>(null);

  const onMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ((e.clientX - cx) / (rect.width / 2)) * intensity;
      const dy = ((e.clientY - cy) / (rect.height / 2)) * intensity;
      el.style.transform = `perspective(900px) rotateY(${dx}deg) rotateX(${-dy}deg)`;
    },
    [intensity]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.6s ease";
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
    setTimeout(() => {
      if (el) el.style.transition = "";
    }, 600);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", onMove as EventListener);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove as EventListener);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [onMove, onLeave]);

  return ref;
}

/** Anima um número de 0 até target quando entra na viewport */
export function useCountUp(target: number, duration = 1800) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        function step(now: number) {
          const p = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el!.textContent = String(Math.round(ease * target));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);
  return ref;
}
