# Dev-Agent Instructions: Meisterwerk Landing Page Redesign

**Created:** 2025-11-16 13:26:21
**From:** UX Designer (Enhanced V3)
**To:** Developer Agent
**Project:** ALU-CRM Meisterwerk Landing Page

---

## SPRINT 1: FOUNDATION (QUICK WINS)

### Task 1.1: Footer Bereinigung
**Priority:** HIGH
**Estimated Time:** 30 minutes

**Datei:** `app/modules/pageBlocks/utils/defaultFooter.ts`

**Aufgabe:**
Reduziere den Footer auf das Minimum. Entferne alle überflüssigen Links und Social Media Icons.

**Schritte:**
1. Öffne `app/modules/pageBlocks/utils/defaultFooter.ts`
2. Ersetze den gesamten Return-Wert mit:

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
    socials: [], // Keine Social Media
  };
}
```

3. Speichern und testen

**Erwartetes Ergebnis:**
- Footer zeigt nur noch: Slogan + "Datenschutz" + "AGB" Links
- Keine Social Media Icons mehr
- Keine Language/Theme Switcher im Footer

---

### Task 1.2: Header Switcher aktivieren
**Priority:** HIGH
**Estimated Time:** 15 minutes

**Datei:** `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

**Aufgabe:**
Aktiviere Language und DarkMode Switcher im Header.

