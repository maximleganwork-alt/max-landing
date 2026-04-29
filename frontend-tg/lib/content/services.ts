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
  title: "Что мы разрабатываем для Telegram",
  lead: "Любые типы ботов и мини-приложений: от FAQ-помощников до сложных систем с AI, оплатами и интеграцией с вашими сервисами.",
  items: [
    {
      icon: Sparkles,
      title: "AI-ассистенты",
      text: "GPT, Claude, Gemini, GigaChat и опенсорс. Умные диалоги, RAG по базе знаний, голосовые ответы, распознавание изображений и документов.",
    },
    {
      icon: MessageCircle,
      title: "Боты поддержки",
      text: "Закрываем 80% типовых обращений: FAQ, тикеты, маршрутизация на оператора, история диалога.",
    },
    {
      icon: ShoppingBag,
      title: "Продающие боты",
      text: "Каталог, корзина, оплата через Telegram Stars, ЮKassa, СБП. Уведомления о статусе заказа в чат.",
    },
    {
      icon: Users,
      title: "HR-боты",
      text: "Рекрутинг, онбординг, опросы вовлечённости, 360-градусные оценки, заявки на отпуск и ИТ-поддержку.",
    },
    {
      icon: Building2,
      title: "Корпоративные боты",
      text: "Внутренний документооборот, согласования, бронирование переговорок, рассылки по отделам.",
    },
    {
      icon: LayoutGrid,
      title: "Telegram Mini Apps",
      text: "Полноценные веб-приложения внутри Telegram: каталоги, личные кабинеты, дашборды, игры.",
    },
    {
      icon: Megaphone,
      title: "Маркетинг и лиды",
      text: "Лидогенерация, квизы, реферальные программы, рассылки по сегментам и реактивация подписчиков.",
    },
    {
      icon: Plug,
      title: "CRM и ERP",
      text: "Интеграции с amoCRM, Битрикс24, 1С и любыми REST/GraphQL API. Бот — часть вашего стека.",
    },
  ],
  cta: "Получить оценку",
};
