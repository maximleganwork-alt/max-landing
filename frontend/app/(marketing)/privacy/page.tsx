import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.ru";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Политика обработки персональных данных в соответствии с 152-ФЗ. Состав собираемых данных, цели и сроки обработки.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        variant="legal"
        breadcrumbs={[
          { name: "Главная", url: `${SITE_URL}/` },
          { name: "Политика конфиденциальности", url: `${SITE_URL}/privacy` },
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

          <h1 className="mt-6 text-h1 font-bold text-fg">Политика конфиденциальности</h1>
          <p className="mt-2 text-body-sm text-fg-subtle">
            Дата публикации: 27 апреля 2026 г. Редакция №1.
          </p>

          <div className="mt-10 flex flex-col gap-8 text-body text-fg-muted leading-relaxed">
            <section>
              <h2 className="text-h2 font-bold text-fg mb-3">1. Общие положения</h2>
              <p>
                Настоящая Политика обработки персональных данных (далее — Политика) разработана в
                соответствии с Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»
                и определяет порядок обработки персональных данных и меры по обеспечению
                безопасности персональных данных, предпринимаемые оператором.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-fg mb-3">2. Состав собираемых данных</h2>
              <p>Оператор обрабатывает следующие категории персональных данных:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>имя пользователя;</li>
                <li>контактные данные (телефон, никнейм в мессенджере, email);</li>
                <li>содержание сообщения, отправленного через форму на сайте;</li>
                <li>
                  технические данные, автоматически передаваемые браузером (IP-адрес, информация
                  об устройстве и браузере, cookies, UTM-метки).
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-fg mb-3">3. Цели обработки</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>обратная связь с пользователем по его запросу;</li>
                <li>заключение и исполнение договора на оказание услуг;</li>
                <li>анализ посещаемости и улучшение качества сайта (агрегированная статистика).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-fg mb-3">4. Правовые основания</h2>
              <p>
                Обработка персональных данных осуществляется на основании Федерального закона
                № 152-ФЗ и согласия субъекта персональных данных, выраженного путём заполнения
                формы на сайте и подтверждения чекбокса согласия.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-fg mb-3">5. Передача третьим лицам</h2>
              <p>
                Оператор не передаёт персональные данные третьим лицам, за исключением сервисов
                веб-аналитики ООО «Яндекс» (Яндекс.Метрика). Указанные сервисы обрабатывают
                обезличенные технические данные в рамках своей политики конфиденциальности.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-fg mb-3">6. Сроки хранения</h2>
              <p>
                Персональные данные хранятся не дольше, чем этого требуют цели обработки, либо
                до момента отзыва согласия субъекта.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-fg mb-3">7. Права субъекта ПДн</h2>
              <p>
                Субъект персональных данных вправе получать информацию о составе и условиях
                обработки, требовать уточнения, блокирования или уничтожения своих персональных
                данных, отзывать согласие на их обработку, а также обращаться в уполномоченный
                орган по защите прав субъектов персональных данных.
              </p>
            </section>

            <section>
              <h2 className="text-h2 font-bold text-fg mb-3">8. Контакты оператора</h2>
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
            </section>

            <section>
              <h2 className="text-h2 font-bold text-fg mb-3">9. Изменения политики</h2>
              <p>
                Оператор вправе вносить изменения в настоящую Политику. Актуальная редакция
                публикуется на этой странице. Дата последней редакции указана в начале документа.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
