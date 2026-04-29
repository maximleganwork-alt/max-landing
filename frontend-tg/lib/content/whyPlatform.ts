import { Users, Wallet, Zap, Globe2 } from "lucide-react";
import type { WhyPlatformContent } from "shared/lib/content/whyPlatform";

export const whyPlatformContent: WhyPlatformContent = {
  title: "Почему Telegram — рабочий канал для бизнеса",
  items: [
    {
      icon: Users,
      title: "950+ млн пользователей",
      text: "Аудитория с активной платёжеспособностью. В РФ и СНГ — основной мессенджер для бизнес-коммуникаций.",
    },
    {
      icon: Wallet,
      title: "Нативные платежи внутри чата",
      text: "Telegram Stars, ЮKassa, СБП, любые провайдеры через Bot API. Никаких внешних редиректов.",
    },
    {
      icon: Zap,
      title: "Mini Apps и WebApp API",
      text: "Полноценные веб-приложения с авторизацией, оплатами и доступом к данным пользователя в один клик.",
    },
    {
      icon: Globe2,
      title: "Глобальная аудитория",
      text: "Один бот работает в РФ, СНГ и за рубежом. Локализация под язык пользователя — нативно.",
    },
  ],
  cta: "Узнать, как это работает у вас",
};
