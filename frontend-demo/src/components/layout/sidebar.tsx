"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-dot" />
        <div>
          <p className="sidebar-brand-title">Diploma UI</p>
          <p className="sidebar-brand-subtitle">Next.js starter</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className="sidebar-link-wrapper">
              <span className={cn("sidebar-link", isActive && "sidebar-link-active")}>
                {item.label}
              </span>

              {isActive ? (
                <motion.span
                  layoutId="active-nav-indicator"
                  className="sidebar-link-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
