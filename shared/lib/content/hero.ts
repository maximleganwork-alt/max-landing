export interface HeroStat {
  label: string;
  value?: number;
  suffix?: string;
  text?: string;
  animate: boolean;
}

export interface HeroContent {
  heading: { before: string; brand: string; after: string };
  description: string;
  primaryCta: string;
  secondaryCta: string;
  stats: HeroStat[];
}
