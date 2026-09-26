"use client";

import { useState, useEffect } from "react";
import { X, GoogleLogo, EnvelopeSimple, CheckCircle } from "@phosphor-icons/react";
import { Button } from "./button";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type AuthMode = "login" | "register" | "forgot_password" | "verify_email";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "register";
}

// Utilitário para traduzir os erros comuns do Supabase
const translateError = (errorMsg: string) => {
  const msg = errorMsg.toLowerCase();
  if (msg.includes("invalid login credentials")) return "Email ou senha incorretos.";
  if (msg.includes("user already registered")) return "Este email já está cadastrado.";
  if (msg.includes("password should be at least")) return "A senha deve ter pelo menos 6 caracteres.";
  if (msg.includes("email rate limit exceeded")) return "Muitas tentativas. Tente novamente mais tarde.";
  return errorMsg; // Fallback
};

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setEmail("");
      setPassword("");
      setName("");
      setError(null);
    }
  }, [isOpen, defaultMode]);

  // Lock scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "register") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (signUpError) throw signUpError;
        
        // Se a sessão for nula, significa que a confirmação de email está ativada no Supabase
        if (!data.session) {
          setMode("verify_email");
          return;
        }

        onClose();
        router.push("/dashboard");
      } else if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        
        onClose();
        router.push("/dashboard");
      } else if (mode === "forgot_password") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });

        if (resetError) throw resetError;
        
        setMode("verify_email"); // Usamos a tela de verificação genérica
      }
    } catch (err: any) {
      setError(translateError(err.message || "Ocorreu um erro na autenticação."));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(translateError(err.message || "Erro ao fazer login com o Google."));
    }
  };

  // Render functions
  const renderHeader = () => {
    let title = "";
    let subtitle = "";

    switch (mode) {
      case "login":
        title = "Bem-vindo de volta";
        subtitle = "Faça login para acessar o InfHub";
        break;
      case "register":
        title = "Crie sua conta";
        subtitle = "Junte-se a nós e comece a criar conteúdo incrível";
        break;
      case "forgot_password":
        title = "Recuperar senha";
        subtitle = "Enviaremos um link para redefinir sua senha";
        break;
      case "verify_email":
        title = "Verifique seu email";
        subtitle = "Enviamos as instruções para sua caixa de entrada";
        break;
    }

    return (
      <div className="mb-8 text-center">
        {mode === "verify_email" && (
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--infhub-cyan)] glow-cyan">
            <EnvelopeSimple size={32} weight="duotone" />
          </div>
        )}
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>
          {title}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {subtitle}
        </p>
      </div>
    );
  };

  const renderSocialLogin = () => {
    if (mode !== "login" && mode !== "register") return null;
    return (
      <>
        <div className="mb-6 flex flex-col gap-3">
          <Button 
            variant="secondary" 
            fullWidth 
            icon={<GoogleLogo weight="bold" size={18} className="text-current" />}
            onClick={handleGoogleLogin}
            type="button"
          >
            Continuar com Google
          </Button>
        </div>

        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--border-subtle)]"></div>
          </div>
          <div className="relative bg-[var(--bg-surface)] px-4 text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            Ou continue com email
          </div>
        </div>
      </>
    );
  };

  const renderFormFields = () => {
    if (mode === "verify_email") {
      return (
        <div className="space-y-6">
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 text-sm text-[var(--text-secondary)] text-center">
            Por favor, verifique o email <strong className="text-[var(--text-primary)]">{email}</strong> e clique no link fornecido para continuar.
          </div>
          <Button variant="primary" fullWidth size="lg" onClick={onClose}>
            Entendi, fechar
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence mode="popLayout">
          {mode === "register" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              <label className="text-sm font-medium text-[var(--text-primary)]">Nome completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all focus:border-[var(--infhub-purple)] focus:ring-1 focus:ring-[var(--infhub-purple)]"
                placeholder="João da Silva"
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[var(--text-primary)]">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all focus:border-[var(--infhub-purple)] focus:ring-1 focus:ring-[var(--infhub-purple)]"
            placeholder="voce@exemplo.com"
          />
        </div>

        {mode !== "forgot_password" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--text-primary)]">Senha</label>
              {mode === "login" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot_password");
                    setError(null);
                  }}
                  className="cursor-pointer text-xs font-medium text-[var(--infhub-cyan)] hover:underline transition-all"
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all focus:border-[var(--infhub-purple)] focus:ring-1 focus:ring-[var(--infhub-purple)]"
              placeholder="••••••••"
            />
          </div>
        )}

        <Button type="submit" variant="primary" fullWidth size="lg" loading={loading} className="mt-6">
          {mode === "login" ? "Entrar" : mode === "register" ? "Criar conta" : "Enviar link de recuperação"}
        </Button>
      </form>
    );
  };

  const renderFooter = () => {
    if (mode === "verify_email") return null;

    let text = "";
    let actionText = "";
    let nextMode: AuthMode = "login";

    if (mode === "login") {
      text = "Ainda não tem uma conta? ";
      actionText = "Cadastre-se";
      nextMode = "register";
    } else {
      text = "Já tem uma conta? ";
      actionText = "Faça login";
      nextMode = "login";
    }

    return (
      <div className="mt-6 text-center text-sm text-[var(--text-secondary)]">
        {text}
        <button
          type="button"
          onClick={() => {
            setMode(nextMode);
            setError(null);
          }}
          className="cursor-pointer font-semibold text-[var(--infhub-purple)] hover:underline transition-colors"
        >
          {actionText}
        </button>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl glass-strong p-6 sm:p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
            >
              <X size={20} />
            </button>

            {renderHeader()}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                {error}
              </div>
            )}

            {renderSocialLogin()}
            {renderFormFields()}
            {renderFooter()}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
