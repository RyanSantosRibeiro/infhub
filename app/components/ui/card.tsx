import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover?: boolean;
  glow?: "magenta" | "cyan" | "brand";
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  glass,
  hover = true,
  glow,
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const glowClass = glow
    ? {
        magenta: "hover:shadow-[0_0_30px_rgba(254,44,85,0.15)]",
        cyan: "hover:shadow-[0_0_30px_rgba(37,244,238,0.15)]",
        brand: "hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]",
      }[glow]
    : "";

  return (
    <div
      className={`
        rounded-2xl border border-[var(--border-subtle)]
        ${glass ? "glass" : "bg-[var(--bg-surface)]"}
        ${hover ? "transition-all duration-300 hover:border-[var(--border-default)] hover:translate-y-[-2px]" : ""}
        ${glowClass}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
