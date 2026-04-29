import {
  Building2,
  LayoutGrid,
  Megaphone,
  MessageCircle,
  Plug,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";
import type { ServicesContent } from "shared/lib/content/services";

// Порядок важен: первая карточка = featured (2×2), шестая = wide (2×1) на lg
export const servicesContent: ServicesContent = {
  title: "Что мы разрабатываем для MAX",
  lead: "Любые типы ботов и мини-приложений — от простых FAQ-помощников до сложных систем с AI и интеграцией в вашу инфраструктуру.",
  items: [
    {
      icon: Sparkles,
      title: "AI-интеграции",
      text: "GPT, Claude, GigaChat, YandexGPT и локальные Llama/Qwen. Умные диалоги, RAG по базе знаний, голос, распознавание изображений.",
    },
    {
      icon: MessageCircle,
      title: "Боты поддержки",
      text: "Закрываем 80% типовых обращений: FAQ, тикеты, маршрутизация на оператора.",
    },
    {
      icon: ShoppingBag,
      title: "Продающие боты",
      text: "Каталог, оформление заказа, оплата по СБП, статус доставки — всё внутри MAX.",
    },
    {
      icon: Users,
      title: "HR-боты",
      text: "Рекрутинг, онбординг новых сотрудников, опросы, заявки на отпуск.",
    },
    {
      icon: Building2,
      title: "Корпоративные боты",
      text: "Внутренний документооборот, заявки, согласования, уведомления для сотрудников.",
    },
    {
      icon: LayoutGrid,
      title: "Мини-приложения",
      text: "Полноценные веб-приложения, запускаемые прямо из чата.",
    },
    {
      icon: Megaphone,
      title: "Маркетинг и лиды",
      text: "Лидогенерация, квизы, рассылки сегментам, персонализированные офферы.",
    },
    {
      icon: Plug,
      title: "CRM и ERP",
      text: "1С, Битрикс24, amoCRM, ваши API. Бот становится частью существующих процессов.",
    },
  ],
  cta: "Получить оценку",
};