**Schritte:**
1. Öffne `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`
2. Im Header-Block, ändere:

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
},
```

3. Speichern und testen

**Erwartetes Ergebnis:**
- Header zeigt jetzt Language Selector und DarkMode Toggle
- Diese erscheinen zwischen den Links und den Login/Register Buttons

**Note:** Die Positionierung ist bereits in `HeaderVariantSimple.tsx` korrekt implementiert (Zeile 137-139).

---

### Task 1.3: Erweiterte Farbpalette
**Priority:** MEDIUM
**Estimated Zeit:** 20 minutes

**Datei:** `tailwind.config.ts`

**Aufgabe:**
Erweitere die blueprint-Farbpalette um zusätzliche Akzentfarben.

**Schritte:**
1. Öffne `tailwind.config.ts`
2. Im `blueprint.accent` Objekt, füge hinzu:

```typescript
blueprint: {
  bg: {
    base: '#0f172a',      // Behalten
    elevated: '#1e293b',  // Behalten
    card: '#334155',      // Behalten
  },
  accent: {
    DEFAULT: '#3b82f6',   // Behalten - Electric Blue
    hover: '#60a5fa',     // Behalten
    glow: 'rgba(59, 130, 246, 0.2)', // Behalten
    // NEU: Zusätzliche Akzentfarben
    secondary: '#10b981',   // Grün für "Erfolg/Automatisierung"
    secondaryHover: '#34d399', // Grün Hover
    secondaryGlow: 'rgba(16, 185, 129, 0.2)', // Grün Glow
    tertiary: '#f59e0b',    // Orange für "Energie/Projekte"
    tertiaryHover: '#fbbf24',  // Orange Hover
    tertiaryGlow: 'rgba(245, 158, 11, 0.2)', // Orange Glow
  },
  text: {
    primary: '#f8fafc',   // Behalten
    secondary: '#cbd5e1', // Behalten
    muted: '#64748b',     // Behalten
  },
  border: {
    DEFAULT: '#334155',   // Behalten
    subtle: '#1e293b',    // Behalten
  },
},
```

3. Speichern

**Erwartetes Ergebnis:**
- Neue Farben sind verfügbar: `bg-blueprint-accent-secondary`, `text-blueprint-accent-tertiary`, etc.
- Können ab jetzt in der Anwendung genutzt werden

---

### Task 1.4: Typografie-Klassen hinzufügen (Optional)
**Priority:** LOW
**Estimated Time:** 15 minutes

**Datei:** `app/globals.css`

**Aufgabe:**
Füge wiederverwendbare Typografie-Klassen hinzu.

**Schritte:**
1. Öffne `app/globals.css`
2. Am Ende der Datei, füge hinzu:

```css
@layer utilities {
  /* Hero Typography */
  .text-hero-headline {
    font-family: 'Manrope', var(--font-headline), system-ui, sans-serif;
    font-size: 3.75rem; /* 60px */
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  /* Feature Typography */
  .text-feature-headline {
    font-family: 'Manrope', var(--font-headline), system-ui, sans-serif;
    font-size: 1.5rem; /* 24px */
    font-weight: 700;
    line-height: 1.3;
  }

  /* Body Typography */
  .text-body-large {
    font-size: 1.125rem; /* 18px */
    line-height: 1.7;
  }

  /* Mobile Adjustments */
  @media (max-width: 768px) {
    .text-hero-headline {
      font-size: 2.5rem; /* 40px on mobile */
    }
  }
}
```

3. Speichern

**Erwartetes Ergebnis:**
- Klassen können verwendet werden: `className="text-hero-headline"`
- Konsistente Typografie über die ganze App

---

## SPRINT 2: HERO TRANSFORMATION

### Task 2.1: Hero-Text optimieren
**Priority:** HIGH
**Estimated Time:** 30 minutes

**Datei:** `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

**Aufgabe:**
Verbessere den Hero-Text und füge CTAs hinzu.

**Schritte:**
1. Öffne `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`
2. Ersetze den Hero-Block:

```typescript
{
  hero: {
    style: "simple",
    topText: "Die All-in-One Lösung für Handwerksbetriebe",
    headline: "Handwerk trifft Präzision.",
    subheadline: "Intelligente Automatisierung. Alles an einem Ort.",
    description: "Das CRM-System für Betriebe, die keine Kompromisse machen. Von der Kalkulation bis zur Abrechnung – meisterhaft digital.",
    cta: [
      {
        text: "Kostenlos testen",
        href: "/register",
        isPrimary: true,
      },
      {
        text: "Mehr erfahren",
        href: "#features",
        isPrimary: false,
      }
    ],
  },
},
```

3. Speichern und prüfen

**Erwartetes Ergebnis:**
- Hero zeigt: topText, headline, subheadline, description
- 2 CTAs: "Kostenlos testen" (primary) und "Mehr erfahren" (secondary)

**Note:** Check ob `HeroVariantSimple.tsx` diese Properties unterstützt. Falls nicht, siehe Task 2.2.

---

### Task 2.2: Hero-Komponente erweitern (falls nötig)
**Priority:** MEDIUM
**Estimated Time:** 1-2 hours

**Datei:** `app/modules/pageBlocks/components/blocks/marketing/hero/HeroVariantSimple.tsx`

**Aufgabe:**
Falls die Hero-Komponente `topText`, `subheadline` und `cta` noch nicht unterstützt, erweitere sie.

**Schritte:**
1. Öffne `HeroVariantSimple.tsx`
2. Prüfe ob folgende Properties vorhanden sind:
   - `item.topText`
   - `item.subheadline`
   - `item.cta` (array)

3. Falls nicht, erweitere die Komponente:

**a) Type Definition erweitern:**
Finde die Hero-Type-Definition (vermutlich in `HeroBlockUtils.ts`) und füge hinzu:
```typescript
export interface HeroBlockDto {
  style: string;
  topText?: string;        // NEU
  headline?: string;
  subheadline?: string;    // NEU
  description?: string;
  cta?: Array<{           // NEU
    text: string;
    href: string;
    isPrimary?: boolean;
  }>;
  // ... rest
}
```

**b) Komponente erweitern:**
In `HeroVariantSimple.tsx`, füge Rendering hinzu:

