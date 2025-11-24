# Dev-Agent Instructions V2: Meisterwerk Landing Page Transformation

**Created:** 2025-11-16 14:30:00
**From:** UX Designer (Enhanced V3)
**To:** Developer Agent
**Project:** ALU-CRM Meisterwerk Landing Page
**Version:** 2.0 (Updated with 2025 Trends)

---

## WICHTIGE HINWEISE VOR START

**Arbeitsweise:**
1. ✅ Teste jeden Task einzeln BEVOR du zum nächsten gehst
2. ✅ Commite nach jedem abgeschlossenen Sprint
3. ✅ Bei Problemen oder Unklarheiten: Rückmeldung an UX Designer
4. ✅ Prüfe ob Framer Motion installiert ist: `npm list framer-motion`

**Prioritäten:**
- **MUST HAVE:** Alle Tasks mit 🔴 HIGH Priority
- **SHOULD HAVE:** Tasks mit 🟡 MEDIUM Priority
- **NICE TO HAVE:** Tasks mit 🟢 LOW Priority + alle "(optional)" Tasks

---

## SPRINT 1: FOUNDATION & QUICK WINS

**Ziel:** Sofort sichtbare Verbesserungen + Design-Foundation
**Geschätzte Zeit:** 4-6 Stunden
**Deliverable:** Cleaner Header/Footer, erweiterte Design-Tokens

---

### 🔴 Task 1.1: Footer Bereinigung

**Priority:** HIGH
**Time:** 30 minutes
**Datei:** `app/modules/pageBlocks/utils/defaultFooter.ts`

**Problem:**
Footer ist überladen mit Links, Social Media Icons und Switchers. Lenkt vom Haupt-CTA ab.

**Lösung:**
Minimalistischer Footer mit nur Slogan + Legal Links.

**Schritte:**

1. Öffne `app/modules/pageBlocks/utils/defaultFooter.ts`

2. Ersetze den gesamten Return-Wert der `defaultFooter` Funktion:

```typescript
export function defaultFooter({ t }: { t: TFunction }): FooterBlockDto {
  return {
    style: "simple",
    text: "Meisterwerk – Digitale Exzellenz für Ihr Handwerk.",
    withDarkModeToggle: false,   // Wird in Header verschoben
    withLanguageSelector: false, // Wird in Header verschoben
    withThemeSelector: false,    // Wird in Header verschoben
    sections: [
      {
        name: "",
        items: [
          { name: "Datenschutz", href: "/privacy-policy" },
          { name: "AGB", href: "/terms-and-conditions" },
        ],
      },
    ],
    socials: [], // ALLE Social Media Icons entfernen
  };
}
```

3. Speichern

**Testing:**
- [ ] Footer zeigt nur "Meisterwerk – Digitale Exzellenz für Ihr Handwerk"
- [ ] Footer zeigt 2 Links: "Datenschutz" + "AGB"
- [ ] KEINE Social Media Icons
- [ ] KEINE Switcher (Language, Dark Mode)

**Expected Result:**
Clean, minimalistischer Footer der nicht vom Content ablenkt.

---

### 🔴 Task 1.2: Header Switcher aktivieren

**Priority:** HIGH
**Time:** 15 minutes
**Datei:** `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

**Problem:**
Language und Dark Mode Switcher sind im Footer versteckt, nicht im Header.

**Lösung:**
Aktiviere Switcher im Header für bessere Zugänglichkeit.

**Schritte:**

1. Öffne `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

2. Finde den `header` Block

3. Ändere die Werte:

```typescript
{
  header: {
    style: "simple",
    withLogo: true,
    withSignInAndSignUp: true,
    withDarkModeToggle: true,     // ÄNDERN: false → true
    withLanguageSelector: true,    // ÄNDERN: false → true
    withThemeSelector: false,      // Bleibt false
    links: [],
  },
}
```

4. Speichern

**Testing:**
- [ ] Header zeigt Logo (links)
- [ ] Header zeigt Language Selector (z.B. DE/EN)
- [ ] Header zeigt Dark Mode Toggle (🌙 Icon)
- [ ] Header zeigt "Anmelden" + "Registrieren" Buttons (rechts)
- [ ] Layout: Elemente sind nicht überlappend

**Expected Result:**
```
[Logo]          [Language DE/EN] [🌙] [Anmelden] [Registrieren]
```

**Note:**
Die Position der Switcher wird automatisch von `HeaderVariantSimple.tsx` gehandhabt (Zeile 137-139 in der bestehenden Implementierung).

---

### 🔴 Task 1.3: Farbpalette erweitern

**Priority:** HIGH
**Time:** 30 minutes
**Datei:** `tailwind.config.ts`

**Problem:**
Nur Electric Blue als Akzentfarbe. Benötigen Grün (Erfolg) + Orange (Energie) für Feature-Differenzierung.

**Lösung:**
Erweitere `blueprint.accent` mit Secondary (Grün) und Tertiary (Orange) Farben.

**Schritte:**

1. Öffne `tailwind.config.ts`

2. Finde das `blueprint` Farbschema

3. Erweitere `blueprint.accent` mit neuen Farben:

```typescript
blueprint: {
  bg: {
    base: '#0f172a',      // Behalten
    elevated: '#1e293b',  // Behalten
    card: '#334155',      // Behalten
  },
  accent: {
    // PRIMARY: Electric Blue (Behalten)
    DEFAULT: '#3b82f6',
    hover: '#60a5fa',
    glow: 'rgba(59, 130, 246, 0.2)',
    glowStrong: 'rgba(59, 130, 246, 0.4)', // NEU

    // SECONDARY: Emerald Green (NEU)
    secondary: '#10b981',
    secondaryHover: '#34d399',
    secondaryGlow: 'rgba(16, 185, 129, 0.2)',

    // TERTIARY: Amber Orange (NEU)
    tertiary: '#f59e0b',
    tertiaryHover: '#fbbf24',
    tertiaryGlow: 'rgba(245, 158, 11, 0.2)',
  },
  text: {
    primary: '#f8fafc',   // Behalten
    secondary: '#cbd5e1', // Behalten
    muted: '#64748b',     // Behalten
    contrast: '#ffffff',   // NEU: Für maximale Lesbarkeit
  },
  border: {
    DEFAULT: '#334155',   // Behalten
    subtle: '#1e293b',    // Behalten
    glow: 'rgba(59, 130, 246, 0.3)', // NEU
  },
  glass: { // NEU: Glassmorphism-Werte
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.15)',
    border: 'rgba(255, 255, 255, 0.2)',
  },
}
```

4. Speichern

**Testing:**
- [ ] `npm run dev` startet ohne Fehler
- [ ] Tailwind kompiliert erfolgreich
- [ ] Neue Farben sind verfügbar (Test mit `className="bg-blueprint-accent-secondary"` irgendwo)

**Expected Result:**
Erweiterte Farbpalette ist verfügbar:
- `text-blueprint-accent-secondary` (Grün)
- `bg-blueprint-accent-tertiary` (Orange)
- `shadow-blueprint-accent-glow` (Glow-Effekt)
- `bg-blueprint-glass-medium` (Glassmorphism)

---

### 🟡 Task 1.4: Typografie-Klassen hinzufügen

**Priority:** MEDIUM
**Time:** 30 minutes
**Datei:** `app/globals.css`

