import { MessageCircle, Send, Phone, Mail } from "lucide-react";
import type { LeadFormContent } from "shared/lib/content/leadForm";

export const leadFormContent: LeadFormContent = {
  title: "Расскажите о задаче",
  lead: "Заполните форму — обсудим проект, бесплатно подготовим оценку и ТЗ. Или напишите нам напрямую — выбирайте удобный способ.",
  contactsTitle: "Хотите написать самостоятельно?",
  contactsLead:
    "Свяжитесь в любом удобном мессенджере — отвечаем в рабочее время в течение 30 минут.",
  contacts: [
    {
      icon: MessageCircle,
      iconBgClass: "bg-gradient-to-br from-[#5b8dff] to-[#8b5cf6] text-white",
      title: "Написать в MAX",
      subtitle: "Открыть чат",
      href: "https://max.ru/u/f9LHodD0cOKjUd8UClXenOZwU5qXWJ9wt6FCPLR7Ha3GUJ4fhkE5RJJ-rLo",
      goal: "direct_message_click_max",
    },
    {
      icon: Send,
      iconBgClass: "bg-[#229ED9] text-white",
      title: "Написать в Telegram",
      subtitle: "@legan_studio",
      href: "https://t.me/legan_studio",
      goal: "direct_message_click_telegram",
    },
    {
      icon: Phone,
      iconBgClass: "bg-success text-white",
      title: "Позвонить",
      subtitle: "+7 978 734 26 41",
      href: "tel:+79787342641",
    },
    {
      icon: Mail,
      iconBgClass: "bg-fg text-bg",
      title: "Написать на email",
      subtitle: "legan-studio@yandex.com",
      href: "mailto:legan-studio@yandex.com",
    },
  ],
};
