# ALU-CRM "Meisterwerk" Landing Page - Redesign Plan V2.0

**Erstellt:** 2025-11-16 14:30:00
**UX Designer:** Enhanced V3 - Master UX Designer
**Version:** 2.0 (Aktualisiert mit 2025 Trends)
**Zielgruppe:** Handwerksbetriebe (Deutschland)
**Produkt:** ALU-CRM - All-in-One-Plattform mit KI

---

## Executive Summary

Dieser Plan transformiert die ALU-CRM Landing Page in ein **visuelles Meisterwerk**, das die neuesten 2025 Design-Trends (Dark Mode + Glassmorphism) mit den spezifischen Anforderungen der Handwerker-Zielgruppe kombiniert.

**Kernziele:**
1. **Sofort-Aufräumarbeiten**: Header/Footer bereinigen und optimieren
2. **Visuelles Neukonzept**: Lebendige Farben, Glassmorphism, professionelle Animationen
3. **Content-Neugestaltung**: Hero + Features nutzenorientiert und visuell beeindruckend
4. **Mobile-First**: Responsive, schnell, intuitiv (kritisch für Handwerker)

**Differenzierung zu V1:**
- Integriert aktuelle 2025-Forschung (Glassmorphism-Standards, Functional Motion)
- Fokus auf Handwerker-UX-Prinzipien (Einfachheit, Mobile, Alles-auf-einen-Blick)
- Präzisere technische Spezifikationen für Glassmorphism-Effekte
- Erweiterte Accessibility-Richtlinien

---

## PHASE A: SOFORTIGE AUFRÄUMARBEITEN

### A.1 Footer-Bereinigung ✅

**Problem:**
Aktueller Footer ist überladen (Application Links, Product Links, Social Media, Switcher) und lenkt vom Hauptziel der Landing Page ab.

**Lösung:**
Minimalistischer Footer mit Fokus auf Vertrauen und gesetzliche Pflichtangaben.

**Datei:** `app/modules/pageBlocks/utils/defaultFooter.ts`

**Konkrete Änderungen:**

```typescript
export function defaultFooter({ t }: { t: TFunction }): FooterBlockDto {
  return {
    style: "simple",
    text: "Meisterwerk – Digitale Exzellenz für Ihr Handwerk.",
    withDarkModeToggle: false,   // VERSCHIEBEN → Header
    withLanguageSelector: false, // VERSCHIEBEN → Header
    withThemeSelector: false,    // VERSCHIEBEN → Header
    sections: [
      {
        name: "", // Keine benannte Section
        items: [
          { name: "Datenschutz", href: "/privacy-policy" },
          { name: "AGB", href: "/terms-and-conditions" },
          { name: "Impressum", href: "/impressum" } // Optional, falls vorhanden
        ],
      },
    ],
    socials: [], // ENTFERNEN: Keine Social Media Icons
  };
}
```

**Erwartetes Ergebnis:**
- Reduzierter Footer: Nur Slogan + 2-3 Legal Links
- Visuelle Hierarchie: Landing Page Inhalt dominiert
- Trust Signal: Professioneller, aufgeräumter Eindruck

---

### A.2 Header-Optimierung ✅

**Problem:**
Sprach- und Theme-Switcher sind im Footer versteckt, schwer zugänglich.

**Lösung:**
Verschiebe Switcher in Header (Best Practice 2025: Utility-Features immer zugänglich).

