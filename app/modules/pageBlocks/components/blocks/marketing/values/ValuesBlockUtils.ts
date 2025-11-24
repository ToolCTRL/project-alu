export type ValuesBlockDto = {
  style: ValuesBlockStyle;
  headline?: string;
  subheadline?: string;
  items: ValueDto[];
};

export interface ValueDto {
  headline: string;
  description: string;
  icon: string; // SVG string
  accentColor: "primary" | "secondary" | "tertiary";
}

export const ValuesBlockStyles = [
  { value: "grid", name: "Grid" },
] as const;
export type ValuesBlockStyle = (typeof ValuesBlockStyles)[number]["value"];

export const defaultValuesBlock: ValuesBlockDto = {
  style: "grid",
  headline: "Unsere Werte",
  subheadline: "Was uns antreibt",
  items: [
    {
      headline: "Günstig & Fair",
      description:
        "Keine 300€ pro Lizenz, sondern 15€ monatlich – weil wir etwas zurückgeben wollen an die Handwerksbranche.",
      accentColor: "tertiary",
      icon: `<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`,
    },
    {
      headline: "Simpel & Effizient",
      description:
        "Einfache Bedienung, die den Arbeitsalltag erleichtert und manuelle Prozesse automatisiert, damit mehr Zeit für das Wesentliche bleibt.",
      accentColor: "primary",
      icon: `<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
</svg>`,
    },
    {
      headline: "Anbindung & Flexibilität",
      description:
        "Bindet nahtlos an bestehende Software an, zwingt nicht zum Systemwechsel, sondern integriert sich perfekt in Ihre Arbeitsabläufe.",
      accentColor: "secondary",
      icon: `<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
</svg>`,
    },
    {
      headline: "Langfristige Partnerschaft",
      description:
        "Langfristige Perspektive statt kurzfristiger Gewinn – wir schaffen Arbeitsplätze, investieren in den Markt und wachsen gemeinsam mit unseren Partnern.",
      accentColor: "primary",
      icon: `<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
</svg>`,
    },
    {
      headline: "Immer erreichbar",
      description:
        "Fester Supportbetrag, unser Team ist immer für Sie da, um schnelle und kompetente Hilfe zu leisten.",
      accentColor: "secondary",
      icon: `<svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
</svg>`,
    },
  ],
};
