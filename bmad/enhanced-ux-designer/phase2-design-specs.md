# Phase 2: Digital Blueprint - Design Specifications
**Created:** 2025-11-16 10:27:44
**UX Designer:** Enhanced V3 Master UX Designer

---

## 1. Design Concept: "Digital Blueprint"

Ein hochmodernes, dunkles Interface, das die Professionalität und technische Kompetenz der Zielgruppe (moderne Handwerker) widerspiegelt. Die Ästhetik kombiniert industrielle Präzision mit digitaler Innovation.

### Kernelemente:
- **Sehr dunkler Hintergrund** mit subtilen animierten Partikeln
- **Electric Blue Akzente** für interaktive Elemente und Highlights
- **Präzise, geometrische Typografie**
- **Flüssige Animationen** für Premium-Feeling

---

## 2. Farbpalette

### Primärfarben (Dark Theme)
```css
--blueprint-bg-base: #0f172a      /* Sehr dunkles Blau-Grau (slate-900) */
--blueprint-bg-elevated: #1e293b  /* Erhöhte Flächen (slate-800) */
--blueprint-bg-card: #334155      /* Karten (slate-700) */

--blueprint-accent: #3b82f6       /* Electric Blue (blue-500) */
--blueprint-accent-hover: #60a5fa /* Heller Blue für Hover (blue-400) */
--blueprint-accent-glow: rgba(59, 130, 246, 0.2) /* Glow-Effekt */

--blueprint-text-primary: #f8fafc    /* Haupttext (slate-50) */
--blueprint-text-secondary: #cbd5e1  /* Sekundärtext (slate-300) */
--blueprint-text-muted: #64748b      /* Muted Text (slate-500) */

--blueprint-border: #334155          /* Border (slate-700) */
--blueprint-border-subtle: #1e293b   /* Subtile Border (slate-800) */
```

### Akzentfarben für Status/Highlights
```css
--blueprint-success: #10b981   /* Green-500 */
--blueprint-warning: #f59e0b   /* Amber-500 */
--blueprint-error: #ef4444     /* Red-500 */
```

---

## 3. Typografie

### Font Imports (Google Fonts)
```html
<!-- Zu ergänzen in app/root.tsx oder entsprechendem Layout -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Typografie-System
```css
/* Headlines - Manrope (geometrisch, modern) */
--font-headline: 'Manrope', system-ui, sans-serif

/* Body Text - System Fonts (optimale Lesbarkeit) */
--font-body: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif

/* Sizes */
--text-hero: clamp(2.5rem, 5vw, 4rem)       /* 40-64px */
--text-h1: clamp(2rem, 4vw, 3rem)           /* 32-48px */
--text-h2: clamp(1.5rem, 3vw, 2.25rem)      /* 24-36px */
--text-h3: 1.25rem                           /* 20px */
--text-body: 1rem                            /* 16px */
--text-small: 0.875rem                       /* 14px */
```

### Font Weights
- **Extra Bold (800)**: Hero Headlines
- **Bold (700)**: Section Headlines
- **Semibold (600)**: Feature Titles
- **Medium (500)**: Buttons, Links
- **Regular (400)**: Body Text

---

## 4. Background Effect: Animated Blueprint Network

### Implementation mit @tsparticles/react

```tsx
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const particlesOptions = {
  background: {
    color: "#0f172a", // blueprint-bg-base
  },
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        area: 800,
      },
    },
    color: {
      value: "#3b82f6", // Electric Blue
    },
    shape: {
      type: "circle",
    },
    opacity: {
      value: 0.3,
      random: true,
    },
    size: {
      value: 2,
      random: true,
    },
    links: {
      enable: true,
      distance: 150,
      color: "#3b82f6",
      opacity: 0.2,
      width: 1,
    },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      random: true,
      straight: false,
      outModes: "bounce",
    },
  },
  interactivity: {
    detectsOn: "canvas",
    events: {
      onHover: {
        enable: true,
        mode: "grab",
      },
      resize: true,
    },
    modes: {
      grab: {
        distance: 140,
        links: {
          opacity: 0.4,
        },
      },
    },
  },
  detectRetina: true,
};
```

**Positioning:**
```css
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
```

---

## 5. Animation Specifications (Framer Motion)

### 5.1 Hero Section Animation

#### Typewriter/Decode Effect für Headline
```tsx
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const child = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