```tsx
return (
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="py-12 sm:py-20 lg:py-24">
      {/* Top Text */}
      {item.topText && (
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-blueprint-accent">
          {item.topText}
        </p>
      )}

      {/* Headline */}
      {item.headline && (
        <h1 className="mt-4 text-center text-hero-headline text-blueprint-text-primary">
          {item.headline}
        </h1>
      )}

      {/* Subheadline */}
      {item.subheadline && (
        <p className="mt-4 text-center text-2xl font-semibold text-blueprint-accent">
          {item.subheadline}
        </p>
      )}

      {/* Description */}
      {item.description && (
        <p className="mx-auto mt-6 max-w-3xl text-center text-body-large text-blueprint-text-secondary">
          {item.description}
        </p>
      )}

      {/* CTAs */}
      {item.cta && item.cta.length > 0 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          {item.cta.map((button, idx) => (
            <ButtonEvent
              key={idx}
              to={button.href}
              className={
                button.isPrimary
                  ? "rounded-lg bg-blueprint-accent px-8 py-3 text-lg font-semibold text-white shadow-lg shadow-blueprint-accent-glow transition hover:bg-blueprint-accent-hover hover:shadow-xl"
                  : "rounded-lg border-2 border-blueprint-accent px-8 py-3 text-lg font-semibold text-blueprint-accent transition hover:bg-blueprint-accent/10"
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
          ))}
        </div>
      )}
    </div>
  </div>
);
```

4. Speichern und testen

**Erwartetes Ergebnis:**
- Hero zeigt alle neuen Elemente
- CTAs sind styled mit Glow-Effekt
- Responsive Design funktioniert

---

### Task 2.3: Hero Glassmorphism Background (Optional Enhancement)
**Priority:** LOW
**Estimated Time:** 1 hour

**Aufgabe:**
Füge einen subtilen animierten Hintergrund zum Hero hinzu.

**Schritte:**
1. Erstelle `app/components/ui/backgrounds/GridBackground.tsx`:

```tsx
export default function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blueprint-bg-base via-blueprint-bg-elevated to-blueprint-bg-base" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Glow Orbs */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-blueprint-accent opacity-10 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-blueprint-accent-secondary opacity-10 blur-3xl" />
    </div>
  );
}
```

2. In `HeroVariantSimple.tsx`, importiere und verwende:

```tsx
import GridBackground from "~/components/ui/backgrounds/GridBackground";

return (
  <div className="relative">
    <GridBackground />
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* ... Hero Content ... */}
    </div>
  </div>
);
```

**Erwartetes Ergebnis:**
- Hero hat subtilen Grid-Hintergrund
- Glow-Effekte im Hintergrund
- Performance bleibt gut (keine heavy Animationen)

---

## SPRINT 3: FEATURE ENHANCEMENT

### Task 3.1: Feature-Text optimieren
**Priority:** HIGH
**Estimated Time:** 30 minutes

**Datei:** `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

**Aufgabe:**
Verbessere Feature-Texte und füge Farb-Akzente hinzu.

**Schritte:**
1. Öffne die Datei
2. Ersetze die Features:

```typescript
{
  layout: {
    padding: { y: "py-20" },
  },
  features: {
    style: "cards",
    headline: "Alles, was Ihr Betrieb braucht",
    subheadline: "Drei Säulen für digitale Exzellenz",
    grid: {
      columns: "3",
      gap: "lg",
    },
    items: [
      {
        name: "Angebote in Minuten, nicht Stunden",
        description: "Ihre Materialien, Ihre Kalkulationslogik, Ihre Marge – Meisterwerk erledigt den Rest. Professionelle Angebote ohne Fehler, ohne Nachbesserungen.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-blueprint-accent-tertiary">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
        </svg>`,
        link: undefined,
      },
      {
        name: "Ihre Projekte, überall verfügbar",
        description: "Von der Angebotsphase bis zur Schlussabrechnung – alle Baustellen im Blick. Desktop, Tablet, Smartphone. Ihre Daten immer griffbereit.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-blueprint-accent">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>`,
        link: undefined,
      },
      {
        name: "Kundenbeziehungen, die sich selbst pflegen",
        description: "Automatische Follow-ups, Wartungserinnerungen, persönliche Anlässe. Ihre Kunden fühlen sich wertgeschätzt – ohne dass Sie daran denken müssen.",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 text-blueprint-accent-secondary">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        </svg>`,
        link: undefined,
      },
    ],
  },
},
```

**Erwartetes Ergebnis:**
- Features haben jetzt Headlines und Subheadlines
- Icons haben Farb-Akzente (orange, blau, grün)
- Text ist optimiert

---

### Task 3.2: Feature Card Hover-Effekte hinzufügen (Optional)
**Priority:** MEDIUM
**Estimated Time:** 45 minutes

**Datei:** `app/modules/pageBlocks/components/blocks/marketing/features/FeaturesVariantCards.tsx` (oder ähnlich)

**Aufgabe:**
Füge Hover-Effekte zu Feature-Cards hinzu.

**Schritte:**
1. Finde die Feature Card Komponente
2. Füge folgende Klassen zur Card hinzu:

```tsx
<div className="group relative rounded-xl border border-blueprint-border bg-blueprint-bg-elevated/50 p-8 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-blueprint-accent/50 hover:bg-blueprint-bg-elevated hover:shadow-2xl hover:shadow-blueprint-accent-glow">
  {/* Card Content */}
