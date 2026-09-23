import { HTMLAttributes } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  fullWidth?: boolean;
}

export function Section({
  title,
  subtitle,
  badge,
  centered = true,
  fullWidth = false,
  className = "",
  children,
  id,
  ...props
}: SectionProps) {
  return (
    <section
      id={id}
      className={`py-20 md:py-28 px-4 sm:px-6 ${className}`}
      {...props}
    >
      <div className={`${fullWidth ? "w-full" : "max-w-7xl"} mx-auto`}>
        {(badge || title || subtitle) && (
          <div className={`mb-14 ${centered ? "text-center" : ""}`}>
            {badge && (
              <div className={`mb-5 ${centered ? "flex justify-center" : ""}`}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[var(--infhub-purple)]/8 text-[var(--infhub-purple)] border border-[var(--infhub-purple)]/15">
                  {badge}
                </span>
              </div>
            )}
            {title && (
              <h2
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-base md:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
