export interface FaqEntry {
  q: string;
  a: string;
}

export interface FaqContent {
  title: string;
  items: FaqEntry[];
  cta: string;
}
