export type StoryBlockDto = {
  style: StoryBlockStyle;
  headline?: string;
  subheadline?: string;
  phases: StoryPhaseDto[];
};

export interface StoryPhaseDto {
  headline: string;
  text: string;
  accentColor: "primary" | "secondary" | "tertiary";
  visual?: {
    type: "illustration" | "abstract" | "mockup" | "image";
    description?: string;
    src?: string;
    alt?: string;
  };
}

export const StoryBlockStyles = [
  { value: "scroll-stuck", name: "Scroll Stuck" },
] as const;
export type StoryBlockStyle = (typeof StoryBlockStyles)[number]["value"];

export const defaultStoryBlock: StoryBlockDto = {
  style: "scroll-stuck",
  headline: "Unsere Geschichte",
  subheadline: "Der Weg zur Vision",
  phases: [
    {
      headline: "Von der Developer UG zur Vision",
      text: "Wir entwickelten Software für die Gerkens GmbH. Dabei erkannten wir: Teure, unzureichende Lösungen am Markt. Handwerker verdienen Besseres.",
      accentColor: "tertiary",
      visual: {
        type: "abstract",
        description: "Problem visualization",
      },
    },
    {
      headline: "Eine günstige, hochwertige Alternative",
      text: "Keine 300€ pro Lizenz. Sondern 15€ monatlich. Spezialisiert auf Handwerk. Mit echtem Mehrwert.",
      accentColor: "primary",
      visual: {
        type: "illustration",
        description: "Solution visualization",
      },
    },
    {
      headline: "Langfristig denken, gemeinsam wachsen",
      text: "Wir schaffen Arbeitsplätze, investieren in den Markt und revolutionieren die Branche. Gemeinsam mit unseren Partnern.",
      accentColor: "secondary",
      visual: {
        type: "mockup",
        description: "Implementation visualization",
      },
    },
  ],
};
