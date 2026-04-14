import Link from "next/link";

export default function NotFound() {
  return (
    <div className="centered-page">
      <div className="card login-card stack-md">
        <div className="stack-sm">
          <p className="eyebrow">404</p>
          <h1 className="page-title">Страница не найдена</h1>
          <p className="page-description">
            Возможно, маршрут изменился или slug указан неверно.
          </p>
        </div>

        <Link href="/" className="text-link">
          Вернуться на главную →
        </Link>
      </div>
    </div>
  );
}
