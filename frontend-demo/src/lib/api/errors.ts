import axios from "axios";
import type { ApiErrorPayload } from "@/lib/types";

export class ApiError extends Error {
  statusCode?: number;
  details?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.statusCode = payload.statusCode;
    this.details = payload.details;
  }
}

export function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    return new ApiError({
      message:
        (error.response?.data as { message?: string } | undefined)?.message ??
        error.message ??
        "Неизвестная ошибка запроса.",
      statusCode: error.response?.status,
      details: error.response?.data,
    });
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message });
  }

  return new ApiError({ message: "Произошла неизвестная ошибка." });
}
