import ButtonEvent from "~/components/ui/buttons/ButtonEvent";
import { FooterBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlockUtils";
import SocialsVariantSimple from "../../shared/socials/SocialsVariantSimple";
import { useTranslation } from "react-i18next";
import DarkModeToggle from "~/components/ui/toggles/DarkModeToggle";
import ThemeSelector from "~/components/ui/selectors/ThemeSelector";
import LocaleSelector from "~/components/ui/selectors/LocaleSelector";

export default function FooterVariantSimple({ item }: { readonly item: FooterBlockDto }) {
  const { t } = useTranslation();
  return (
    <footer className="bg-blueprint-bg-base border-t border-blueprint-border-subtle">
      <div className="mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        {/* Footer Links */}
        {item.sections.map((section) => {
          return (
            <nav key={section.name} className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
              {section.items.map((link) => {
                return (
                  <div key={link.href} className="px-5 py-2">
                    <ButtonEvent
                      to={link.href}
                      target={link.target}
                      className="text-blueprint-text-muted hover:text-blueprint-accent transition-colors duration-200 text-sm"
                      event={{ action: "click", category: "footer", label: link.name, value: link.href }}
                    >
                      {t(link.name)}
                    </ButtonEvent>
                  </div>
                );
              })}
            </nav>
          );
        })}

        {/* Social Media (if provided) */}
        {item.socials && (item.socials.instagram || item.socials.twitter || item.socials.github || item.socials.discord || item.socials.youtube) && (
          <div className="mt-8 flex justify-center space-x-6">
            <SocialsVariantSimple item={item.socials} />
          </div>
        )}

        {/* Toggles (if enabled) */}
        {(item.withDarkModeToggle || item.withLanguageSelector || item.withThemeSelector) && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            {item.withDarkModeToggle && <DarkModeToggle />}
            {item.withLanguageSelector && <LocaleSelector />}
            {item.withThemeSelector && <ThemeSelector />}
          </div>
        )}

        {/* Copyright & Slogan */}
        <div className="mt-8 pt-8 border-t border-blueprint-border-subtle">
          <p className="text-center text-xs text-blueprint-text-muted">
            © 2025 Meisterwerk. Digitale Exzellenz für Ihr Handwerk.
          </p>
        </div>
      </div>
    </footer>
  );
}