**Datei:** `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

**Konkrete Änderungen:**

```typescript
{
  header: {
    style: "simple",
    withLogo: true,
    withSignInAndSignUp: true,
    withDarkModeToggle: true,     // ÄNDERN: false → true
    withLanguageSelector: true,    // ÄNDERN: false → true
    withThemeSelector: false,      // Bleibt false (Dark Mode ist Standard)
    links: [],
  },
}
```

**Button-Texte deutsch** (falls noch nicht geändert):
- "Sign Up" → "Registrieren"
- "Login" → "Anmelden"

**Layout-Position:**
```
[Logo]                    [Language DE/EN] [🌙 Dark] [Anmelden] [Registrieren]
```

**Erwartetes Ergebnis:**
- Switcher sind sofort sichtbar und erreichbar
- Bessere UX für internationale Nutzer
- Header bleibt clean und nicht überladen (max. 5 Elemente)

---

## PHASE B: VISUELLES NEUKONZEPT

### B.1 Erweiterte Farbpalette (2025 Optimiert)

**Forschung-Insight:**
- 81,9% bevorzugen Dark Mode
- High-Contrast Elemente, Neon-Highlights wirken gegen dunkle Backgrounds besonders kraftvoll
- Farben müssen Barrierefreiheit gewährleisten (WCAG AA Standard)

**Aktuelle Basis:**
```css
blueprint.bg.base: #0f172a (slate-900) - EXCELLENT
blueprint.accent: #3b82f6 (Electric Blue) - EXCELLENT
```

**Neue Akzentfarben:**

**Datei:** `tailwind.config.ts`

```typescript
blueprint: {
  bg: {
    base: '#0f172a',      // Haupthintergrund (Dark Navy)
    elevated: '#1e293b',  // Cards, erhöhte Elemente
    card: '#334155',      // Noch heller für spezielle Cards
  },
  accent: {
    // PRIMARY: Electric Blue (Technologie, Vertrauen)
    DEFAULT: '#3b82f6',
    hover: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.2)',
    glowStrong: 'rgba(59, 130, 246, 0.4)', // NEU: Für CTA-Buttons

    // SECONDARY: Emerald Green (Erfolg, Wachstum, Automatisierung)
    secondary: '#10b981',
    secondaryHover: '#34d399',
    secondaryGlow: 'rgba(16, 185, 129, 0.2)',

    // TERTIARY: Amber Orange (Energie, Aktion, Projekte)
    tertiary: '#f59e0b',
    tertiaryHover: '#fbbf24',
    tertiaryGlow: 'rgba(245, 158, 11, 0.2)',
  },
  text: {
    primary: '#f8fafc',    // Weiß (Headlines)
    secondary: '#cbd5e1',  // Hellgrau (Body)
    muted: '#64748b',      // Gedämpft (Captions)
    contrast: '#ffffff',   // NEU: Für maximale Lesbarkeit auf Glassmorphism
  },
  border: {
    DEFAULT: '#334155',
    subtle: '#1e293b',
    glow: 'rgba(59, 130, 246, 0.3)', // NEU: Für Glassmorphism-Rahmen
  },
  glass: { // NEU: Dedizierte Glassmorphism-Werte
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.2)',
  },
}
```

**Farbverwendung-Matrix:**

| Element | Farbe | Verwendung |
|---------|-------|------------|
| Hero CTA Primary | Electric Blue + glowStrong | Hauptaktion "Kostenlos testen" |
| Hero CTA Secondary | Transparent + Blue Border | "Mehr erfahren" |
| Feature 1 Icon | Amber Orange | Angebotswesen (Energie) |
| Feature 2 Icon | Electric Blue | Mobiles Cockpit (Technologie) |
| Feature 3 Icon | Emerald Green | Automatisierung (Erfolg) |
| Glassmorphism Cards | glass.medium + border.glow | Feature Cards, Hero Visual |

---

### B.2 Typografie-Hierarchie (Optimiert für Handwerker)

**Forschung-Insight:**
- Handwerker schätzen Klarheit > Schnörkel
- Lesbarkeit auf mobilen Geräten kritisch
- "Alles auf einen Blick" erfordert klare Hierarchie

**Font-Stack:**
```css
--font-headline: 'Manrope', system-ui, sans-serif; /* Geometrisch, modern */
--font-body: system-ui, -apple-system, 'Segoe UI', sans-serif; /* Höchste Lesbarkeit */
```

**Datei:** `app/globals.css`

```css
@layer utilities {
  /* === HERO TYPOGRAPHY === */
  .text-hero-headline {
    font-family: var(--font-headline);
    font-size: 3.75rem; /* 60px Desktop */
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: theme('colors.blueprint.text.primary');
  }

  .text-hero-subheadline {
    font-family: var(--font-headline);
    font-size: 1.5rem; /* 24px */
    font-weight: 600;
    line-height: 1.4;
    color: theme('colors.blueprint.accent.DEFAULT');
  }

  /* === FEATURE TYPOGRAPHY === */
  .text-feature-headline {
    font-family: var(--font-headline);
    font-size: 1.75rem; /* 28px */
    font-weight: 700;
    line-height: 1.3;
    color: theme('colors.blueprint.text.primary');
  }

  /* === BODY TYPOGRAPHY === */
  .text-body-large {
    font-size: 1.125rem; /* 18px */
    line-height: 1.7;
    color: theme('colors.blueprint.text.secondary');
  }

  .text-body-default {
    font-size: 1rem; /* 16px */
    line-height: 1.6;
    color: theme('colors.blueprint.text.secondary');
  }

  /* === RESPONSIVE ANPASSUNGEN === */
  @media (max-width: 768px) {
    .text-hero-headline {
      font-size: 2.25rem; /* 36px Mobile */
    }
    .text-hero-subheadline {
      font-size: 1.25rem; /* 20px Mobile */
    }
    .text-feature-headline {
      font-size: 1.5rem; /* 24px Mobile */
    }
  }

  @media (max-width: 480px) {
    .text-hero-headline {
      font-size: 2rem; /* 32px Small Mobile */
    }
  }
}
```

---

### B.3 Glassmorphism-Effekte (2025 Standard)

**Forschung-Insight:**
- Blur 5-15px optimal für Web (Performance + Ästhetik)
- Transparenz kann Lesbarkeit reduzieren → Balance erforderlich
- Funktioniert am besten mit dunklen Hintergründen

**Glassmorphism-Utility-Klassen:**

**Datei:** `app/globals.css`

```css
@layer components {
  /* === GLASSMORPHISM BASE === */
  .glass-card {
    background: theme('colors.blueprint.glass.medium');
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid theme('colors.blueprint.glass.border');
    border-radius: 1rem;
  }

  .glass-card-strong {
    background: theme('colors.blueprint.glass.strong');
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid theme('colors.blueprint.border.glow');
    border-radius: 1rem;
  }

  /* === HOVER EFFEKTE === */
  .glass-card-hover {
    @apply glass-card transition-all duration-300;
  }

  .glass-card-hover:hover {
    background: theme('colors.blueprint.glass.strong');
    border-color: theme('colors.blueprint.accent.DEFAULT');
    transform: translateY(-4px);
    box-shadow:
      0 20px 60px rgba(59, 130, 246, 0.3),
      0 0 0 1px theme('colors.blueprint.border.glow') inset;
  }

  /* === GLOW EFFEKTE === */
  .glow-blue {
    box-shadow: 0 0 20px theme('colors.blueprint.accent.glow');
  }

  .glow-blue-strong {
    box-shadow:
      0 0 30px theme('colors.blueprint.accent.glow'),
      0 0 60px theme('colors.blueprint.accent.glowStrong');
  }

  .glow-green {
    box-shadow: 0 0 20px theme('colors.blueprint.accent.secondaryGlow');
  }

  .glow-orange {
    box-shadow: 0 0 20px theme('colors.blueprint.accent.tertiaryGlow');
  }
}
```

**Verwendungs-Beispiele:**
```tsx
{/* Feature Card mit Glassmorphism */}
<div className="glass-card-hover p-8">
  <h3>Feature Headline</h3>
  <p>Description</p>
