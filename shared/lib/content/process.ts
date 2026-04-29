export interface ProcessStep {
  title: string;
  duration: string;
  text: string;
}

export interface ProcessContent {
  title: string;
  lead: string;
  steps: ProcessStep[];
  cta: string;
  ctaNote: string;
}
