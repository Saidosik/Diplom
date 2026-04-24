'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useLogoutMutation } from '@/features/auth/hooks';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const router = useRouter();
  const logoutMutation = useLogoutMutation();

  async function handleLogout() {
    try {
      await logoutMutation.mutateAsync();

      toast.success('Вы вышли из аккаунта');

      router.push('/auth?mode=login');
      router.refresh();
    } catch {
      toast.error('Не удалось выйти из аккаунта');
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
    >
      {logoutMutation.isPending ? 'Выходим...' : 'Выйти'}
    </Button>
  );
}