**Problem:**
Keine wiederverwendbaren Typografie-Klassen für Hero/Features. Inkonsistente Font-Sizes.

**Lösung:**
Utility-Klassen für Hero-Headlines, Feature-Headlines, Body-Text.

**Schritte:**

1. Öffne `app/globals.css`

2. Am Ende der Datei (nach bestehenden Styles), füge hinzu:

```css
@layer utilities {
  /* === HERO TYPOGRAPHY === */
  .text-hero-headline {
    font-family: 'Manrope', var(--font-headline), system-ui, sans-serif;
    font-size: 3.75rem; /* 60px Desktop */
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: theme('colors.blueprint.text.primary');
  }

  .text-hero-subheadline {
    font-family: 'Manrope', var(--font-headline), system-ui, sans-serif;
    font-size: 1.5rem; /* 24px */
    font-weight: 600;
    line-height: 1.4;
    color: theme('colors.blueprint.accent.DEFAULT');
  }

  /* === FEATURE TYPOGRAPHY === */
  .text-feature-headline {
    font-family: 'Manrope', var(--font-headline), system-ui, sans-serif;
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
      font-size: 2.25rem; /* 36px Tablet */
    }
    .text-hero-subheadline {
      font-size: 1.25rem; /* 20px Tablet */
    }
    .text-feature-headline {
      font-size: 1.5rem; /* 24px Tablet */
    }
  }

  @media (max-width: 480px) {
    .text-hero-headline {
      font-size: 2rem; /* 32px Mobile */
    }
  }
}
```

3. Speichern

**Testing:**
- [ ] CSS kompiliert ohne Fehler
- [ ] Klassen können verwendet werden: `<h1 className="text-hero-headline">Test</h1>`
- [ ] Font-Sizes passen sich auf Mobile an

**Expected Result:**
Wiederverwendbare Typografie-Klassen sind verfügbar und responsive.

---

### 🔴 Task 1.5: Glassmorphism-Utilities erstellen

**Priority:** HIGH
**Time:** 45 minutes
**Datei:** `app/globals.css`

**Problem:**
Keine wiederverwendbaren Glassmorphism-Effekte für Cards.

**Lösung:**
Component-Klassen für Glass-Cards mit Hover-Effekten.

**Schritte:**

1. Öffne `app/globals.css`

2. Nach den Typography-Utilities (Task 1.4), füge hinzu:

```css
@layer components {
  /* === GLASSMORPHISM BASE === */
  .glass-card {
    background: theme('colors.blueprint.glass.medium');
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px); /* Safari Support */
    border: 1px solid theme('colors.blueprint.glass.border');
    border-radius: 1rem; /* 16px */
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

3. Speichern

**Testing:**
- [ ] CSS kompiliert ohne Fehler
- [ ] Test in Browser: Erstelle temporär ein Element mit `className="glass-card p-8"`
- [ ] Glassmorphism-Effekt ist sichtbar (Blur + Semi-Transparent)
- [ ] Hover-Effekt funktioniert (mit `glass-card-hover`)

**Expected Result:**
Wiederverwendbare Glassmorphism-Klassen:
- `.glass-card` - Standard Glassmorphism
- `.glass-card-strong` - Stärkerer Effekt
- `.glass-card-hover` - Mit Hover-Animation
- `.glow-blue/green/orange` - Farbige Glow-Effekte

---

### 🟡 Task 1.6: Animation Keyframes hinzufügen

**Priority:** MEDIUM
**Time:** 30 minutes
**Dateien:** `tailwind.config.ts` + `app/globals.css`

**Problem:**
Keine Animationen für Hero-Visualisierung und CTA-Buttons.

**Lösung:**
Floating-Animation für Hero + Glow-Pulse für Buttons.

**Schritte:**

**A) Tailwind Config erweitern:**

1. Öffne `tailwind.config.ts`

2. Im `theme.extend` Bereich, füge hinzu (oder erweitere bestehende `animation`/`keyframes`):

```typescript
theme: {
  extend: {
    // ... bestehende Konfiguration ...

    keyframes: {
      // Floating Animation für Hero Visual
      float: {
        '0%, 100%': { transform: 'translateY(0px)' },
        '50%': { transform: 'translateY(-20px)' },
      },
      // Glow Pulse für CTA Buttons
      'glow-pulse': {
        '0%, 100%': {
          boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
        },
        '50%': {
          boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 60px rgba(59, 130, 246, 0.4)'
        },
      },
      // Slow Pulse für Background Orbs
      'pulse-slow': {
        '0%, 100%': {
          opacity: '0.1'
        },
        '50%': {
          opacity: '0.2'
        },
      },
    },
    animation: {
      float: 'float 6s ease-in-out infinite',
      'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
  },
}
```

3. Speichern

**B) Test-Komponente (Optional, zum Testen):**

Erstelle temporär irgendwo ein Element:
```tsx
<div className="w-32 h-32 bg-blue-500 animate-float">Float Test</div>
<button className="bg-blue-500 px-4 py-2 animate-glow-pulse">Glow Test</button>
```

**Testing:**
- [ ] Tailwind kompiliert ohne Fehler
- [ ] `animate-float` funktioniert (Element bewegt sich sanft auf und ab)
- [ ] `animate-glow-pulse` funktioniert (Glow pulsiert)
- [ ] `animate-pulse-slow` funktioniert (Langsames Pulsieren)

**Expected Result:**
3 neue Animationen verfügbar:
- `animate-float` - Für Hero-Visual
- `animate-glow-pulse` - Für CTA-Buttons
- `animate-pulse-slow` - Für Background-Orbs

---

## SPRINT 1 ABSCHLUSS

**Nach Abschluss aller Tasks:**

1. **Testing Checklist:**
   - [ ] Footer ist minimal (nur Slogan + 2 Links)
   - [ ] Header zeigt Switcher (Language + Dark Mode)
   - [ ] Neue Farben funktionieren (`bg-blueprint-accent-secondary`)
   - [ ] Typografie-Klassen funktionieren (`.text-hero-headline`)
   - [ ] Glassmorphism-Klassen funktionieren (`.glass-card`)
   - [ ] Animationen funktionieren (`animate-float`, `animate-glow-pulse`)

2. **Git Commit:**
   ```bash
   git add .
   git commit -m "Sprint 1: Foundation - Footer cleanup, Header switchers, Extended design system (colors, typography, glassmorphism, animations)"
   ```

3. **Rückmeldung an UX Designer:**
   "Sprint 1 abgeschlossen. Foundation ist gelegt:
   - Footer bereinigt ✅
   - Header mit Switchers ✅
   - Erweiterte Farbpalette (Grün, Orange) ✅
   - Typografie-System ✅
   - Glassmorphism-Utilities ✅
   - Animationen (Float, Glow-Pulse) ✅

   Bereit für Sprint 2 (Hero Transformation)."

---

## SPRINT 2: HERO TRANSFORMATION

**Ziel:** Hero wird zum visuellen "Wow"-Moment
**Geschätzte Zeit:** 6-8 Stunden
**Deliverable:** Zweispaltiger Hero mit Glassmorphism, Animationen, CTAs

---

### 🟡 Task 2.1: GridBackground Component erstellen

**Priority:** MEDIUM
**Time:** 1 hour
**Datei:** `app/components/ui/backgrounds/GridBackground.tsx` (NEU)

**Problem:**
Hero braucht animierten Hintergrund (Grid + Glow Orbs) für "Premium"-Gefühl.

**Lösung:**
Wiederverwendbare Background-Komponente mit Grid-Pattern + animierten Orbs.

**Schritte:**

1. Erstelle Verzeichnis (falls nicht vorhanden):
   ```bash
   mkdir -p app/components/ui/backgrounds
   ```

2. Erstelle Datei: `app/components/ui/backgrounds/GridBackground.tsx`

3. Code einfügen:

```tsx
export default function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Base Gradient Background */}
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

      {/* Animated Glow Orb 1 (Blue) */}
      <div
        className="absolute left-1/4 top-1/3 h-96 w-96 rounded-full bg-blueprint-accent opacity-10 blur-3xl animate-pulse-slow"
      />

      {/* Animated Glow Orb 2 (Green) */}
      <div
        className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-blueprint-accent-secondary opacity-10 blur-3xl animate-pulse-slow"
        style={{ animationDelay: '2s' }}
      />
    </div>
  );
}
```

4. Speichern

**Testing:**
- [ ] Datei kompiliert ohne TypeScript-Fehler
- [ ] Importiere in Hero-Component (später) und teste visuell
- [ ] Grid-Pattern ist sichtbar (subtil)
- [ ] Glow Orbs pulsieren langsam

**Expected Result:**
Wiederverwendbare Background-Komponente für Hero (und ggf. andere Sections).

---

### 🔴 Task 2.2: ScrollReveal Component erstellen

**Priority:** HIGH
**Time:** 45 minutes
**Datei:** `app/components/ui/animations/ScrollReveal.tsx` (NEU)

**Problem:**
Features und Sections sollen beim Scrollen sanft einfaden (Scroll-Reveal Animation).

**Lösung:**
Wiederverwendbarer Wrapper mit Framer Motion `useInView` Hook.

**Schritte:**

1. **Dependency Check:**
   Prüfe ob Framer Motion installiert ist:
   ```bash
   npm list framer-motion
   ```
   Falls NICHT installiert:
   ```bash
   npm install framer-motion
   ```

2. Erstelle Verzeichnis:
   ```bash
   mkdir -p app/components/ui/animations
   ```

3. Erstelle Datei: `app/components/ui/animations/ScrollReveal.tsx`

4. Code einfügen:

```tsx
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, // Animation nur einmal abspielen
    margin: "-100px", // Trigger 100px bevor Element sichtbar
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
```

5. Speichern

**Testing:**
- [ ] TypeScript kompiliert ohne Fehler
- [ ] Test: Importiere in beliebiger Komponente:
  ```tsx
  import ScrollReveal from "~/components/ui/animations/ScrollReveal";

  <ScrollReveal delay={0.2}>
    <div className="p-8 bg-blue-500">Test Content</div>
  </ScrollReveal>
  ```
- [ ] Beim Scrollen: Element fadet ein und bewegt sich nach oben

**Expected Result:**
Wiederverwendbarer Scroll-Reveal Wrapper für alle Sections/Features.

---

### 🔴 Task 2.3: Hero Type Definition erweitern

**Priority:** HIGH
**Time:** 30 minutes
**Datei:** `app/modules/pageBlocks/components/blocks/marketing/hero/HeroBlockUtils.ts`

**Problem:**
Hero-Type unterstützt vermutlich noch nicht `topText`, `subheadline`, `image`, `cta`.

**Lösung:**
Type Definition erweitern.

**Schritte:**

1. Öffne `app/modules/pageBlocks/components/blocks/marketing/hero/HeroBlockUtils.ts`

2. Finde `HeroBlockDto` Interface (oder ähnlich benanntes Type)

3. Erweitere mit neuen Properties:

```typescript
export interface HeroBlockDto {
  style: string;

