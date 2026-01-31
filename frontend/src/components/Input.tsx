import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
}

export default function Input({
  label,
  icon,
  rightIcon,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="font-body text-xs font-medium text-(--color-text-secondary)">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-(--color-text-secondary)">
            {icon}
          </span>
        )}
        <input
          className={`w-full h-13 bg-(--color-input-bg) border border-(--color-border) rounded-xl px-4 font-body text-sm text-(--color-text-primary) placeholder:text-(--color-text-placeholder) focus:outline-none focus:border-(--color-accent) transition-colors ${icon ? "pl-12" : ""} ${rightIcon ? "pr-12" : ""} ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-(--color-text-placeholder) cursor-pointer hover:text-(--color-text-secondary)">
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
}
