import Link from "next/link";
import { Lightning, InstagramLogo, TiktokLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";

const footerLinks = {
  Produto: [
    { label: "Modelos de IA", href: "/" },
    { label: "Post Generator", href: "/post-generator" },
    { label: "Templates", href: "/admin/templates" },
    { label: "Planos", href: "#pricing" },
  ],
  Empresa: [
    { label: "Sobre nós", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contato", href: "#" },
  ],
  Legal: [
    { label: "Termos de Uso", href: "#" },
    { label: "Privacidade", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

interface FooterProps {
  theme?: "light" | "dark";
}

export function Footer({ theme = "dark" }: FooterProps) {
  const isLight = theme === "light";

  return (
    <footer
      className={`border-t ${
        isLight
          ? "border-slate-200 bg-slate-50"
          : "border-[var(--border-subtle)] bg-[var(--bg-surface)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center">
                <Lightning weight="fill" className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-xl font-bold ${isLight ? "text-slate-900" : ""}`}
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Inf<span className="text-gradient">Hub</span>
              </span>
            </div>
            <p
              className={`text-sm leading-relaxed max-w-xs mb-6 ${
                isLight ? "text-slate-500" : "text-[var(--text-secondary)]"
              }`}
            >
              Plataforma que ajuda criadores de conteúdo a gerarem materiais de alta conversão com Inteligência Artificial.
            </p>
            <div className="flex items-center gap-2">
              {[InstagramLogo, TiktokLogo, YoutubeLogo].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isLight
                      ? "bg-slate-100 text-slate-400 hover:text-[var(--infhub-purple)] hover:bg-[var(--infhub-purple)]/10"
                      : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--infhub-cyan)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className={`text-sm font-semibold mb-4 ${
                  isLight ? "text-slate-800" : "text-[var(--text-primary)]"
                }`}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors ${
                        isLight
                          ? "text-slate-400 hover:text-slate-700"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className={`mt-14 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 ${
            isLight ? "border-slate-200" : "border-[var(--border-subtle)]"
          }`}
        >
          <p className={`text-xs ${isLight ? "text-slate-400" : "text-[var(--text-muted)]"}`}>
            © {new Date().getFullYear()} InfHub. Todos os direitos reservados.
          </p>
          <p className={`text-xs ${isLight ? "text-slate-400" : "text-[var(--text-muted)]"}`}>
            Feito com ❤️ para criadores de conteúdo
          </p>
        </div>
      </div>
    </footer>
  );
}
