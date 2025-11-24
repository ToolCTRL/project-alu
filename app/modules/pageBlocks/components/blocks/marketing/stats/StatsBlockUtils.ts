export type StatsBlockDto = {
  style: StatsBlockStyle;
  headline?: string;
  subheadline?: string;
  items: StatDto[];
};

export interface StatDto {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  accentColor?: "primary" | "secondary" | "tertiary";
}

export const StatsBlockStyles = [
  { value: "grid", name: "Grid" },
] as const;
export type StatsBlockStyle = (typeof StatsBlockStyles)[number]["value"];

export const defaultStatsBlock: StatsBlockDto = {
  style: "grid",
  items: [
    {
      value: 500,
      suffix: "+",
      label: "Betriebe vertrauen uns",
      accentColor: "primary",
    },
    {
      value: 10000,
      suffix: "+",
      label: "Angebote erstellt",
      accentColor: "secondary",
    },
    {
      value: 98,
      suffix: "%",
      label: "Kundenzufriedenheit",
      accentColor: "tertiary",
    },
  ],
};
