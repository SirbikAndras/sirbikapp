import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  children: ReactNode;
  icon?: ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  icon,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "flex items-center justify-center gap-2 px-4 rounded-xl font-body font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "h-[52px] text-base font-semibold bg-gradient-to-b from-[var(--color-accent)] to-[var(--color-accent-dark)] text-[var(--color-bg)] hover:opacity-90",
    outline:
      "h-12 text-sm font-medium bg-transparent border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]/20",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {icon && <span className="ml-1">{icon}</span>}
    </button>
  );
}