</div>
```

3. Für Icons, füge Animation hinzu:

```tsx
<div className="mb-4 inline-block transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
  {/* Icon SVG */}
</div>
```

**Erwartetes Ergebnis:**
- Cards heben sich beim Hover
- Icons rotieren und skalieren leicht
- Glow-Effekt erscheint
- Smooth Transitions

---

## SPRINT 4: POLISH & OPTIMIZATION

### Task 4.1: Responsive Design Check
**Priority:** HIGH
**Estimated Time:** 1 hour

**Aufgabe:**
Teste alle Änderungen auf verschiedenen Bildschirmgrößen.

**Test-Sizes:**
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

**Prüfe:**
- [ ] Header: Switcher positioniert sich korrekt
- [ ] Hero: Text ist lesbar, CTAs sind clickable
- [ ] Features: Cards stapeln sich auf Mobile
- [ ] Footer: Links sind lesbar

**Fixes falls nötig:**
- Füge `sm:`, `md:`, `lg:` Breakpoints hinzu
- Passe Font-Sizes an
- Justiere Padding/Margins

---

### Task 4.2: Performance Check
**Priority:** MEDIUM
**Estimated Time:** 30 minutes

**Aufgabe:**
Prüfe Performance mit Lighthouse.

**Schritte:**
1. Öffne Chrome DevTools
2. Run Lighthouse Audit
3. Prüfe Scores:
   - Performance > 90
   - Accessibility > 90
   - Best Practices > 90
   - SEO > 90

**Optimierungen falls nötig:**
- Lazy load Images
- Optimize Icon SVGs
- Remove unused CSS

---

## ZUSAMMENFASSUNG

**Sprint 1 (Foundation):**
- [ ] Task 1.1: Footer bereinigen
- [ ] Task 1.2: Header Switcher aktivieren
- [ ] Task 1.3: Farbpalette erweitern
- [ ] Task 1.4: Typografie-Klassen (optional)

**Sprint 2 (Hero):**
- [ ] Task 2.1: Hero-Text optimieren
- [ ] Task 2.2: Hero-Komponente erweitern
- [ ] Task 2.3: Hero Background (optional)

**Sprint 3 (Features):**
- [ ] Task 3.1: Feature-Text optimieren
- [ ] Task 3.2: Feature Hover-Effekte (optional)

**Sprint 4 (Polish):**
- [ ] Task 4.1: Responsive Check
- [ ] Task 4.2: Performance Check

---

## NOTES FOR DEV AGENT

**Wichtig:**
- Teste jeden Task einzeln bevor du zum nächsten gehst
- Commite nach jedem abgeschlossenen Sprint
- Bei Fragen oder Problemen: Check zurück mit UX Designer
- Alle optionalen Tasks können übersprungen werden wenn Zeit knapp ist

**Prioritäten:**
1. MUST HAVE: Tasks mit "HIGH" Priority
2. SHOULD HAVE: Tasks mit "MEDIUM" Priority
3. NICE TO HAVE: Tasks mit "LOW" Priority + alle "(optional)" Tasks

**Testing:**
- Teste auf Dark Mode (Primary)
- Teste auf Light Mode (Secondary)
- Teste auf verschiedenen Browsern: Chrome, Firefox, Safari

---

**Let's build a Meisterwerk! 🔨✨**
