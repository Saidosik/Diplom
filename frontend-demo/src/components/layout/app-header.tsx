import type { ReactNode } from 'react';
import Link from 'next/link';
import { Bot, GraduationCap, LayoutDashboard, UserCircle } from 'lucide-react';

import { LogoutButton } from '@/components/auth/logout-button';
import { Button } from '@/components/ui/button';
import { getServerUser } from '@/lib/auth/server-user';

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-9 items-center border border-transparent px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-border hover:bg-muted/40 hover:text-foreground"
    >
      {children}
    </Link>
  );
}

export async function AppHeader() {
  const user = await getServerUser();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/88 backdrop-blur-xl mx-auto">
      <div className="container flex h-16 items-center justify-between gap-4 mx-auto">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid size-9 place-items-center border border-primary/40 bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span>
            <span className="block font-heading text-lg font-semibold tracking-[0.18em] uppercase">
              Вектор
            </span>
            <span className="hidden text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
              AI learning system
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavLink href="/courses">Курсы</NavLink>
          {user ? <NavLink href="/learn">Моё обучение</NavLink> : null}
          {user ? <NavLink href="/studio">Studio</NavLink> : null}
          <NavLink href="/ai">ИИ</NavLink>
          {user?.meta?.isAdmin ? <NavLink href="/admin">Админка</NavLink> : null}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
                <Link href="/me/profile">
                  <UserCircle className="size-4" />
                  {user.name}
                </Link>
              </Button>
              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link href="/auth?mode=register">Регистрация</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth?mode=login">Войти</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-border lg:hidden">
        <div className="container flex h-11 items-center gap-1 overflow-x-auto">
          <NavLink href="/courses">Курсы</NavLink>
          {user ? <NavLink href="/learn">Обучение</NavLink> : null}
          {user ? <NavLink href="/studio">Studio</NavLink> : null}
          <NavLink href="/ai">
            <Bot className="mr-1 size-4" />
            ИИ
          </NavLink>
          {user?.meta?.isAdmin ? (
            <NavLink href="/admin">
              <LayoutDashboard className="mr-1 size-4" />
              Админ
            </NavLink>
          ) : null}
        </div>
      </div>
    </header>
  );
}
