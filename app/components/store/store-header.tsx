"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkle, List, X } from "@phosphor-icons/react";
import { Brand } from "./brand";

export function StoreHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`store-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="shell header-inner">
        <Link href="/" aria-label="FRAME — início">
          <Brand />
        </Link>
        <nav
          className={open ? "header-nav is-open" : "header-nav"}
          aria-label="Navegação principal"
        >
          <a href="/#galeria" onClick={() => setOpen(false)}>
            Explorar overlays
          </a>
          <a href="/#como-funciona" onClick={() => setOpen(false)}>
            Como funciona
          </a>
          <a href="/#pacotes" onClick={() => setOpen(false)}>
            Pacotes
          </a>
          <a href="/#faq" onClick={() => setOpen(false)}>
            FAQ
          </a>
        </nav>
        <a className="header-cta" href="/#criar">
          <Sparkle size={16} weight="fill" /> Criar meu overlay <ArrowUpRight size={17} />
        </a>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X size={23} /> : <List size={23} />}
        </button>
      </div>
    </header>
  );
}
