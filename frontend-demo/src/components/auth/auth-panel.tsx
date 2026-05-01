'use client';

import { useSearchParams } from 'next/navigation';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

export function AuthPanel() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm uppercase tracking-[0.35em] text-primary">
          Вектор
        </p>

        <h1 className="text-3xl font-semibold tracking-tight">
          Вход в платформу
        </h1>

        <p className="text-sm text-muted-foreground">
          Войдите в аккаунт или создайте профиль для обучения.
        </p>
      </div>

      <Tabs defaultValue={mode} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Вход</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-4">
          <LoginForm />
        </TabsContent>

        <TabsContent value="register" className="mt-4">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}