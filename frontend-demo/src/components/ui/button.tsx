import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variantClassMap: Record<Variant, string> = {
  primary: "button button-primary",
  secondary: "button button-secondary",
  ghost: "button button-ghost",
  danger: "button button-danger",
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button className={cn(variantClassMap[variant], className)} {...props}>
      {children}
    </button>
  );
}