// Usage:
<motion.h1
  variants={container}
  initial="hidden"
  animate="visible"
  className="text-hero font-headline font-extrabold"
>
  {"Baue dein Handwerk digital".split("").map((char, i) => (
    <motion.span key={i} variants={child}>
      {char === " " ? "\u00A0" : char}
    </motion.span>
  ))}
</motion.h1>
```

### 5.2 On-Scroll Animations für Sektionen

```tsx
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

// Usage:
<motion.div {...fadeInUp}>
  {/* Feature Card Content */}
</motion.div>
```

### 5.3 Button Hover Effects

```tsx
const buttonHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
    transition: { duration: 0.2 }
  },
  tap: { scale: 0.98 }
};

// Usage:
<motion.button
  initial="rest"
  whileHover="hover"
  whileTap="tap"
  variants={buttonHover}
  className="bg-blueprint-accent..."
>
  Starte kostenlos
</motion.button>
```

### 5.4 Feature Card Hover

```tsx
const cardHover = {
  rest: {
    y: 0,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  },
  hover: {
    y: -8,
    boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.1), 0 0 40px rgba(59, 130, 246, 0.1)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};
```

---

## 6. Component Specifications

### 6.1 Hero Section

**Layout:**
```
┌─────────────────────────────────────────┐
│  [Particles Background]                 │
│                                         │
│  ┌─────────────────────────────────┐  │
│  │  Small Badge: "Neu: Version 2.0"│  │
│  └─────────────────────────────────┘  │
│                                         │
│  Baue dein Handwerk digital            │  <- Animated Typewriter
│  [Hero Headline]                       │
│                                         │
│  Das CRM-System, das mit dir wächst    │  <- Fade In
│  [Subheadline]                         │
│                                         │
│  [Starte kostenlos] [Demo ansehen]     │  <- Buttons mit Glow
│                                         │
│  Hinweis: "Kostenlos testen..."        │  <- Subtle fade
│                                         │
└─────────────────────────────────────────┘
```

**Specs:**
- Padding: `py-20 md:py-32`
- Max-width: `max-w-4xl mx-auto`
- Text-align: `text-center`
- Badge: Electric Blue background, slight glow
- Buttons: Primary (filled blue) + Secondary (outline)

### 6.2 Feature Cards

**Card Structure:**
```tsx
<motion.div
  variants={cardHover}
  initial="rest"
  whileHover="hover"
  className="bg-blueprint-bg-elevated border border-blueprint-border rounded-xl p-8"
>
  {/* Icon mit Gradient */}
  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
    <Icon className="w-8 h-8 text-white" />
  </div>

  {/* Title */}
  <h3 className="text-h3 font-headline font-semibold text-blueprint-text-primary mb-3">
    Intelligente Kalkulation
  </h3>

  {/* Description */}
  <p className="text-blueprint-text-secondary leading-relaxed">
    Erstelle professionelle Angebote in Minuten...
  </p>

  {/* Optional: Link */}
  <a href="#" className="inline-flex items-center text-blueprint-accent mt-4 hover:text-blueprint-accent-hover">
    Mehr erfahren →
  </a>
</motion.div>
```

**Grid Layout:**
```css
display: grid;
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
gap: 2rem;
```

### 6.3 Call-to-Action Button

**Primary Button:**
```tsx
<motion.button
  whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)" }}
  whileTap={{ scale: 0.98 }}
  className="
    px-8 py-4
    bg-blue-500 hover:bg-blue-600
    text-white font-medium
    rounded-lg
    shadow-lg shadow-blue-500/20
    transition-colors duration-200
  "
>
  Starte kostenlos
</motion.button>
```

**Secondary Button (Outline):**
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="
    px-8 py-4
    border-2 border-blue-500
    text-blue-400 hover:text-blue-300
    rounded-lg
    backdrop-blur-sm
    transition-colors duration-200
  "
>
  Demo ansehen
</motion.button>
```

