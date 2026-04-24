import axios from 'axios';
import type { UseFormSetError, FieldValues, Path } from 'react-hook-form';

export type LaravelValidationErrors = Record<string, string[]>;

export type LaravelErrorResponse = {
  message?: string;
  errors?: LaravelValidationErrors;
};

export function getApiErrorMessage(error: unknown, fallback = 'Произошла ошибка') {
  if (axios.isAxiosError<LaravelErrorResponse>(error)) {
    return error.response?.data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export function applyLaravelValidationErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
) {
  if (!axios.isAxiosError<LaravelErrorResponse>(error)) {
    return false;
  }

  const errors = error.response?.data?.errors;

  if (!errors) {
    return false;
  }

  Object.entries(errors).forEach(([field, messages]) => {
    setError(field as Path<T>, {
      type: 'server',
      message: messages[0] ?? 'Некорректное значение',
    });
  });

  return true;
}