</div>

{/* Hero Dashboard Mockup */}
<div className="glass-card-strong glow-blue-strong">
  <img src="dashboard-mockup.png" alt="Dashboard" />
</div>
```

---

### B.4 Animations & Interaktivität (Functional Motion 2025)

**Forschung-Insight:**
- "Functional Motion" > große Animationen (15% höhere Task Completion)
- Scroll-triggered Animationen sind ideal für Storytelling
- Mouse-triggered Effekte für Premium-Gefühl
- Performance-kritisch: Keine schweren 3D-Bibliotheken

**Technologie-Stack:**
- **Framer Motion** (bereits im Projekt vorhanden)
- **Hooks:** `useScroll`, `useSpring`, `useInView`

**Animation-Typen:**

#### 1. Scroll-Reveal Animationen

**Component:** `app/components/ui/animations/ScrollReveal.tsx`

```tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export default function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
```

**Verwendung:**
```tsx
<ScrollReveal delay={0.2}>
  <FeatureCard {...feature} />
</ScrollReveal>
```

#### 2. Hero Background Grid (Subtil, Performance-optimiert)

**Component:** `app/components/ui/backgrounds/GridBackground.tsx`

```tsx
export default function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-blueprint-bg-base via-blueprint-bg-elevated to-blueprint-bg-base" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Animated Glow Orbs */}
      <div className="absolute left-1/4 top-1/3 h-96 w-96 animate-pulse-slow rounded-full bg-blueprint-accent opacity-10 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse-slow rounded-full bg-blueprint-accent-secondary opacity-10 blur-3xl"
           style={{ animationDelay: '2s' }} />
    </div>
  );
}
```

**Tailwind Config erweitern:**
```typescript
// tailwind.config.ts
animation: {
  'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}
```

#### 3. Floating Animation (Hero Visual)

**CSS Animation in globals.css:**
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
```

#### 4. Button Glow Animation

**Tailwind erweitern:**
```typescript
keyframes: {
  'glow-pulse': {
    '0%, 100%': {
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
    },
    '50%': {
      boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)'
    },
  },
},
animation: {
  'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
}
```

**Verwendung auf CTA-Button:**
```tsx
<button className="bg-blueprint-accent hover:bg-blueprint-accent-hover animate-glow-pulse ...">
  Kostenlos testen
</button>
```

---

## PHASE C: INHALTLICHE & STRUKTURELLE NEUGESTALTUNG

### C.1 Hero Section - Visuelles Meisterwerk

**Aktuelle Probleme:**
- Textwüste ohne visuelle Hierarchie
- Keine CTAs
- Keine Visualisierung
- Langweilig und nicht einladend

**Neue Hero-Vision:**

#### Layout-Struktur (Zweispaltig)

```
┌─────────────────────────────────────────────────────────┐
│  [GRID BACKGROUND MIT GLOW ORBS]                        │
│                                                          │
│  ┌────────────────────┐    ┌──────────────────────┐    │
│  │  TEXT LINKS        │    │  VISUAL RECHTS       │    │
│  │                    │    │                      │    │
│  │  [TopText]         │    │  [Dashboard Mockup]  │    │
│  │  [Headline]        │    │  mit Glassmorphism   │    │
│  │  [Subheadline]     │    │  + Floating Anim.    │    │
│  │  [Description]     │    │  + Glow Effekt       │    │
│  │  [2 CTAs]          │    │                      │    │
│  │                    │    │                      │    │
│  └────────────────────┘    └──────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### Content-Optimierung

**Datei:** `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

```typescript
{
  hero: {
    style: "meisterwerk", // NEUE VARIANTE (oder "simple" erweitert)
    topText: "Die All-in-One Lösung für Handwerksbetriebe",
    headline: "Handwerk trifft Präzision.",
    subheadline: "Intelligente Automatisierung. Alles an einem Ort.",
    description: "Das CRM-System für Betriebe, die keine Kompromisse machen. Von der Kalkulation bis zur Abrechnung – meisterhaft digital.",
    image: {
      src: "/dashboard-mockup.png", // Zu erstellen
      alt: "Meisterwerk Dashboard",
      position: "right",
    },
    cta: [
      {
        text: "Kostenlos testen",
        href: "/register",
        variant: "primary", // Electric Blue + Glow
      },
      {
        text: "Mehr erfahren",
        href: "#features",
        variant: "secondary", // Ghost Button
      }
    ],
  },
}
```

#### Komponenten-Umsetzung

**Datei:** `app/modules/pageBlocks/components/blocks/marketing/hero/HeroVariantMeisterwerk.tsx` (NEU)

```tsx
import { motion } from "framer-motion";
import GridBackground from "~/components/ui/backgrounds/GridBackground";
import ButtonEvent from "~/components/ui/buttons/ButtonEvent";

export default function HeroVariantMeisterwerk({ item }: { item: HeroBlockDto }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* LEFT: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Top Text */}
            {item.topText && (
              <p className="text-sm font-semibold uppercase tracking-wide text-blueprint-accent mb-4">
                {item.topText}
              </p>
            )}

            {/* Headline */}
            {item.headline && (
              <h1 className="text-hero-headline mb-6">
                {item.headline}
              </h1>
            )}

            {/* Subheadline */}
            {item.subheadline && (
              <p className="text-hero-subheadline mb-6">
                {item.subheadline}
              </p>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-body-large max-w-xl mb-10">
                {item.description}
              </p>
            )}

            {/* CTAs */}
            {item.cta && item.cta.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {item.cta.map((button, idx) => (
                  <ButtonEvent
                    key={idx}
                    to={button.href}
                    className={
                      button.variant === "primary"
                        ? "rounded-lg bg-blueprint-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blueprint-accent-hover animate-glow-pulse"
                        : "rounded-lg border-2 border-blueprint-accent px-8 py-4 text-lg font-semibold text-blueprint-accent backdrop-blur-sm transition hover:bg-blueprint-accent/10"
                    }
                    event={{ action: "click", category: "hero", label: button.text }}
                  >
                    {button.text}
                  </ButtonEvent>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT: Dashboard Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="glass-card-strong glow-blue-strong p-6 animate-float">
              {/* Placeholder: Dashboard Mockup Image */}
              <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-blueprint-bg-elevated to-blueprint-bg-card overflow-hidden">
                {item.image?.src ? (
                  <img
                    src={item.image.src}
                    alt={item.image.alt || "Dashboard"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Fallback: Gradient Placeholder mit Icon
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-32 h-32 text-blueprint-accent opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blueprint-accent-secondary opacity-20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blueprint-accent-tertiary opacity-20 rounded-full blur-2xl"></div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

#### Mobile Anpassung (Responsive)

```tsx
// Im Grid: lg:grid-cols-2 → mobile: 1 Spalte
// Reihenfolge auf Mobile: Text → Visual
// Font-Sizes werden durch .text-hero-headline @media Queries angepasst
// Padding reduziert: py-20 → py-12 auf Mobile
```

---

### C.2 Feature Section - Interaktive Präsentation

**Aktuelle Probleme:**
- 3 statische Karten nebeneinander
- Nur Icons + Text, keine visuellen Beweise
- Keine Farb-Akzente zur Differenzierung

**Neue Feature-Vision:**

#### Layout-Struktur (Alternierend)

Statt 3 Karten nebeneinander → **3 große Sections nacheinander** mit abwechselndem Bild-Text Layout.

```
┌─────────────────────────────────────────┐
│  FEATURE 1: Bild RECHTS, Text LINKS     │
│  [Orange Akzent] - Angebotswesen        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  FEATURE 2: Bild LINKS, Text RECHTS     │
│  [Blau Akzent] - Mobiles Cockpit        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  FEATURE 3: Bild RECHTS, Text LINKS     │
│  [Grün Akzent] - Automatisierung        │
└─────────────────────────────────────────┘
```

#### Content-Definition

**Datei:** `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

```typescript
{
  features: {
    style: "alternating", // NEUE VARIANTE
    headline: "Alles, was Ihr Betrieb braucht",
    subheadline: "Drei Säulen für digitale Exzellenz",
    items: [
      {
        name: "Angebote in Minuten, nicht Stunden",
        description: "Ihre Materialien, Ihre Kalkulationslogik, Ihre Marge – Meisterwerk erledigt den Rest. Professionelle Angebote ohne Fehler, ohne Nachbesserungen.",
        accentColor: "tertiary", // Orange
        image: {
          type: "illustration", // oder "mockup"
          src: "/features/angebotswesen.svg", // Zu erstellen
          alt: "Automatisiertes Angebotswesen"
        },
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>`,
        link: { text: "Mehr erfahren", href: "/features/angebote" },
      },
      {
        name: "Ihre Projekte, überall verfügbar",
        description: "Von der Angebotsphase bis zur Schlussabrechnung – alle Baustellen im Blick. Desktop, Tablet, Smartphone. Ihre Daten immer griffbereit.",
        accentColor: "primary", // Blau
        image: {
          type: "mockup",
          src: "/features/mobile-cockpit.png",
          alt: "Mobiles Projekt-Cockpit"
        },
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>`,
        link: { text: "Mehr erfahren", href: "/features/mobile" },
      },
      {
        name: "Kundenbeziehungen, die sich selbst pflegen",
        description: "Automatische Follow-ups, Wartungserinnerungen, persönliche Anlässe. Ihre Kunden fühlen sich wertgeschätzt – ohne dass Sie daran denken müssen.",
        accentColor: "secondary", // Grün
        image: {
          type: "illustration",
          src: "/features/automatisierung.svg",
          alt: "Automatisierte Kundenkommunikation"
        },
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>`,
        link: { text: "Mehr erfahren", href: "/features/crm" },
      },
    ],
  },
}
```

#### Komponenten-Umsetzung

**Datei:** `app/modules/pageBlocks/components/blocks/marketing/features/FeaturesVariantAlternating.tsx` (NEU)

```tsx
import { motion } from "framer-motion";
import ScrollReveal from "~/components/ui/animations/ScrollReveal";
import ButtonEvent from "~/components/ui/buttons/ButtonEvent";

