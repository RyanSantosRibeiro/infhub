import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "magenta" | "cyan" | "purple" | "gradient";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
  magenta:
    "bg-[var(--infhub-magenta)]/15 text-[var(--infhub-magenta)] border border-[var(--infhub-magenta)]/30",
  cyan:
    "bg-[var(--infhub-cyan)]/15 text-[var(--infhub-cyan)] border border-[var(--infhub-cyan)]/30",
  purple:
    "bg-[var(--infhub-purple)]/15 text-[var(--infhub-purple)] border border-[var(--infhub-purple)]/30",
  gradient:
    "bg-gradient-brand text-white border-0",
};

export function Badge({
  variant = "default",
  dot,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}