---

## 7. Layout Structure

### Section Spacing System
```css
--spacing-section: 6rem      /* 96px zwischen Sektionen */
--spacing-section-sm: 4rem   /* 64px für kleinere Viewports */
```

### Container Widths
```css
--container-sm: 640px    /* Für Text-Content */
--container-md: 768px    /* Für Features */
--container-lg: 1024px   /* Für Hero */
--container-xl: 1280px   /* Für Full-Width Sektionen */
```

### Recommended Sections Order:
1. **Hero** - Mit animiertem Hintergrund & Typewriter
2. **Logo Cloud** - (Optional) Vertrauens-Logos
3. **Features Grid** - 3-4 Kernfeatures mit Icons
4. **Visual Showcase** - Screenshots/Mockups mit Scroll-Parallax
5. **Social Proof** - Testimonials (falls vorhanden)
6. **Pricing Teaser** - Kurzer Preis-Überblick
7. **Final CTA** - Letzte Handlungsaufforderung
8. **Footer** - Minimal, aber informativ

---

## 8. Micro-Interactions

### 8.1 Link Hover
```css
.blueprint-link {
  position: relative;
  color: var(--blueprint-accent);
  transition: color 0.2s;
}

.blueprint-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--blueprint-accent);
  transition: width 0.3s ease-out;
}

.blueprint-link:hover::after {
  width: 100%;
}
```

### 8.2 Input Focus Glow
```css
.blueprint-input:focus {
  outline: none;
  border-color: var(--blueprint-accent);
  box-shadow: 0 0 0 3px var(--blueprint-accent-glow),
              0 0 20px var(--blueprint-accent-glow);
}
```

---

## 9. Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Tablets */
md: 768px   /* Small Laptops */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large Screens */
```

### Typography Scaling
- **Mobile:** Reduziere font-sizes um 20%
- **Tablet:** Standard sizes
- **Desktop:** Erhöhe Headlines um 10%

---

## 10. Performance Optimizations

### Critical Rendering
1. **Font Loading:** `font-display: swap` für Google Fonts
2. **Particles:** Reduziere Anzahl auf Mobile (40 statt 80)
3. **Animations:** `prefers-reduced-motion` Media Query respektieren

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const animationVariants = prefersReducedMotion
  ? { initial: {}, animate: {} }  // Keine Animation
  : fadeInUp;  // Volle Animation
```

### Lazy Loading
- Particles-Component nur laden wenn im Viewport
- Images mit `loading="lazy"`
- Framer Motion Variants nur bei Bedarf

---

## 11. Accessibility (a11y)

### Kontrast-Ratios (WCAG AA)
- Text auf Dark BG: Mindestens 7:1 ✅
- Blue Accent auf Dark: 4.5:1 ✅
- Links: Unterstrichen oder eindeutig erkennbar ✅

### Keyboard Navigation
- Alle interaktiven Elemente fokussierbar
- Focus-Ring: Electric Blue mit 2px Outline
- Skip-to-Content Link für Screen Reader

### ARIA Labels
```tsx
<button aria-label="Starte kostenlos">
  <span>Starte kostenlos</span>
</button>
```

---

## 12. Developer Handoff Checklist

### Zu implementierende Features:
- [ ] tsParticles Background mit konfigurierter Options
- [ ] Framer Motion für alle definierten Animationen
- [ ] Google Fonts (Manrope) Import
- [ ] Custom CSS Variables für Blueprint Theme
- [ ] Responsive Grid für Feature Cards
- [ ] Hover Effects für Buttons & Cards
- [ ] Typewriter Effect für Hero Headline
- [ ] On-Scroll Fade-In Animationen
- [ ] Mobile Optimierungen (reduced particles, scaled fonts)
- [ ] Accessibility Features (Focus states, ARIA labels)

---

**Design Review:** Ready for Phase 3 Implementation ✅
**Next Step:** Übergabe an Enhanced Developer für technische Umsetzung
