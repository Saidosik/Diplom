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
import { registerSchema } from '@/features/auth/schemas';
import type { RegisterDto } from '@/features/auth/types';
import { useRegisterMutation } from '@/features/auth/hooks';
import { SocialAuthButtons } from './social-auth-buttons';
import {
  applyLaravelValidationErrors,
  getApiErrorMessage,
} from '@/lib/utils/api-error';

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  async function onSubmit(values: RegisterDto) {
    try {
      await registerMutation.mutateAsync(values);

      toast.success('Аккаунт создан');

      router.push('/me');
      router.refresh();
    } catch (error) {
      const handled = applyLaravelValidationErrors<RegisterDto>(error, setError);

      if (handled) {
        return;
      }

      toast.error(getApiErrorMessage(error, 'Не удалось зарегистрироваться'));
    }
  }
  const serverError = axios.isAxiosError(registerMutation.error)
    ? registerMutation.error.response?.data?.message
    : null;

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Регистрация</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input id="name" {...register('name')} />
            {errors.name ? (
              <p className="text-sm text-red-400">{errors.name.message}</p>
            ) : null}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Повтор пароля</Label>
            <Input
              id="password_confirmation"
              type="password"
              {...register('password_confirmation')}
            />
            {errors.password_confirmation ? (
              <p className="text-sm text-red-400">
                {errors.password_confirmation.message}
              </p>
            ) : null}
          </div>

          {serverError ? (
            <p className="text-sm text-red-400">{serverError}</p>
          ) : null}

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Создаём аккаунт...' : 'Зарегистрироваться'}
          </Button>

          <SocialAuthButtons />
        </form>
      </CardContent>
    </Card>
  );
}