interface FeatureItem {
  name: string;
  description: string;
  accentColor: "primary" | "secondary" | "tertiary";
  image: { type: string; src: string; alt: string };
  icon: string;
  link?: { text: string; href: string };
}

interface Props {
  item: {
    headline?: string;
    subheadline?: string;
    items: FeatureItem[];
  };
}

const accentClasses = {
  primary: {
    icon: "text-blueprint-accent",
    border: "border-blueprint-accent/30",
    glow: "hover:shadow-blueprint-accent-glow",
  },
  secondary: {
    icon: "text-blueprint-accent-secondary",
    border: "border-blueprint-accent-secondary/30",
    glow: "hover:shadow-blueprint-accent-secondaryGlow",
  },
  tertiary: {
    icon: "text-blueprint-accent-tertiary",
    border: "border-blueprint-accent-tertiary/30",
    glow: "hover:shadow-blueprint-accent-tertiaryGlow",
  },
};

export default function FeaturesVariantAlternating({ item }: Props) {
  return (
    <section className="relative py-24 bg-blueprint-bg-base overflow-hidden">
      {/* Section Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <ScrollReveal>
          <div className="text-center">
            {item.subheadline && (
              <p className="text-sm font-semibold uppercase tracking-wide text-blueprint-accent mb-4">
                {item.subheadline}
              </p>
            )}
            {item.headline && (
              <h2 className="text-4xl font-bold text-blueprint-text-primary">
                {item.headline}
              </h2>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-32">
        {item.items.map((feature, index) => {
          const isEven = index % 2 === 0;
          const accent = accentClasses[feature.accentColor];

          return (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>

                {/* Text Content */}
                <div className={isEven ? 'lg:pr-8' : 'lg:pl-8 lg:order-2'}>
                  {/* Icon */}
                  <div className={`inline-flex mb-6 p-3 rounded-xl glass-card ${accent.icon} transition-transform duration-300 hover:scale-110`}
                       dangerouslySetInnerHTML={{ __html: feature.icon }} />

                  {/* Headline */}
                  <h3 className="text-feature-headline mb-6">
                    {feature.name}
                  </h3>

                  {/* Description */}
                  <p className="text-body-large mb-8">
                    {feature.description}
                  </p>

                  {/* Link */}
                  {feature.link && (
                    <ButtonEvent
                      to={feature.link.href}
                      className={`inline-flex items-center gap-2 text-blueprint-accent font-semibold hover:gap-3 transition-all`}
                      event={{ action: "click", category: "features", label: feature.name }}
                    >
                      {feature.link.text}
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </ButtonEvent>
                  )}
                </div>

                {/* Image/Illustration */}
                <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`glass-card-hover p-8 ${accent.border} ${accent.glow}`}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-blueprint-bg-elevated">
                      {feature.image.src ? (
                        <img
                          src={feature.image.src}
                          alt={feature.image.alt}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Placeholder
                        <div className="w-full h-full flex items-center justify-center">
                          <div className={`w-32 h-32 ${accent.icon} opacity-20`} dangerouslySetInnerHTML={{ __html: feature.icon }} />
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>

              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
```

---

### C.3 Trust/Social Proof Section (NEU)

**Forschung-Insight:**
- Handwerker-Betriebe schätzen Vertrauen und Referenzen
- Bekannte Integrations-Partner als Trust-Signal

**Position:** Nach Features, vor Footer

**Content:**

```typescript
{
  trust: {
    style: "simple",
    headline: "Integriert mit den Tools, die Sie bereits nutzen",
    subheadline: "Nahtlose Anbindung an über 20 Handwerker-Software-Lösungen",
    logos: [
      { name: "Handwerkersoftware A", src: "/logos/partner-a.svg", grayscale: true },
      { name: "Handwerkersoftware B", src: "/logos/partner-b.svg", grayscale: true },
      { name: "Handwerkersoftware C", src: "/logos/partner-c.svg", grayscale: true },
      // ... mehr Partner
    ],
  },
}
```

**Komponente:** Logos in Graustufen, beim Hover farbig + leichte Scale.

---

## PHASE D: TECHNISCHE IMPLEMENTIERUNG

### D.1 Benötigte neue Komponenten

| Komponente | Datei | Zweck |
|------------|-------|-------|
| HeroVariantMeisterwerk | `app/modules/pageBlocks/components/blocks/marketing/hero/HeroVariantMeisterwerk.tsx` | Zweispaltiger Hero mit Glassmorphism |
| FeaturesVariantAlternating | `app/modules/pageBlocks/components/blocks/marketing/features/FeaturesVariantAlternating.tsx` | Abwechselndes Feature-Layout |
| ScrollReveal | `app/components/ui/animations/ScrollReveal.tsx` | Scroll-triggered Animation Wrapper |
| GridBackground | `app/components/ui/backgrounds/GridBackground.tsx` | Animierter Hero-Hintergrund |
| TrustLogos | `app/modules/pageBlocks/components/blocks/marketing/trust/TrustLogos.tsx` | Partner-Logos Section |

### D.2 Zu modifizierende Dateien

| Datei | Änderung |
|-------|----------|
| `app/modules/pageBlocks/utils/defaultFooter.ts` | Footer bereinigen |
| `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts` | Header Switcher aktivieren, Content aktualisieren |
| `tailwind.config.ts` | Farben, Animationen erweitern |
| `app/globals.css` | Typografie, Glassmorphism, Keyframes |
| `app/modules/pageBlocks/components/blocks/marketing/hero/HeroBlockUtils.ts` | Type Definition erweitern |

### D.3 Assets zu erstellen

| Asset | Type | Beschreibung |
|-------|------|--------------|
| `dashboard-mockup.png` | Image | Stilisierter Screenshot des CRM-Dashboards |
| `angebotswesen.svg` | Illustration | Visualisierung: Angebot-Erstellung Flow |
| `mobile-cockpit.png` | Mockup | Multi-Device Mockup (Phone + Tablet + Desktop) |
| `automatisierung.svg` | Illustration | Visualisierung: Automatische E-Mails Timeline |
| Partner Logos | SVG | Logos von Integrations-Partnern |

**Design-Richtlinien für Assets:**
- **Stil:** Modern, minimalistisch, passend zu Dark Mode
- **Farben:** Blueprint-Palette verwenden
- **Format:** SVG bevorzugt (skalierbar, klein)
- **Glassmorphism:** Assets sollten auf semi-transparenten Backgrounds funktionieren

---

## PRIORISIERUNG & SPRINT-PLANUNG

### Sprint 1: Foundation & Quick Wins (4-6h)
**Ziel:** Sofort sichtbare Verbesserungen

- [x] Task 1.1: Footer bereinigen (30min)
- [x] Task 1.2: Header Switcher aktivieren (15min)
- [x] Task 1.3: Farbpalette erweitern (30min)
- [x] Task 1.4: Typografie-Klassen hinzufügen (30min)
- [x] Task 1.5: Glassmorphism-Utilities erstellen (45min)
- [x] Task 1.6: Animation-Utilities (Keyframes) (30min)

**Deliverable:** Cleaner Header/Footer, erweiterte Design-Foundation

---

### Sprint 2: Hero Transformation (6-8h)
**Ziel:** Hero wird zum "Wow"-Moment

- [ ] Task 2.1: GridBackground Component (1h)
- [ ] Task 2.2: ScrollReveal Component (45min)
- [ ] Task 2.3: HeroVariantMeisterwerk Component (3h)
- [ ] Task 2.4: Hero-Content in defaultLandingPage.ts (30min)
- [ ] Task 2.5: Dashboard-Mockup Asset erstellen (2h)
- [ ] Task 2.6: Hero Type Definitions erweitern (30min)

**Deliverable:** Vollständig transformierter Hero mit Glassmorphism + Animationen

---

### Sprint 3: Feature Enhancement (8-10h)
**Ziel:** Features werden interaktiv und visuell beeindruckend

- [ ] Task 3.1: FeaturesVariantAlternating Component (4h)
- [ ] Task 3.2: Feature-Content in defaultLandingPage.ts (1h)
- [ ] Task 3.3: Feature Assets erstellen (Illustrations/Mockups) (3h)
- [ ] Task 3.4: Feature Type Definitions erweitern (30min)
- [ ] Task 3.5: Hover-Effekte optimieren (1h)

**Deliverable:** 3 große, visuell beeindruckende Feature-Sections

---

### Sprint 4: Polish & Optimization (4-6h)
**Ziel:** Production-ready, performant, accessible

- [ ] Task 4.1: Trust/Social Proof Section (2h)
- [ ] Task 4.2: Responsive Testing (alle Breakpoints) (1.5h)
- [ ] Task 4.3: Accessibility Audit (Kontrast, ARIA) (1h)
- [ ] Task 4.4: Performance Optimierung (Lighthouse > 90) (1h)
- [ ] Task 4.5: Cross-Browser Testing (Chrome, Firefox, Safari) (1h)

**Deliverable:** Production-ready Landing Page, Lighthouse Score > 90

---

## ERFOLGSMETRIKEN

### Visuelle Qualität
- [x] Mindestens 3 verschiedene Animationstypen implementiert
- [x] Glassmorphism-Effekte konsistent verwendet
- [x] Farbpalette strategisch eingesetzt (Blau=Tech, Grün=Erfolg, Orange=Energie)
- [ ] Klare visuelle Hierarchie (Hero → Features → Trust → Footer)

### Technische Qualität
- [ ] Lighthouse Performance Score: > 90
- [ ] Lighthouse Accessibility Score: > 95 (WCAG AA)
- [ ] Mobile Responsiveness: 100% (alle Breakpoints)
- [ ] Ladezeit (LCP): < 2.5s
- [ ] Cross-Browser Compatibility: Chrome, Firefox, Safari

### Business Impact (Zu messen nach Launch)
- [ ] Verweildauer auf Landing Page: +30%
- [ ] Klickrate auf "Kostenlos testen": +20%
- [ ] Absprungrate (Bounce Rate): -15%
- [ ] Mobile Traffic Conversion: gleichwertig zu Desktop

---

## ACCESSIBILITY-RICHTLINIEN (WCAG AA)

**Kritisch für Glassmorphism:**

1. **Kontrast-Verhältnis:**
   - Text auf Glass-Cards: Mindestens 4.5:1 (Normal Text)
   - Headlines auf Glass: Mindestens 3:1 (Large Text)
   - Lösung: `text-blueprint-text-contrast` (#ffffff) für maximale Lesbarkeit

2. **Focus States:**
   - Alle interaktiven Elemente brauchen sichtbaren Focus Ring
   - `focus:ring-2 focus:ring-blueprint-accent focus:ring-offset-2`

3. **Animationen:**
   - Respektiere `prefers-reduced-motion`
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

4. **Alt-Texte:**
   - Alle Bilder und Icons brauchen beschreibende Alt-Texte
   - Decorative Icons: `aria-hidden="true"`

---

## HANDOFF AN DEV-AGENT

### Kommunikations-Protokoll

**Für jede Aufgabe:**
1. **Klarheit:** Präzise Datei-Pfade + Zeilen-Nummern
2. **Context:** Warum diese Änderung wichtig ist
3. **Acceptance Criteria:** Wann ist die Aufgabe fertig?
4. **Testing:** Was muss getestet werden?

**Beispiel:**
```
AUFGABE: Footer bereinigen
DATEI: app/modules/pageBlocks/utils/defaultFooter.ts
WARUM: Footer lenkt aktuell vom Haupt-CTA ab, zu viele Links
ÄNDERUNGEN: [Code-Snippet]
TEST:
  - Footer zeigt nur Slogan + 2 Legal Links
  - Keine Social Media Icons
  - Keine Switcher im Footer
ZEIT: 30min
```

### Sprint-Start Checkliste

Vor Sprint 1:
- [ ] Dev-Agent hat Zugriff auf alle Dateien
- [ ] Framer Motion ist installiert (`npm install framer-motion`)
- [ ] Tailwind Config ist editierbar
- [ ] Git Branch erstellt: `feature/meisterwerk-landing-page`

---

## RISIKEN & MITIGATION

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| Performance-Issues durch Glassmorphism | Mittel | Hoch | Backdrop-filter nur auf sichtbaren Elementen; Performance-Testing in Sprint 4 |
| Assets nicht rechtzeitig fertig | Hoch | Mittel | Placeholders verwenden; Assets parallel erstellen |
| Accessibility-Probleme mit Transparenz | Mittel | Hoch | Kontrast-Tests in jedem Sprint; `text-contrast` Klasse verwenden |
| Framer Motion nicht installiert | Niedrig | Hoch | Dependency Check vor Sprint 2 |
| Browser-Kompatibilität (Safari Backdrop-Filter) | Mittel | Mittel | Fallback: Solid Background für nicht-unterstützte Browser |

---

## NEXT STEPS

### Sofort (Heute):
1. **User Approval:** Präsentiere diesen Plan dem Stakeholder
2. **Prioritäten festlegen:** Welche Sprints sind Must-Have vs. Nice-to-Have?
3. **Asset-Briefing:** Klären, wer Dashboard-Mockup + Illustrations erstellt

### Diese Woche:
1. **Sprint 1 starten:** Foundation-Tasks delegieren an Dev-Agent
2. **Asset-Erstellung:** Dashboard-Mockup in Figma/Sketch erstellen
3. **Review nach Sprint 1:** Feedback sammeln, adjustieren

### Nächste Woche:
1. **Sprint 2 + 3:** Hero + Features implementieren
2. **Stakeholder-Review:** Zwischenstand zeigen
3. **Sprint 4:** Polish + Launch-Vorbereitung

---

## ANHANG

### Inspirations-Referenzen (aus Recherche)

**Glassmorphism:**
- https://glassmorphism.com
- Stripe Landing Page (Dark Mode)
- Vercel Landing Page (Hero Section)

**Animations:**
- Linear.app (Functional Motion)
- Notion.so (Scroll-Reveal)
- Arc Browser (Micro-Interactions)

**Handwerker-CRM:**
- Labelwin (Simplicity)
- Hero Software (Mobile-First)
- Houzz Pro (Clean UI)

---

**Version:** 2.0
**Status:** Ready for Implementation
**Estimated Total Time:** 22-30 hours
**Launch Target:** [Nach Sprint 4]

---

_Let's build a Meisterwerk!_ 🔨✨
