export class ApiError extends Error {
  constructor(
    public message: string,
    public status: number,
    public code: string // например: 'AUTH_EXPIRED', 'VALIDATION_FAILED'
  ) {
    super(message);
  }
}

export async function safeRequest<T>(promise: Promise<T>) {
  try {
    const data = await promise;
    return { success: true, data, error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, data: null, error: error };
    }
    return { success: false, data: null, error: new ApiError('Неизвестная ошибка', 500, 'UNKNOWN') };
  }
}