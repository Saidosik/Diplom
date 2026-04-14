"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import { logout } from "@/lib/api/demo";
import { removeAccessToken } from "@/lib/storage/auth";

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      removeAccessToken();
      router.push("/login");
      router.refresh();
    }
  };

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Учебный шаблон</p>
        <h2 className="app-header-title">{APP_NAME}</h2>
      </div>

      <div className="app-header-actions">
        <span className="badge">App Router</span>
        <span className="badge">axios</span>
        <span className="badge">framer-motion</span>
        <Button variant="ghost" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
    </header>
  );
}
