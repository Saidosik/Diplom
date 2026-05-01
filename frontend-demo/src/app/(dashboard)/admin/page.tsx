import Link from 'next/link';
import { Users } from 'lucide-react';

import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/layout/page-header';
import { PageShell } from '@/components/layout/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <AppShell>
      <PageShell>
        <PageHeader
          kicker="Admin"
          title="Админ-панель"
          description="Заготовка административной зоны. Backend уже имеет /api/admin/users, следующим шагом сюда можно подключить таблицу пользователей."
        />

        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <Users className="size-5 text-primary" />
              Пользователи
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 text-sm leading-7 text-muted-foreground">
            <p>
              Следующий frontend-шаг: таблица пользователей с поиском, фильтром по роли и провайдеру регистрации.
            </p>
            <Button asChild variant="outline">
              <Link href="/admin/users">Таблица пользователей позже</Link>
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    </AppShell>
  );
}
