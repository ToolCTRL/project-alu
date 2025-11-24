import { TFunction } from "i18next";
import { FooterBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlockUtils";
import { defaultSocials } from "./defaultSocials";

export function defaultFooter({ t }: { t: TFunction }): FooterBlockDto {
  return {
    style: "simple",
    text: "Meisterwerk – Digitale Exzellenz für Ihr Handwerk.",
    withDarkModeToggle: false,   // Verschoben in Header
    withLanguageSelector: false, // Verschoben in Header
    withThemeSelector: false,    // Verschoben in Header
    sections: [
      {
        name: "",
        items: [
          { name: "Datenschutz", href: "/privacy-policy" },
          { name: "AGB", href: "/terms-and-conditions" },
          { name: "Impressum", href: "/imprint" },
        ],
      },
    ],
    socials: undefined, // Keine Social Media
  };
}
