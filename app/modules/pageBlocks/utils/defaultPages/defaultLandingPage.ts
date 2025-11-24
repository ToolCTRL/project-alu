import { TFunction } from "i18next";
import { PageBlockDto } from "~/modules/pageBlocks/dtos/PageBlockDto";

export function defaultLandingPage({ t }: { t: TFunction }) {
  const blocks: PageBlockDto[] = [
    {
      hero: {
        style: "meisterwerk",
        topText: undefined,
        headline: "KI-Automation für Handwerksteams.",
        subheadline: "Von Anfrage bis Abschluss – ein einziger, intelligenter Flow.",
        description: "ALU orchestriert deine Aufträge, schreibt smarte Angebote und priorisiert Einsätze automatisch. Weniger Klicks, mehr Output, 24/7.",
        cta: [
          {
            text: "Login",
            href: "/login",
            isPrimary: true,
          },
        ],
      },
    },
  ];
  return blocks;
}
