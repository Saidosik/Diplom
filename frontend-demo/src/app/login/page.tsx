import { LoginForm } from "@/components/demo/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="centered-page">
      <Card className="login-card">
        <div className="stack-md">
          <div className="stack-sm">
            <p className="eyebrow">Авторизация</p>
            <h1 className="page-title">Вход в учебный проект</h1>
            <p className="page-description">
              Здесь показан полный цикл формы: валидация, API-вызов, cookie/token и redirect.
            </p>
          </div>

          <LoginForm />
        </div>
      </Card>
    </div>
  );
}
