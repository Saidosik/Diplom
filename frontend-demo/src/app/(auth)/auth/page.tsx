import { AuthPanel } from '@/components/auth/auth-panel';
import { redirectIfAuthenticated } from '@/lib/auth/guards';

export default async function AuthPage() {
  await redirectIfAuthenticated('/learn');

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-background" />

      <div className="absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 bg-primary/20 blur-[120px]" />

      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <AuthPanel />
    </main>
  );
}