  // Bestehende Properties (behalten):
  headline?: string;
  description?: string;

  // NEU hinzufügen:
  topText?: string;        // Kleiner Text über Headline
  subheadline?: string;    // Zweite Headline unter Hauptheadline
  image?: {                // Hero Visual (rechts)
    src: string;
    alt: string;
    position?: "left" | "right";
  };
  cta?: Array<{           // Call-to-Action Buttons
    text: string;
    href: string;
    variant?: "primary" | "secondary";
    isPrimary?: boolean; // Legacy Support
  }>;

  // ... rest der bestehenden Properties
}
```

4. Speichern

**Testing:**
- [ ] TypeScript kompiliert ohne Fehler
- [ ] Keine Type-Errors in Hero-Komponenten

**Expected Result:**
Hero-Type unterstützt alle benötigten Properties für Meisterwerk-Hero.

---

### 🔴 Task 2.4: HeroVariantSimple erweitern ODER HeroVariantMeisterwerk erstellen

**Priority:** HIGH
**Time:** 3 hours
**Datei:** Option A: `app/modules/pageBlocks/components/blocks/marketing/hero/HeroVariantSimple.tsx` (ERWEITERN)
**Datei:** Option B: `app/modules/pageBlocks/components/blocks/marketing/hero/HeroVariantMeisterwerk.tsx` (NEU ERSTELLEN)

**Empfehlung:** Option B (Neue Komponente) - cleaner, keine Regression-Risiken

**Problem:**
Aktuelle Hero ist einspaltig, textlastig, ohne Visualisierung und CTAs.

**Lösung:**
Neue Hero-Variante: Zweispaltig, mit Dashboard-Mockup, Glassmorphism, Animationen.

**Schritte:**

1. Erstelle neue Datei: `app/modules/pageBlocks/components/blocks/marketing/hero/HeroVariantMeisterwerk.tsx`

2. Code einfügen:

```tsx
import { motion } from "framer-motion";
import GridBackground from "~/components/ui/backgrounds/GridBackground";
import ButtonEvent from "~/components/ui/buttons/ButtonEvent";
import type { HeroBlockDto } from "./HeroBlockUtils";

interface Props {
  item: HeroBlockDto;
}

