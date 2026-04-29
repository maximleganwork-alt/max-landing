import Link from "next/link";
import { Logo } from "shared/components/visuals/Logo";

export default function NotFound() {
  return (
    <main className="min-h-screen grid place-items-center px-6 py-20">
      <div className="flex flex-col items-center gap-6 text-center">
        <Logo />
        <p className="text-display font-bold bg-gradient-brand bg-clip-text text-transparent">
          404
        </p>
        <h1 className="text-h1 font-bold text-fg">Страница не найдена</h1>
        <p className="max-w-md text-body text-fg-muted">
          Возможно, вы перешли по устаревшей ссылке или ввели неверный адрес. Вернитесь на
          главную — мы уверены, что нужная информация там есть.
        </p>
        <Link
          href="/"
          prefetch
          className="inline-flex h-12 items-center justify-center rounded-[var(--radius)] bg-primary px-6 text-body font-medium text-primary-fg hover:bg-primary-hover transition-colors"
        >
          На главную
        </Link>
      </div>
    </main>
  );
}
