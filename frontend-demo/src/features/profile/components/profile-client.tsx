/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { Mail, ShieldCheck, UserCircle } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { StatusBadge } from '@/components/ui/status-badge';
import { useMeQuery } from '@/features/auth/hooks';

function providerLabel(provider: string) {
  if (provider === 'email/password') return 'Email и пароль';
  if (provider === 'google') return 'Google';
  if (provider === 'yandex') return 'Yandex';
  return provider;
}

export function ProfileClient() {
  const query = useMeQuery();
  const user = query.data;

  return (
    <AppShell>
      <PageShell>
        <PageHeader
          kicker="Профиль"
          title="Аккаунт пользователя"
          description="Информация о пользователе, способе регистрации, подтверждении email и подключённых социальных аккаунтах."
          actions={(
            <Button asChild variant="outline">
              <Link href="/me/settings">Настройки</Link>
            </Button>
          )}
        />

        {query.isLoading ? <LoadingState label="Загрузка профиля..." /> : null}
        {query.isError ? <ErrorState description="Не удалось получить данные пользователя." /> : null}

        {user ? (
          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <Card>
              <CardContent className="space-y-5 pt-4">
                <div className="flex items-center gap-4">
                  <div className="grid size-20 place-items-center overflow-hidden border border-border bg-muted/30">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.name} className="size-full object-cover" />
                    ) : (
                      <UserCircle className="size-10 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-heading text-2xl font-semibold tracking-wide">{user.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <StatusBadge tone={user.meta?.isAdmin ? 'warning' : 'neutral'}>{user.role ?? 'user'}</StatusBadge>
                  <StatusBadge tone={user.is_email_verified ? 'success' : 'danger'}>
                    {user.is_email_verified ? 'Email подтверждён' : 'Email не подтверждён'}
                  </StatusBadge>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="size-5 text-primary" />
                    Регистрация
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Основной способ: {Array.isArray(user.registered_via) ? user.registered_via.map(providerLabel).join(', ') : providerLabel(user.registered_via ?? 'email/password')}</p>
                  <div className="flex flex-wrap gap-2">
                    {(user.auth_providers ?? ['email/password']).map((provider) => (
                      <StatusBadge key={provider}>{providerLabel(provider)}</StatusBadge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="size-5 text-primary" />
                    Безопасность
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Email: {user.email}</p>
                  <p>Подтверждение: {user.email_verified_at ? new Date(user.email_verified_at).toLocaleString('ru-RU') : 'не выполнено'}</p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Социальные аккаунты</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.social_accounts?.length ? (
                    user.social_accounts.map((account) => (
                      <div key={account.id} className="flex flex-wrap items-center justify-between gap-3 border border-border bg-background/40 p-3 text-sm">
                        <div>
                          <p className="font-medium">{providerLabel(account.provider)}</p>
                          <p className="text-muted-foreground">{account.email ?? account.name ?? 'Данные не указаны'}</p>
                        </div>
                        <StatusBadge>{account.created_at ? new Date(account.created_at).toLocaleDateString('ru-RU') : '—'}</StatusBadge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Социальные аккаунты не подключены.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </PageShell>
    </AppShell>
  );
}
