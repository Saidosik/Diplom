import { requireUser } from '@/lib/auth/guards';
import { LogoutButton } from '@/components/auth/logout-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function MePage() {
  const user = await requireUser();

  return (
    <main className="container mx-auto min-h-screen px-4 py-10">
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle>Профиль</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">ID:</span> {user.id}
            </p>
            <p>
              <span className="text-muted-foreground">Имя:</span> {user.name}
            </p>
            <p>
              <span className="text-muted-foreground">Email:</span> {user.email}
            </p>
            <p>
              <span className="text-muted-foreground">Админ:</span>{' '}
              {user.meta?.isAdmin ? 'Да' : 'Нет'}
            </p>
          </div>

          <LogoutButton />
        </CardContent>
      </Card>
    </main>
  );
}