import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ru";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description:
    "Согласие пользователя на обработку персональных данных в соответствии с 152-ФЗ.",
  alternates: { canonical: "/consent" },
};

export default function ConsentPage() {
  return (
    <>
      <JsonLd
        variant="legal"
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Согласие на обработку ПДн", url: `${SITE_URL}/consent` },
        ]}
      />
      <Header />
      <main id="main" className="pt-[calc(var(--header-height)+32px)]">
        <article className="container-narrow max-w-3xl pb-20">
          <Link
            href="/"
            prefetch
            className="inline-flex items-center gap-2 text-body-sm text-fg-muted hover:text-fg transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> На главную
          </Link>

          <h1 className="mt-6 text-h1 font-bold text-fg">
            Согласие на обработку персональных данных
          </h1>
          <p className="mt-2 text-body-sm text-fg-subtle">
            Дата публикации: 27 апреля 2026 г. Редакция №1.
          </p>

          <div className="mt-10 flex flex-col gap-6 text-body text-fg-muted leading-relaxed">
            <p>
              Заполняя форму обратной связи на сайте и устанавливая отметку напротив поля
              «Согласен на обработку персональных данных», пользователь свободно, своей волей и в
              своём интересе даёт оператору согласие на обработку своих персональных данных в
              соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ.
            </p>

            <h2 className="text-h2 font-bold text-fg mt-4">Оператор</h2>
            <address className="not-italic">
              ИП Иванов Иван Иванович<br />
              ИНН: 123456789012<br />
              ОГРНИП: 123456789012345<br />
              Адрес: 123456, г. Москва, ул. Примерная, д. 1<br />
              Email:{" "}
              <a
                href="mailto:hello@example.ru"
                className="text-primary hover:underline underline-offset-2"
              >
                hello@example.ru
              </a>
            </address>

            <h2 className="text-h2 font-bold text-fg mt-4">Состав персональных данных</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>имя;</li>
              <li>контактные данные (телефон, никнейм в мессенджере);</li>
              <li>содержание сообщения, переданного через форму;</li>
              <li>технические данные, автоматически собираемые браузером.</li>
            </ul>

            <h2 className="text-h2 font-bold text-fg mt-4">Цели обработки</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>обработка обращений и заявок пользователя;</li>
              <li>заключение и исполнение договора на оказание услуг;</li>
              <li>информирование пользователя о статусе обращения;</li>
              <li>анализ посещаемости сайта в обезличенном виде.</li>
            </ul>

            <h2 className="text-h2 font-bold text-fg mt-4">Действия с персональными данными</h2>
            <p>
              Сбор, запись, систематизация, накопление, хранение, уточнение, использование,
              передача (за исключением распространения и предоставления), обезличивание,
              блокирование, удаление, уничтожение персональных данных.
            </p>

            <h2 className="text-h2 font-bold text-fg mt-4">Срок действия согласия</h2>
            <p>
              Согласие действует до момента его отзыва. Отзыв производится путём направления
              письменного запроса на адрес электронной почты оператора.
            </p>

            <h2 className="text-h2 font-bold text-fg mt-4">Заключительные положения</h2>
            <p>
              С Политикой конфиденциальности можно ознакомиться по ссылке{" "}
              <Link
                href="/privacy"
                className="text-primary hover:underline underline-offset-2"
              >
                /privacy
              </Link>
              . Пользователь подтверждает, что ознакомлен с условиями обработки и согласен с
              ними.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
