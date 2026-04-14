"use client";

import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

interface FadeInProps {
  delay?: number;
}

export function FadeIn({ children, delay = 0 }: PropsWithChildren<FadeInProps>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
  );
}
