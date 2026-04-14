import type { PropsWithChildren } from "react";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-shell-main">
        <Header />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
