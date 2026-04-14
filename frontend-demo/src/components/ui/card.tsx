import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils/cn";

interface CardProps {
  className?: string;
}

export function Card({ children, className }: PropsWithChildren<CardProps>) {
  return <div className={cn("card", className)}>{children}</div>;
}
