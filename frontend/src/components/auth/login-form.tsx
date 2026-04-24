'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { loginSchema } from '@/features/auth/schemas';
import type { LoginDto } from '@/features/auth/types';
import { useLoginMutation } from '@/features/auth/hooks';
import { SocialAuthButtons } from './social-auth-buttons';
import {
  applyLaravelValidationErrors,
  getApiErrorMessage,
} from '@/lib/utils/api-error';

export function LoginForm() {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginDto) {
    try {
      await loginMutation.mutateAsync(values);

      toast.success('Вы вошли в аккаунт');

      router.push('/me');
      router.refresh();
    } catch (error) {
      const handled = applyLaravelValidationErrors<LoginDto>(error, setError);

      if (handled) {
        return;
      }

      toast.error(getApiErrorMessage(error, 'Не удалось войти'));
    }
  }

  const serverError = axios.isAxiosError(loginMutation.error)
    ? loginMutation.error.response?.data?.message
    : null;

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Вход</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Почта</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email ? (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password ? (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            ) : null}
          </div>

          {serverError ? (
            <p className="text-sm text-red-400">{serverError}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Входим...' : 'Войти'}
          </Button>

          <SocialAuthButtons />
        </form>
      </CardContent>
    </Card>
  );
}