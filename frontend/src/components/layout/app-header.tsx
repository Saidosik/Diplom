import Link from 'next/link';
import { getServerUser } from '@/lib/auth/server-user';
import { Button } from '@/components/ui/button';
import { LogoutButton } from '@/components/auth/logout-button';

export async function AppHeader() {
  const user = await getServerUser();

  return (
    <header className="border-b border-border bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-heading text-lg font-semibold tracking-wide">
          Вектор
        </Link>

        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/courses">Курсы</Link>
          </Button>

          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/me">Профиль</Link>
              </Button>

              {user.meta?.isAdmin ? (
                <Button asChild variant="ghost">
                  <Link href="/admin">Админка</Link>
                </Button>
              ) : null}

              <LogoutButton />
            </>
          ) : (
            <>
              <Button asChild>
                <Link href="/auth?mode=login">Войти</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}