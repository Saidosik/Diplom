"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="centered-page">
      <div className="card login-card stack-md">
        <div className="stack-sm">
          <p className="eyebrow">Ошибка</p>
          <h1 className="page-title">Что-то пошло не так</h1>
          <p className="page-description">{error.message}</p>
        </div>

        <Button onClick={reset}>Попробовать снова</Button>
      </div>
    </div>
  );
}
