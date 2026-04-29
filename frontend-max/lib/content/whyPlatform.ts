import { Users, Smartphone, Wallet, Shield } from "lucide-react";
import type { WhyPlatformContent } from "shared/lib/content/whyPlatform";

export const whyPlatformContent: WhyPlatformContent = {
  title: "Почему MAX — это новая точка роста для бизнеса",
  items: [
    {
      icon: Users,
      title: "100+ млн пользователей",
      text: "Активная аудитория растёт каждый день. По прогнозам VK — до 125 млн к 2027 году.",
    },
    {
      icon: Smartphone,
      title: "Предустановлен на смартфонах РФ",
      text: "С 1 сентября 2025 MAX обязателен к предустановке. Ваш бот доступен из коробки.",
    },
    {
      icon: Wallet,
      title: "Платежи внутри мессенджера",
      text: "Принимайте оплату, не выводя пользователя в браузер. СБП, карты, рассрочка — нативно.",
    },
    {
      icon: Shield,
      title: "Госуслуги и цифровой ID",
      text: "Подтверждение личности и электронная подпись прямо в боте — для финтеха, медицины, B2G.",
    },
  ],
  cta: "Узнать, как это работает у вас",
};
