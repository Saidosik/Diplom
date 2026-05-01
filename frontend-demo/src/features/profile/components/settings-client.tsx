'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { Input } from '@/components/ui/input';
import { LoadingState } from '@/components/ui/loading-state';
import {
  useDeleteAccountMutation,
  useDeleteAvatarMutation,
  useMeQuery,
  useResendEmailVerificationMutation,
  useUpdateAvatarMutation,
  useUpdateProfileMutation,
} from '@/features/auth/hooks';

export function SettingsClient() {
  const { data: user, isLoading, isError } = useMeQuery();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const updateProfile = useUpdateProfileMutation();
  const updateAvatar = useUpdateAvatarMutation();
  const deleteAvatar = useDeleteAvatarMutation();
  const resendVerification = useResendEmailVerificationMutation();
  const deleteAccount = useDeleteAccountMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateProfile.mutateAsync({ name, email });
    toast.success('Профиль обновлён');
  }

  async function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    await updateAvatar.mutateAsync(file);
    toast.success('Аватар обновлён');
  }

  async function handleResendVerification() {
    const result = await resendVerification.mutateAsync();
    toast.success(result.message ?? 'Письмо отправлено');
  }

  async function handleDeleteAvatar() {
    await deleteAvatar.mutateAsync();
    toast.success('Аватар удалён');
  }

  async function handleDeleteAccount() {
    const accepted = window.confirm('Удалить аккаунт? Это действие нельзя отменить.');
    if (!accepted) return;

    await deleteAccount.mutateAsync();
    window.location.href = '/auth?mode=login';
  }

  return (
    <AppShell>
      <PageShell>
        <PageHeader
          kicker="Настройки"
          title="Настройки аккаунта"
          description="Изменение имени, email, аватара, повторная отправка подтверждения email и удаление аккаунта."
        />

        {isLoading ? <LoadingState label="Загрузка настроек..." /> : null}
        {isError ? <ErrorState description="Не удалось загрузить настройки пользователя." /> : null}

        {user ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <Card>
              <CardHeader className="border-b border-border">
                <CardTitle>Основные данные</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <label className="grid gap-2 text-sm font-medium">
                    Имя
                    <Input value={name} onChange={(event) => setName(event.target.value)} />
                  </label>

                  <label className="grid gap-2 text-sm font-medium">
                    Email
                    <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
                  </label>

                  <Button type="submit" disabled={updateProfile.isPending || !name.trim() || !email.trim()}>
                    Сохранить изменения
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle>Аватар</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <Input type="file" accept="image/*" onChange={handleAvatarChange} disabled={updateAvatar.isPending} />
                  <Button type="button" variant="outline" onClick={handleDeleteAvatar} disabled={deleteAvatar.isPending}>
                    Удалить аватар
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="border-b border-border">
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4 text-sm text-muted-foreground">
                  <p>{user.is_email_verified ? 'Email уже подтверждён.' : 'Email ещё не подтверждён.'}</p>
                  <Button type="button" variant="outline" onClick={handleResendVerification} disabled={resendVerification.isPending || user.is_email_verified}>
                    Отправить письмо повторно
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-destructive/40">
                <CardHeader className="border-b border-destructive/30">
                  <CardTitle className="text-destructive">Опасная зона</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4 text-sm text-muted-foreground">
                  <p>Удаление аккаунта удалит профиль пользователя на backend.</p>
                  <Button type="button" variant="destructive" onClick={handleDeleteAccount} disabled={deleteAccount.isPending}>
                    Удалить аккаунт
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </PageShell>
    </AppShell>
  );
}
