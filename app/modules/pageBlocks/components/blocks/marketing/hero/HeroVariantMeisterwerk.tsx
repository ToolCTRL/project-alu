import { motion } from "framer-motion";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import HybridBackground from "~/components/ui/backgrounds/HybridBackground";
import ButtonEvent from "~/components/ui/buttons/ButtonEvent";
import type { HeroBlockDto } from "./HeroBlockUtils";
import { use3DTilt } from "~/hooks/use3DTilt";
import { useRootData } from "~/utils/data/useRootData";
import LogoDark from "~/assets/img/logo-dark.png";
import AluLogo from "~/assets/img/ALU_LOGO.png";

type HeroScene = {
  id: string;
  label: string;
  title: string;
  description: string;
  bullets: string[];
  metricPrimary: { label: string; value: string; hint: string };
  metricSecondary: { label: string; value: string; hint: string };
  haloClass: string;
  panelGradient: string;
  tokenAccent: string;
};

const heroScenes: HeroScene[] = [
  {
    id: "analyse",
    label: "Analyse",
    title: "KI scannt jeden Auftrag in Echtzeit",
    description: "Alle Tickets, Sensoren und Pläne laufen in einer KI-Schicht zusammen – sie markiert Engpässe, filtert Rauschen und spielt nur relevante Jobs an Menschen aus.",
    bullets: ["Heatmap über laufende Aufträge", "Störungen automatisch vorgefiltert", "Passende Runbooks vorgeschlagen"],
    metricPrimary: { label: "Automatisiert", value: "92%", hint: "Aufträge ohne manuellen Schritt" },
    metricSecondary: { label: "Rauschen reduziert", value: "1.3M → 84K", hint: "Events für Menschen" },
    haloClass: "hero-stage__halo--analyse",
    panelGradient: "from-sky-500/20 via-indigo-500/10 to-blue-900/60",
    tokenAccent: "token-accent-sky",
  },
  {
    id: "automate",
    label: "Automate",
    title: "Angebote und Einsätze werden vorbereitet",
    description: "Policies kalkulieren Preise, Material und Besetzung. Du gibst nur noch frei – alles andere erledigt die KI im Hintergrund.",
    bullets: ["Preisvorschläge in Sekunden", "Slack/Teams-Freigabe mit 1 Klick", "Teams werden automatisch reserviert"],
    metricPrimary: { label: "Angebote in", value: "45s", hint: "vom Lead zur Summe" },
    metricSecondary: { label: "Freigaben", value: "-63%", hint: "Klicks gespart" },
    haloClass: "hero-stage__halo--automate",
    panelGradient: "from-emerald-400/20 via-cyan-500/10 to-blue-900/60",
    tokenAccent: "token-accent-emerald",
  },
  {
    id: "impact",
    label: "Impact",
    title: "Zeig Impact ohne Nacharbeit",
    description: "Dashboards bündeln Zeitgewinn, Marge und Auslastung – verständlich für Ops und Geschäftsführung, ohne Daten wrangeln.",
    bullets: ["Zeitgewinn je Auftrag", "Auslastung pro Crew live", "Marge & Risiko in einem Blick"],
    metricPrimary: { label: "Zeitersparnis", value: "-38%", hint: "Durchlaufzeit" },
    metricSecondary: { label: "Mehr Marge", value: "+14%", hint: "pro Auftrag" },
    haloClass: "hero-stage__halo--impact",
    panelGradient: "from-fuchsia-500/30 via-purple-500/10 to-blue-900/70",
    tokenAccent: "token-accent-fuchsia",
  },
];

interface Props {
  readonly item: HeroBlockDto;
}

export default function HeroVariantMeisterwerk({ item }: Readonly<Props>) {
  const { t } = useTranslation();
  const { appConfiguration } = useRootData();
  const currentScene = heroScenes[0];
  const primaryCta = (item.cta ?? [])[0] ?? { text: "Login", href: "/login", isPrimary: true };
  const companyLogo = appConfiguration?.branding.logoDarkMode ?? appConfiguration?.branding.logo ?? LogoDark;

  return (
    <section data-testid="hero-meisterwerk" className="hero-meisterwerk relative flex flex-col overflow-hidden">
      <HybridBackground className="hero-shell" />

      <div className="hero-mosaic relative z-10 mx-auto flex w-full max-w-6xl flex-col px-4 py-14 sm:px-6 lg:flex-row lg:items-start lg:gap-12 lg:py-24">
        <div className="hero-mosaic__text flex flex-1 flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-4xl space-y-6">
            {item.headline && <h1 className="text-hero-headline">{t(item.headline)}</h1>}

            {item.subheadline && (
              <p className="text-hero-subheadline max-w-2xl text-blueprint-muted">
                {t(item.subheadline)}
              </p>
            )}
          </motion.div>

          {item.description && (
            <p className="text-body-large max-w-3xl text-blueprint-muted">{t(item.description)}</p>
          )}

          <div className="hero-mosaic__cta flex flex-wrap gap-3">
            <ButtonEvent
              to={primaryCta.href}
              className={clsx("hero-cta", "hero-cta--primary")}
              event={{
                action: "click",
                category: "hero",
                label: t(primaryCta.text ?? "Login"),
                value: primaryCta.href ?? "/login",
              }}
            >
              {t(primaryCta.text ?? "Login")}
            </ButtonEvent>
          </div>
        </div>

        <div className="hero-mosaic__cluster flex flex-1 flex-col gap-5">
          <div className="hero-stage-wrap">
            <HeroSpatialStage scene={currentScene} />
          </div>
          <div className="hero-logo-row glass-card-strong">
            <img src={companyLogo} alt="Company logo" className="hero-logo-row__logo hero-logo-row__logo--company" />
            <div className="hero-logo-powered">
              <span className="hero-logo-row__label">Powered by</span>
              <img src={AluLogo} alt="ALU Logo" className="hero-logo-row__logo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroSpatialStage({ scene }: { readonly scene: HeroScene }) {
  const { handleMouseMove, handleMouseLeave } = use3DTilt();
  return (
    <div className="hero-stage hero-stage-fixed hero-card hero-card--stage mx-auto" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ transformStyle: "preserve-3d", height: "100%" }}>
      <div className={`hero-stage__halo ${scene.haloClass}`} />
      <motion.div
        key={scene.id}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`hero-stage__panel hero-stage__panel--fixed bg-gradient-to-br ${scene.panelGradient}`}
      >
        <div className="hero-stage__panel-top">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/60">{scene.metricPrimary.label}</p>
            <p className="text-4xl font-semibold text-white">{scene.metricPrimary.value}</p>
            <p className="text-sm text-white/70">{scene.metricPrimary.hint}</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">{scene.metricSecondary.label}</p>
            <p className="text-3xl font-semibold text-white">{scene.metricSecondary.value}</p>
            <p className="text-xs text-white/60">{scene.metricSecondary.hint}</p>
          </div>
        </div>
        <div className="hero-stage__panel-footer">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">{scene.label}</p>
          <p className="text-base text-white/80">Live KI-Cockpit · {scene.label} in Echtzeit</p>
        </div>
      </motion.div>
    </div>
  );
}