export default function HeroVariantMeisterwerk({ item }: Props) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
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
                {item.cta.map((button, idx) => {
                  const isPrimary = button.variant === "primary" || button.isPrimary;
                  return (
                    <ButtonEvent
                      key={idx}
                      to={button.href}
                      className={
                        isPrimary
                          ? "rounded-lg bg-blueprint-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blueprint-accent-hover animate-glow-pulse"
                          : "rounded-lg border-2 border-blueprint-accent px-8 py-4 text-lg font-semibold text-blueprint-accent backdrop-blur-sm transition hover:bg-blueprint-accent/10"
                      }
                      event={{
                        action: "click",
                        category: "hero",
                        label: button.text,
                        value: button.href,
                      }}
                    >
                      {button.text}
                    </ButtonEvent>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* RIGHT: Dashboard Mockup / Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="glass-card-strong glow-blue-strong p-6 animate-float">
              {/* Dashboard Mockup */}
              <div className="aspect-[16/10] rounded-lg bg-gradient-to-br from-blueprint-bg-elevated to-blueprint-bg-card overflow-hidden">
                {item.image?.src ? (
                  <img
                    src={item.image.src}
                    alt={item.image.alt || "Dashboard Preview"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // Fallback: Gradient Placeholder mit Icon
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-32 h-32 text-blueprint-accent opacity-30"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative Glow Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blueprint-accent-secondary opacity-20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blueprint-accent-tertiary opacity-20 rounded-full blur-2xl pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
```

3. Registriere die neue Variante in Hero-Block-Handler:

Öffne `app/modules/pageBlocks/components/blocks/marketing/hero/HeroBlock.tsx` (oder ähnliche Datei)

Füge Import hinzu:
```tsx
import HeroVariantMeisterwerk from "./HeroVariantMeisterwerk";
```

Füge Case hinzu (vermutlich in einem Switch/If):
```tsx
// Im Rendering-Logic:
if (item.style === "meisterwerk") {
  return <HeroVariantMeisterwerk item={item} />;
}
```

4. Speichern

**Testing:**
- [ ] Component kompiliert ohne TypeScript-Fehler
- [ ] Framer Motion Imports funktionieren
- [ ] Layout ist zweispaltig auf Desktop
- [ ] Layout ist einspaltig auf Mobile (Text oben, Visual unten)
- [ ] Animationen funktionieren (Fade-in von links/rechts)
- [ ] Floating-Animation auf Visual funktioniert
- [ ] Glow-Pulse auf Primary CTA funktioniert
- [ ] Background-Grid ist sichtbar

**Expected Result:**
Vollständig transformierter Hero mit moderner UX.

---

### 🔴 Task 2.5: Hero-Content in defaultLandingPage.ts aktualisieren

**Priority:** HIGH
**Time:** 30 minutes
**Datei:** `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

**Problem:**
Hero-Content ist noch alt (kein topText, subheadline, CTAs).

**Lösung:**
Aktualisiere Hero-Block mit neuem Content.

**Schritte:**

1. Öffne `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

2. Finde den `hero` Block

3. Ersetze mit:

```typescript
{
  hero: {
    style: "meisterwerk", // NEUE VARIANTE (von Task 2.4)
    topText: "Die All-in-One Lösung für Handwerksbetriebe",
    headline: "Handwerk trifft Präzision.",
    subheadline: "Intelligente Automatisierung. Alles an einem Ort.",
    description: "Das CRM-System für Betriebe, die keine Kompromisse machen. Von der Kalkulation bis zur Abrechnung – meisterhaft digital.",
    image: {
      src: "/images/dashboard-mockup.png", // Asset noch zu erstellen (Task 2.6)
      alt: "Meisterwerk CRM Dashboard",
      position: "right",
    },
    cta: [
      {
        text: "Kostenlos testen",
        href: "/register",
        variant: "primary",
      },
      {
        text: "Mehr erfahren",
        href: "#features",
        variant: "secondary",
      },
    ],
  },
}
```

4. Speichern

**Testing:**
- [ ] Landing Page lädt ohne Fehler
- [ ] Hero zeigt alle Texte (topText, headline, subheadline, description)
- [ ] 2 CTAs sind sichtbar: "Kostenlos testen" (blau, glühend) + "Mehr erfahren" (ghost)
- [ ] Placeholder-Visual ist sichtbar (da Mockup noch fehlt)

**Expected Result:**
Hero-Content ist vollständig und nutzt neue Meisterwerk-Variante.

---

### 🟢 Task 2.6: Dashboard-Mockup Asset erstellen (OPTIONAL)

**Priority:** LOW (kann mit Placeholder starten)
**Time:** 2 hours
**Tool:** Figma, Sketch, oder Screenshot von echtem Dashboard

**Problem:**
Hero-Visual ist aktuell Placeholder (SVG Icon).

**Lösung:**
Erstelle stilisierten Dashboard-Screenshot.

**Schritte:**

**Option A: Echtes Dashboard screenshotten**
1. Logge dich in ALU-CRM ein
2. Navigiere zu schönstem Dashboard-View
3. Screenshot erstellen (High-Res)
4. In Bildbearbeitung:
   - Persönliche Daten unkenntlich machen
   - Leicht aufhellen (falls zu dunkel)
   - Exportieren als PNG: `public/images/dashboard-mockup.png`

**Option B: Figma Mockup erstellen**
1. Erstelle in Figma ein Dashboard-Layout (1600x1000px)
2. Nutze Blueprint-Farben (#0f172a, #3b82f6)
3. Füge Chart-Elemente, Karten, Tabellen hinzu (stilisiert)
4. Exportieren als PNG: `public/images/dashboard-mockup.png`

**Option C: Placeholder behalten (für jetzt)**
Überspringe diesen Task, benutze den SVG-Placeholder aus Task 2.4.

**Testing:**
- [ ] Bild ist hochauflösend (mindestens 1600px Breite)
- [ ] Bild lädt schnell (< 300KB)
- [ ] Bild passt farblich zur Blueprint-Palette
- [ ] Persönliche Daten sind entfernt

**Expected Result:**
Realistisches Dashboard-Mockup im Hero.

---

## SPRINT 2 ABSCHLUSS

**Nach Abschluss aller Tasks:**

1. **Testing Checklist:**
   - [ ] GridBackground Component funktioniert
   - [ ] ScrollReveal Component funktioniert
   - [ ] HeroVariantMeisterwerk rendert korrekt
   - [ ] Hero ist zweispaltig (Desktop) und einspaltig (Mobile)
   - [ ] Animationen funktionieren (Fade-in, Float, Glow-Pulse)
   - [ ] CTAs sind klickbar und führen zu richtigen URLs
   - [ ] Background-Grid ist subtil sichtbar
   - [ ] Responsive: Hero funktioniert auf 375px, 768px, 1280px

2. **Git Commit:**
   ```bash
   git add .
   git commit -m "Sprint 2: Hero Transformation - Zweispaltiges Layout, Glassmorphism, Animationen, CTAs"
   ```

3. **Rückmeldung an UX Designer:**
   "Sprint 2 abgeschlossen. Hero ist transformiert:
   - GridBackground mit animierten Orbs ✅
   - ScrollReveal Component ✅
   - HeroVariantMeisterwerk (zweispaltig) ✅
   - Neue Hero-Content (topText, subheadline, CTAs) ✅
   - Floating + Glow-Pulse Animationen ✅
   - Glassmorphism auf Dashboard-Visual ✅

   [Optional: Dashboard-Mockup noch Placeholder]

   Bereit für Sprint 3 (Feature Enhancement)."

---

## SPRINT 3: FEATURE ENHANCEMENT

**Ziel:** Features werden visuell beeindruckend und interaktiv
**Geschätzte Zeit:** 8-10 Stunden
**Deliverable:** 3 große Feature-Sections mit alternierendem Layout

---

### 🔴 Task 3.1: Feature Type Definition erweitern

**Priority:** HIGH
**Time:** 30 minutes
**Datei:** Suche nach Feature-Type-Definition (vermutlich `app/modules/pageBlocks/components/blocks/marketing/features/FeaturesBlockUtils.ts` oder ähnlich)

**Problem:**
Feature-Type unterstützt vermutlich noch nicht `accentColor`, `image`, `link`.

**Lösung:**
Type Definition erweitern.

**Schritte:**

1. Finde Feature-Type-Definition (nutze Grep/Search):
   ```bash
   grep -r "FeaturesBlockDto\|FeatureBlockDto" app/modules/pageBlocks/
   ```

2. Öffne die Datei mit der Type-Definition

3. Erweitere Feature-Item Type:

```typescript
export interface FeatureItem {
  name: string;
  description: string;
  icon?: string; // SVG als String (bestehend)

  // NEU hinzufügen:
  accentColor?: "primary" | "secondary" | "tertiary"; // Farb-Akzent
  image?: {                                            // Visualisierung
    type?: "illustration" | "mockup";
    src: string;
    alt: string;
  };
  link?: {                                             // "Mehr erfahren" Link
    text: string;
    href: string;
  };

  // ... rest
}

export interface FeaturesBlockDto {
  style: string;
  headline?: string;
  subheadline?: string;
  items: FeatureItem[];

  // Bestehende Properties beibehalten...
}
```

4. Speichern

**Testing:**
- [ ] TypeScript kompiliert ohne Fehler
- [ ] Keine Type-Errors in Feature-Komponenten

**Expected Result:**
Feature-Type unterstützt alle benötigten Properties.

---

### 🔴 Task 3.2: FeaturesVariantAlternating Component erstellen

**Priority:** HIGH
**Time:** 4 hours
**Datei:** `app/modules/pageBlocks/components/blocks/marketing/features/FeaturesVariantAlternating.tsx` (NEU)

**Problem:**
Aktuelle Features sind 3 Karten nebeneinander, statisch, ohne Visuals.

**Lösung:**
Neue Variante: Abwechselndes Bild-Text Layout, Glassmorphism, Hover-Effekte.

**Schritte:**

1. Erstelle Datei: `app/modules/pageBlocks/components/blocks/marketing/features/FeaturesVariantAlternating.tsx`

2. Code einfügen:

```tsx
import { motion } from "framer-motion";
import ScrollReveal from "~/components/ui/animations/ScrollReveal";
import ButtonEvent from "~/components/ui/buttons/ButtonEvent";
import type { FeaturesBlockDto, FeatureItem } from "./FeaturesBlockUtils";

interface Props {
  item: FeaturesBlockDto;
}

// Akzentfarben-Mapping
const accentClasses = {
  primary: {
    icon: "text-blueprint-accent",
    border: "border-blueprint-accent/30",
    glow: "hover:shadow-[0_20px_60px_rgba(59,130,246,0.3)]",
  },
  secondary: {
    icon: "text-blueprint-accent-secondary",
    border: "border-blueprint-accent-secondary/30",
    glow: "hover:shadow-[0_20px_60px_rgba(16,185,129,0.3)]",
  },
  tertiary: {
    icon: "text-blueprint-accent-tertiary",
    border: "border-blueprint-accent-tertiary/30",
    glow: "hover:shadow-[0_20px_60px_rgba(245,158,11,0.3)]",
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
              <h2 className="text-4xl font-bold text-blueprint-text-primary lg:text-5xl">
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
          const accent = accentClasses[feature.accentColor || "primary"];

          return (
            <ScrollReveal key={index} delay={index * 0.1}>
              <div
                className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center`}
              >
                {/* Text Content */}
                <div
                  className={`${
                    isEven ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  {/* Icon */}
                  {feature.icon && (
                    <div
                      className={`inline-flex mb-6 p-3 rounded-xl glass-card ${accent.icon} transition-transform duration-300 hover:scale-110`}
                      dangerouslySetInnerHTML={{ __html: feature.icon }}
                    />
                  )}

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
                      className="inline-flex items-center gap-2 text-blueprint-accent font-semibold hover:gap-3 transition-all"
                      event={{
                        action: "click",
                        category: "features",
                        label: feature.name,
                      }}
                    >
                      {feature.link.text}
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </ButtonEvent>
                  )}
                </div>

                {/* Image/Illustration */}
                <div
                  className={`${
                    isEven ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`glass-card-hover p-8 ${accent.border} ${accent.glow}`}
                  >
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-blueprint-bg-elevated">
                      {feature.image?.src ? (
                        <img
                          src={feature.image.src}
                          alt={feature.image.alt}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        // Fallback: Icon Placeholder
                        <div className="w-full h-full flex items-center justify-center">
                          <div
                            className={`w-32 h-32 ${accent.icon} opacity-20`}
                            dangerouslySetInnerHTML={{
                              __html:
                                feature.icon ||
                                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>',
                            }}
                          />
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

3. Registriere neue Variante:

Öffne `app/modules/pageBlocks/components/blocks/marketing/features/FeaturesBlock.tsx` (oder ähnlich)

Import hinzufügen:
```tsx
import FeaturesVariantAlternating from "./FeaturesVariantAlternating";
```

Case hinzufügen:
```tsx
if (item.style === "alternating") {
  return <FeaturesVariantAlternating item={item} />;
}
```

4. Speichern

**Testing:**
- [ ] Component kompiliert ohne Errors
- [ ] Layout alterniert (Feature 1: Text links, Bild rechts / Feature 2: Text rechts, Bild links)
- [ ] Glassmorphism-Hover-Effekt funktioniert
- [ ] Icons haben korrekte Akzentfarben (Blau, Grün, Orange)
- [ ] ScrollReveal-Animation funktioniert
- [ ] Responsive: Auf Mobile stapeln (Text oben, Bild unten)

**Expected Result:**
Moderne Feature-Section mit alternierend

em Layout.

---

### 🔴 Task 3.3: Feature-Content in defaultLandingPage.ts aktualisieren

**Priority:** HIGH
**Time:** 1 hour
**Datei:** `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

**Problem:**
Feature-Content ist noch alt (3 einfache Karten).

**Lösung:**
Aktualisiere mit neuen Texten, Akzentfarben, Links.

**Schritte:**

1. Öffne `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

2. Finde den `features` Block

3. Ersetze mit:

```typescript
{
  features: {
    style: "alternating", // NEUE VARIANTE
    headline: "Alles, was Ihr Betrieb braucht",
    subheadline: "Drei Säulen für digitale Exzellenz",
    items: [
      // FEATURE 1: Angebotswesen (Orange)
      {
        name: "Angebote in Minuten, nicht Stunden",
        description: "Ihre Materialien, Ihre Kalkulationslogik, Ihre Marge – Meisterwerk erledigt den Rest. Professionelle Angebote ohne Fehler, ohne Nachbesserungen.",
        accentColor: "tertiary", // Orange
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>`,
        image: {
          type: "illustration",
          src: "/images/features/angebotswesen.svg", // Asset zu erstellen (Task 3.4)
          alt: "Automatisiertes Angebotswesen - Workflow Visualisierung",
        },
        link: {
          text: "Mehr erfahren",
          href: "/features/angebote",
        },
      },

      // FEATURE 2: Mobiles Cockpit (Blau)
      {
        name: "Ihre Projekte, überall verfügbar",
        description: "Von der Angebotsphase bis zur Schlussabrechnung – alle Baustellen im Blick. Desktop, Tablet, Smartphone. Ihre Daten immer griffbereit.",
        accentColor: "primary", // Blau
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>`,
        image: {
          type: "mockup",
          src: "/images/features/mobile-cockpit.png", // Asset zu erstellen
          alt: "Mobiles Projekt-Cockpit auf verschiedenen Geräten",
        },
        link: {
          text: "Mehr erfahren",
          href: "/features/mobile",
        },
      },

      // FEATURE 3: Automatisierung (Grün)
      {
        name: "Kundenbeziehungen, die sich selbst pflegen",
        description: "Automatische Follow-ups, Wartungserinnerungen, persönliche Anlässe. Ihre Kunden fühlen sich wertgeschätzt – ohne dass Sie daran denken müssen.",
        accentColor: "secondary", // Grün
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>`,
        image: {
          type: "illustration",
          src: "/images/features/automatisierung.svg", // Asset zu erstellen
          alt: "Automatisierte Kundenkommunikation Timeline",
        },
        link: {
          text: "Mehr erfahren",
          href: "/features/crm",
        },
      },
    ],
  },
}
```

4. Speichern

**Testing:**
- [ ] Landing Page lädt ohne Fehler
- [ ] 3 Features werden gerendert
- [ ] Features haben korrekte Akzentfarben (Orange, Blau, Grün)
- [ ] Layout alterniert (Feature 1 & 3: gleiche Richtung, Feature 2: umgekehrt)
- [ ] Placeholder-Bilder sind sichtbar (da Assets noch fehlen)

**Expected Result:**
Feature-Content ist vollständig und nutzt neue Alternating-Variante.

---

### 🟢 Task 3.4: Feature Assets erstellen (OPTIONAL)

**Priority:** LOW (kann mit Placeholders starten)
**Time:** 3 hours
**Tool:** Figma, Illustrator, oder Stock-Assets + Anpassung

**Problem:**
Feature-Visuals sind aktuell Placeholders.

**Lösung:**
Erstelle 3 Assets (Illustrations/Mockups).

**Assets:**

**1. Angebotswesen (SVG Illustration)**
- Visualisierung: Flowchart Materialien → Kalkulation → Fertiges Angebot PDF
- Stil: Linien-Art, Blueprint-Farben (Orange Akzent)
- Format: SVG
- Speichern: `public/images/features/angebotswesen.svg`

**2. Mobile Cockpit (PNG Mockup)**
- Visualisierung: Smartphone + Tablet + Desktop mit CRM-Dashboard
- Stil: Realistische Geräte-Mockups (z.B. von mockuphone.com)
- Format: PNG
- Speichern: `public/images/features/mobile-cockpit.png`

**3. Automatisierung (SVG Illustration)**
- Visualisierung: Timeline mit E-Mail-Icons + automatischen Triggern
- Stil: Linien-Art, Blueprint-Farben (Grün Akzent)
- Format: SVG
- Speichern: `public/images/features/automatisierung.svg`

**Alternativen:**
- Nutze Placeholder-Dienste (z.B. https://undraw.co für Illustrations)
- Kaufe Stock-Assets (Freepik, Envato)
- Überspringe für jetzt, nutze Icon-Placeholders

**Testing:**
- [ ] Assets laden schnell (< 200KB pro Asset)
- [ ] Assets passen farblich zur Blueprint-Palette
- [ ] Assets sind auf Mobile gut sichtbar

**Expected Result:**
3 professionelle Feature-Visuals.

---

### 🟡 Task 3.5: Feature Card Hover-Optimierung

**Priority:** MEDIUM
**Time:** 1 hour
**Datei:** `app/modules/pageBlocks/components/blocks/marketing/features/FeaturesVariantAlternating.tsx`

**Problem:**
Hover-Effekte könnten noch optimiert werden (Icons animieren, Glow verstärken).

**Lösung:**
Erweitere Hover-Effekte für Premium-Feeling.

**Schritte:**

1. Öffne `FeaturesVariantAlternating.tsx`

2. Optimiere Icon-Hover:

Finde die Icon-Div und füge `group` Klasse zum Parent hinzu:

```tsx
<div className={`${isEven ? "lg:order-1" : "lg:order-2"} group`}>
  {/* Icon */}
  {feature.icon && (
    <div
      className={`inline-flex mb-6 p-3 rounded-xl glass-card ${accent.icon} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
      dangerouslySetInnerHTML={{ __html: feature.icon }}
    />
  )}
  {/* ... rest */}
</div>
```

3. Optimiere Card-Glow:

Im `motion.div` (Image-Wrapper), erweitere Hover-Klassen:

```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  className={`glass-card-hover p-8 ${accent.border} ${accent.glow} transition-all duration-300`}
>
  {/* ... */}
</motion.div>
```

4. Speichern

**Testing:**
- [ ] Icon rotiert und skaliert beim Text-Hover
- [ ] Card hebt sich beim Hover (translateY)
- [ ] Glow-Effekt wird stärker beim Hover
- [ ] Transitions sind smooth (nicht ruckelig)

**Expected Result:**
Subtile, professionelle Hover-Effekte die Interaktivität signalisieren.

---

## SPRINT 3 ABSCHLUSS

**Nach Abschluss aller Tasks:**

1. **Testing Checklist:**
   - [ ] FeaturesVariantAlternating rendert korrekt
   - [ ] 3 Features mit abwechselndem Layout
   - [ ] Akzentfarben sind korrekt (Orange, Blau, Grün)
   - [ ] Glassmorphism-Hover funktioniert
   - [ ] ScrollReveal-Animation funktioniert
   - [ ] Icons rotieren beim Hover
   - [ ] "Mehr erfahren" Links funktionieren
   - [ ] Responsive: Features stapeln auf Mobile

2. **Git Commit:**
   ```bash
   git add .
   git commit -m "Sprint 3: Feature Enhancement - Alternating layout, Glassmorphism cards, Hover effects, Color accents"
   ```

3. **Rückmeldung an UX Designer:**
   "Sprint 3 abgeschlossen. Features sind transformiert:
   - FeaturesVariantAlternating Component ✅
   - 3 Features mit alternierend em Layout ✅
   - Akzentfarben (Orange, Blau, Grün) ✅
   - Glassmorphism-Hover-Effekte ✅
   - Icon-Rotation beim Hover ✅
   - ScrollReveal-Animationen ✅

   [Optional: Feature-Assets noch Placeholders]

   Bereit für Sprint 4 (Polish & Optimization)."

---

## SPRINT 4: POLISH & OPTIMIZATION

**Ziel:** Production-ready, performant, accessible
**Geschätzte Zeit:** 4-6 Stunden
**Deliverable:** Getestete, optimierte Landing Page (Lighthouse > 90)

---

### 🟡 Task 4.1: Responsive Testing (Alle Breakpoints)

**Priority:** MEDIUM
**Time:** 1.5 hours

**Problem:**
Design muss auf allen Geräten perfekt funktionieren.

**Lösung:**
Systematisches Testing auf verschiedenen Breakpoints.

**Test-Sizes:**
- **Mobile Small:** 375px (iPhone SE)
- **Mobile Large:** 414px (iPhone Pro Max)
- **Tablet:** 768px (iPad)
- **Tablet Large:** 1024px (iPad Pro)
- **Desktop:** 1280px (Standard)
- **Desktop Large:** 1920px (Full HD)

**Testing Checklist:**

**Footer:**
- [ ] 375px: Slogan + Links sind lesbar, nicht überlappend
- [ ] 768px: Zentriert, ausreichend Padding
- [ ] 1920px: Nicht zu breit gespreizt

**Header:**
- [ ] 375px: Logo + Switcher + Buttons passen (ggf. Mobile-Menu nötig)
- [ ] 768px: Alle Elemente in einer Reihe
- [ ] 1920px: Elemente nicht zu weit auseinander

**Hero:**
- [ ] 375px: Text lesbar (36px Headline), CTAs stacken
- [ ] 768px: Immer noch einspaltig ODER beginnt zweispaltig
- [ ] 1024px+: Zweispaltig, Text links, Visual rechts
- [ ] 1920px: Max-Width constraint (7xl = 1280px), nicht zu breit

**Features:**
- [ ] 375px: Sections stapeln (Text oben, Bild unten)
- [ ] 1024px+: Side-by-side Layout, alternierend
- [ ] Bilder sind nicht verzerrt (aspect-ratio beibehalten)

**Fixes (falls nötig):**
- Füge `sm:`, `md:`, `lg:`, `xl:` Breakpoints hinzu
- Passe Font-Sizes an (nutze bestehende Responsive-Klassen aus Task 1.4)
- Justiere Padding/Margins

**Tools:**
- Chrome DevTools (Device Toolbar)
- Responsive Design Mode (Firefox)
- Oder: Echte Geräte

**Testing:**
- [ ] Alle Breakpoints getestet
- [ ] Keine horizontale Scrollbar
- [ ] Texte sind lesbar
- [ ] Buttons sind klickbar (nicht zu klein)

---

### 🔴 Task 4.2: Accessibility Audit (WCAG AA)

**Priority:** HIGH
**Time:** 1 hour

**Problem:**
Glassmorphism kann Kontrast reduzieren → Accessibility-Probleme.

**Lösung:**
Systematisches A11y-Testing + Fixes.

**Testing Checklist:**

**1. Kontrast-Verhältnis:**
- [ ] Hero Headline: Kontrast-Ratio > 3:1 (Large Text)
  - Tool: Chrome DevTools → Elements → Color Picker → Contrast Ratio
  - Falls zu niedrig: Nutze `text-blueprint-text-contrast` (#ffffff)

- [ ] Body Text auf Glass-Cards: Kontrast-Ratio > 4.5:1
  - Falls zu niedrig: Erhöhe `glass.medium` Opacity ODER nutze darkere Background

- [ ] CTA Buttons: Text-Kontrast > 4.5:1
  - Primary Button (Weiß auf Blau): Sollte passen ✅
  - Secondary Button (Blau Text): Prüfen

**2. Focus States:**
- [ ] Alle interaktiven Elemente (Buttons, Links) haben sichtbaren Focus Ring
  - Test: Tab-Navigation durchführen
  - Falls fehlt: Füge hinzu: `focus:ring-2 focus:ring-blueprint-accent focus:ring-offset-2`

**3. Keyboard Navigation:**
- [ ] Alle CTAs sind mit Tab erreichbar
- [ ] Kein Focus Trap
- [ ] Focus-Reihenfolge ist logisch (Header → Hero → Features → Footer)

**4. Alt-Texte:**
- [ ] Dashboard-Mockup hat beschreibenden Alt-Text ✅ (bereits in Task 2.5)
- [ ] Feature-Images haben Alt-Texte ✅ (bereits in Task 3.3)
- [ ] Decorative Icons haben `aria-hidden="true"` (SVG Icons in Features)

**5. Animationen:**
- [ ] Respektiere `prefers-reduced-motion`
  - Füge in `app/globals.css` hinzu:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```

**6. Semantic HTML:**
- [ ] Hero nutzt `<section>` ✅
- [ ] Headlines nutzen `<h1>`, `<h2>`, `<h3>` in korrekter Hierarchie ✅
- [ ] CTAs sind `<button>` oder `<a>` (nicht `<div onClick>`) ✅

**Tools:**
- Chrome Lighthouse (Accessibility Score)
- axe DevTools (Browser Extension)
- WAVE (Web Accessibility Evaluation Tool)

**Target:**
- [ ] Lighthouse Accessibility Score: > 95

---

### 🔴 Task 4.3: Performance Optimierung (Lighthouse > 90)

**Priority:** HIGH
**Time:** 1 hour

**Problem:**
Animationen, Glassmorphism, große Bilder können Performance beeinträchtigen.

**Lösung:**
Performance-Testing + Optimierungen.

**Testing:**

1. **Lighthouse Audit:**
   - Chrome DevTools → Lighthouse → Run Audit (Mobile + Desktop)
   - Target Scores:
     - Performance: > 90
     - Accessibility: > 95
     - Best Practices: > 90
     - SEO: > 90

2. **Performance-Optimierungen (falls Scores < 90):**

**A) Image Optimierung:**
- [ ] Dashboard-Mockup komprimieren (TinyPNG, Squoosh)
  - Target: < 300KB
  - Format: WebP bevorzugt (mit PNG Fallback)

- [ ] Feature-Assets komprimieren
  - SVGs: Nutze SVGO
  - PNGs: Komprimieren + WebP

- [ ] Lazy Loading:
  ```tsx
  <img src="..." alt="..." loading="lazy" />
  ```

**B) Glassmorphism Performance:**
- [ ] `backdrop-filter` nur auf sichtbaren Elementen (nicht auf versteckten)
- [ ] `will-change: transform` auf animierten Elementen (Hero-Visual):
  ```tsx
  <div className="animate-float" style={{ willChange: 'transform' }}>
  ```

**C) Animation Performance:**
- [ ] Animationen nutzen `transform` und `opacity` (GPU-accelerated) ✅
- [ ] Keine Animationen auf `width`, `height`, `top`, `left`

**D) CSS Optimierung:**
- [ ] Entferne unused CSS (Tailwind Purge sollte das automatisch machen)
- [ ] Prüfe: `tailwind.config.ts` hat `content: ['./app/**/*.{js,ts,jsx,tsx}']`

**E) JavaScript Optimierung:**
- [ ] Framer Motion ist Tree-Shaken (nur genutzte Components importieren)
- [ ] Code-Splitting ist aktiv (Remix macht das automatisch)

**Testing:**
- [ ] Lighthouse Performance Score > 90 (Mobile)
- [ ] Lighthouse Performance Score > 95 (Desktop)
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] FID (First Input Delay) < 100ms
- [ ] CLS (Cumulative Layout Shift) < 0.1

---

### 🟡 Task 4.4: Cross-Browser Testing

**Priority:** MEDIUM
**Time:** 1 hour

**Problem:**
Glassmorphism (`backdrop-filter`) wird nicht von allen Browsern gleich unterstützt.

**Lösung:**
Testing auf Chrome, Firefox, Safari + Fallbacks.

**Browser-Kompatibilität:**

**Chrome:** ✅ `backdrop-filter` vollständig unterstützt
**Firefox:** ✅ `backdrop-filter` vollständig unterstützt
**Safari:** ⚠️ `backdrop-filter` unterstützt, braucht `-webkit-backdrop-filter`

**Fallback für alte Browser:**

In `app/globals.css`, erweitere `.glass-card`:

```css
.glass-card {
  background: theme('colors.blueprint.glass.medium');
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */
  border: 1px solid theme('colors.blueprint.glass.border');
  border-radius: 1rem;

  /* Fallback für Browser ohne backdrop-filter Support */
  @supports not (backdrop-filter: blur(10px)) {
    background: theme('colors.blueprint.bg.elevated'); /* Solid Background */
  }
}
```

**Testing Checklist:**

**Chrome (Latest):**
- [ ] Hero rendert korrekt
- [ ] Glassmorphism funktioniert
- [ ] Animationen sind smooth
- [ ] Keine Console-Errors

**Firefox (Latest):**
- [ ] Hero rendert korrekt
- [ ] Glassmorphism funktioniert
- [ ] Animationen sind smooth
- [ ] Keine Console-Errors

**Safari (macOS/iOS):**
- [ ] Hero rendert korrekt
- [ ] Glassmorphism funktioniert (`-webkit-backdrop-filter`)
- [ ] Animationen sind smooth
- [ ] Keine Console-Errors

**Alte Browser (Optional):**
- [ ] Chrome 90 / Firefox 88: Fallback zu Solid Background funktioniert

**Tools:**
- BrowserStack (für umfangreiches Testing)
- Oder: Echte Geräte / VMs

---

### 🟢 Task 4.5: Trust/Social Proof Section (OPTIONAL)

**Priority:** LOW
**Time:** 2 hours
**Datei:** `app/modules/pageBlocks/components/blocks/marketing/trust/TrustLogos.tsx` (NEU)

**Problem:**
Landing Page fehlt Social Proof / Trust Signal.

**Lösung:**
Section mit Partner-Logos (Integrations).

**Schritte:**

**A) Component erstellen:**

1. Erstelle Verzeichnis:
   ```bash
   mkdir -p app/modules/pageBlocks/components/blocks/marketing/trust
   ```

2. Erstelle Datei: `TrustLogos.tsx`

3. Code einfügen:

```tsx
import ScrollReveal from "~/components/ui/animations/ScrollReveal";

interface Logo {
  name: string;
  src: string;
}

interface Props {
  item: {
    headline?: string;
    subheadline?: string;
    logos: Logo[];
  };
}

export default function TrustLogos({ item }: Props) {
  return (
    <section className="relative py-20 bg-blueprint-bg-base">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-12">
            {item.subheadline && (
              <p className="text-sm font-semibold uppercase tracking-wide text-blueprint-accent mb-4">
                {item.subheadline}
              </p>
            )}
            {item.headline && (
              <h2 className="text-3xl font-bold text-blueprint-text-primary lg:text-4xl">
                {item.headline}
              </h2>
            )}
          </div>
        </ScrollReveal>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
          {item.logos.map((logo, index) => (
            <ScrollReveal key={index} delay={index * 0.05}>
              <div className="flex items-center justify-center p-6 glass-card transition-all duration-300 hover:scale-105 grayscale hover:grayscale-0">
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**B) Content hinzufügen:**

In `defaultLandingPage.ts`, nach Features:

```typescript
{
  trust: {
    style: "logos",
    headline: "Integriert mit den Tools, die Sie bereits nutzen",
    subheadline: "Nahtlose Anbindung",
    logos: [
      { name: "Partner A", src: "/images/partners/partner-a.svg" },
      { name: "Partner B", src: "/images/partners/partner-b.svg" },
      { name: "Partner C", src: "/images/partners/partner-c.svg" },
      { name: "Partner D", src: "/images/partners/partner-d.svg" },
      // ... mehr Partner
    ],
  },
}
```

**C) Registrieren:**

Ähnlich wie bei Hero/Features, registriere in PageBlocks-Handler.

**Testing:**
- [ ] Logos rendernin Graustufen
- [ ] Beim Hover: Farbe erscheint + Scale
- [ ] Responsive: 2 Spalten (Mobile), 4 Spalten (Desktop)

**Expected Result:**
Trust-Signal durch bekannte Partner-Logos.

---

## SPRINT 4 ABSCHLUSS & FINALE

**Nach Abschluss aller Tasks:**

1. **Final Testing Checklist:**
   - [ ] Responsive: Alle Breakpoints funktionieren (375px - 1920px)
   - [ ] Accessibility: Lighthouse Score > 95
   - [ ] Performance: Lighthouse Score > 90 (Mobile + Desktop)
   - [ ] Cross-Browser: Chrome, Firefox, Safari ✅
   - [ ] Keine Console-Errors
   - [ ] Alle Links funktionieren
   - [ ] Alle Animationen sind smooth

2. **Git Commit:**
   ```bash
   git add .
   git commit -m "Sprint 4: Polish & Optimization - Responsive, A11y, Performance, Cross-browser compatibility"
   ```

3. **Final Rückmeldung an UX Designer:**
   "Sprint 4 abgeschlossen. Landing Page ist PRODUCTION-READY! ✅

   **Completed:**
   - Responsive Testing (375px - 1920px) ✅
   - Accessibility Audit (WCAG AA, Score > 95) ✅
   - Performance Optimierung (Lighthouse > 90) ✅
   - Cross-Browser Testing (Chrome, Firefox, Safari) ✅
   - [Optional: Trust/Social Proof Section ✅]

   **Final Scores:**
   - Lighthouse Performance: XX/100
   - Lighthouse Accessibility: XX/100
   - Lighthouse Best Practices: XX/100
   - Lighthouse SEO: XX/100

   **Ready for:**
   - Stakeholder Review
   - Production Deployment

   🎉 Meisterwerk Landing Page ist live-ready!"

---

## ZUSAMMENFASSUNG ALLER SPRINTS

| Sprint | Tasks | Status | Deliverable |
|--------|-------|--------|-------------|
| Sprint 1 | 6 Tasks | ✅ | Clean Footer/Header + Design Foundation |
| Sprint 2 | 6 Tasks | ✅ | Hero Transformation (Glassmorphism, Animationen) |
| Sprint 3 | 5 Tasks | ✅ | Feature Enhancement (Alternating Layout, Visuals) |
| Sprint 4 | 5 Tasks | ✅ | Polish & Optimization (Responsive, A11y, Perf) |

**Total Tasks:** 22
**Total Time:** 22-30 hours
**Status:** PRODUCTION-READY ✅

---

## ANHANG: TROUBLESHOOTING

### Problem: Framer Motion nicht installiert
**Lösung:**
```bash
npm install framer-motion
```

### Problem: Tailwind erkennt neue Farben nicht
**Lösung:**
1. Prüfe `tailwind.config.ts` Syntax
2. Restart Dev-Server: `npm run dev`
3. Leere Tailwind-Cache: `rm -rf .cache`

### Problem: Glassmorphism funktioniert nicht
**Lösung:**
1. Prüfe Browser-Support (Chrome/Firefox/Safari)
2. Prüfe ob `backdrop-filter` in CSS vorhanden
3. Prüfe ob Parent-Element `overflow: hidden` hat (blockiert Blur)

### Problem: Animationen sind ruckelig
**Lösung:**
1. Füge `will-change: transform` hinzu
2. Nutze nur `transform` und `opacity` (nicht `width`, `height`)
3. Reduziere Anzahl gleichzeitiger Animationen

### Problem: Lighthouse Performance < 90
**Lösung:**
1. Komprimiere Bilder (< 300KB pro Bild)
2. Aktiviere Lazy Loading: `<img loading="lazy" />`
3. Prüfe Framer Motion Tree-Shaking
4. Entferne unused CSS

### Problem: Accessibility Score < 95
**Lösung:**
1. Prüfe Kontrast-Verhältnis (Chrome DevTools)
2. Füge Focus States hinzu: `focus:ring-2`
3. Prüfe Alt-Texte auf allen Bildern
4. Aktiviere `prefers-reduced-motion`

---

**Version:** 2.0
**Status:** Ready for Implementation
**Let's build a Meisterwerk!** 🔨✨
