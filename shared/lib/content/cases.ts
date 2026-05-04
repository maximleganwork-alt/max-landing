/**
 * Один кейс портфолио. Все строки — на русском, плейсхолдеры
 * (анонимизированный клиент / выдуманные цифры) до тех пор, пока
 * студия не заменит их реальными.
 */
export type CaseVisualKind =
  | "chat"
  | "miniapp"
  | "kanban"
  | "dashboard"
  | "schedule"
  | "payment";

export interface CaseMetric {
  /** Большое значение, например «−40%», «+27%», «×3», «48 ч». */
  value: string;
  /** Что описывает метрика — «время обработки», «конверсия». */
  label: string;
}

export interface CaseDetails {
  /** Полное описание задачи (несколько абзацев или буллет-пунктов). */
  challenge: string[];
  /** Что вошло в поставку — буллет-пункты. */
  deliverables: string[];
  /** Дополнительные результаты (3–4 цифры) для страницы кейса. */
  results: CaseMetric[];
  /** «4 недели», «2 месяца» и т. п. */
  timeline: string;
}

export interface CaseStudy {
  /** URL-сегмент: /cases/<slug>. */
  slug: string;
  /** Анонимизированный ярлык клиента — «Сеть кофеен SmartCup». */
  client: string;
  /** Тег индустрии — «Food & Beverage», «Логистика». */
  industry: string;
  /** Короткое описание задачи (1–2 предложения). */
  task: string;
  /** Что мы сделали (1–2 предложения). */
  solution: string;
  /** Главная метрика, которая видна на карточке. */
  metric: CaseMetric;
  /** Технологии и интеграции — отображаются как теги. */
  tech: string[];
  /** Тип мокапа интерфейса. */
  visual: CaseVisualKind;
  /** Реальное изображение для карточки и страницы кейса. Хранится в public/ конкретного фронтенда. */
  image?: {
    src: string;
    alt: string;
  };
  /** Расширенные данные для страницы /cases/<slug>. */
  details: CaseDetails;
}

export interface CasesContent {
  title: string;
  lead: string;
  items: CaseStudy[];
  cta: string;
  ctaNote?: string;
}
