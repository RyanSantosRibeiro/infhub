"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { Lightning, List, X } from "@phosphor-icons/react";
import { AuthModal } from "@/app/components/ui/auth-modal";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Post Generator", href: "/post-generator" },
  { label: "Planos", href: "#pricing" },
];

interface HeaderProps {
  theme?: "light" | "dark";
}

export function Header({ theme = "dark" }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileOpen(false);
  };
  const isLight = theme === "light";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinkClass = isLight
    ? `text-sm transition-colors ${scrolled ? "text-slate-500 hover:text-slate-900" : "text-slate-600 hover:text-slate-900"}`
    : "text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors";

  const scrolledClass = isLight
    ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_12px_rgba(15,23,42,0.06)]"
    : "glass-strong shadow-lg";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? scrolledClass : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
            <Lightning weight="fill" className="w-5 h-5 text-white" />
          </div>
          <span
            className={`text-xl font-bold tracking-tight transition-colors ${isLight ? "text-slate-900" : ""}`}
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Inf<span className="text-gradient">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => openAuthModal("login")}>
            Entrar
          </Button>
          <Button variant="primary" size="sm" onClick={() => openAuthModal("register")}>
            Começar Grátis
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${
            isLight ? "text-slate-700 hover:bg-slate-100" : "text-[var(--text-primary)]"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <List size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className={`md:hidden border-t px-4 py-6 space-y-4 ${
            isLight
              ? "bg-white border-slate-200"
              : "glass-strong border-[var(--border-subtle)]"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-base font-medium transition-colors ${
                isLight ? "text-slate-600 hover:text-slate-900" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className={`pt-4 border-t flex flex-col gap-3 ${isLight ? "border-slate-200" : "border-[var(--border-subtle)]"}`}>
            <Button variant="outline" fullWidth onClick={() => openAuthModal("login")}>Entrar</Button>
            <Button variant="primary" fullWidth onClick={() => openAuthModal("register")}>Começar Grátis</Button>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
        defaultMode={authMode} 
      />
    </header>
  );
}
