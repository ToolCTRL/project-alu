# MASTER LANDING PAGE REDESIGN - Developer Implementation Guide
**Enhanced UX Designer V3 → Enhanced Developer | 2025-11-16**

---

## WICHTIGE HINWEISE FÜR DEN DEVELOPER

### Philosophie
- **Perfektion über Geschwindigkeit:** Nimm dir Zeit, teste gründlich
- **Performance First:** Jede Animation muss 60 FPS erreichen
- **Keine faule Sau sein:** Wenn etwas nicht perfekt aussieht → sofort korrigieren
- **Kontinuierliches Testen:** Nach jeder Phase visuell prüfen

### Dokumente
1. **Diese Datei:** Schritt-für-Schritt Implementierung
2. **Design-Spec:** `master-landing-page-redesign-spec.md` (technische Details)
3. **Master Prompt:** `master_ux_design_prompt.md` (Kontext & Vision)

---

## PHASE 0: VORBEREITUNG (30 min)

### 0.1 Environment Check
```bash
# Node Version
node --version  # >= 18.x

# Dependencies
npm install  # Falls noch nicht gemacht

# Dev Server starten
npm run dev

# In neuem Terminal: TypeScript Check
npm run typecheck
```

### 0.2 Bestehende Implementierung analysieren

**BEREITS VORHANDEN (✅ = validieren, nicht neu bauen):**
- ✅ `HeroVariantMeisterwerk.tsx` - Hero Section mit Animationen
- ✅ `FeaturesVariantAlternating.tsx` - Features Section
- ✅ `GridBackground.tsx` - Grid-Hintergrund
- ✅ `ParticlesBackground.tsx` - Partikel-System
- ✅ `ScrollReveal.tsx` - Scroll-Animation Component
- ✅ Tailwind Config mit Purple Theme
- ✅ `defaultLandingPage.ts` - Landing Page Content

**ZU ERSTELLEN (🆕):**
- 🆕 `AnimatedCounter.tsx` - Für Stats Section
- 🆕 `ValueCard.tsx` - Für "Unsere Werte"
- 🆕 `StoryBlock` - "Unsere Geschichte" Scroll-Story
- 🆕 `ValuesBlock` - "Unsere Werte" Section
- 🆕 Connector Lines zwischen Feature Cards
- 🆕 3D Tilt Effect auf Cards
- 🆕 Breathing Icon Animation

### 0.3 Branch erstellen
```bash
git checkout -b feature/master-landing-page-redesign
```

---

## PHASE 1: GLOBALE STYLES & UTILITIES (2-3h)

### 1.1 globals.css erweitern

**Datei:** `app/globals.css`

**Hinzufügen am Ende:**
```css
/* ===== MEISTERWERK LANDING PAGE STYLES ===== */

/* Smooth Scroll */
html {
  scroll-behavior: smooth;
}

/* Glassmorphism Utilities */
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 12px;
}

.glass-card-strong {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 12px;
}

.glass-card-hover {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card-hover:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(168, 85, 247, 0.5);
}

/* Glow Utilities */
.glow-purple-strong {
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
}

.glow-green-strong {
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.3);
}

.glow-orange-strong {
  box-shadow: 0 0 40px rgba(245, 158, 11, 0.3);
}

/* GPU Acceleration */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Typography Utilities */
.text-hero-headline {
  font-size: 3.5rem; /* 56px */
  line-height: 1.1;
  font-weight: 700;
  font-family: var(--font-headline);
}

@media (max-width: 768px) {
  .text-hero-headline {
    font-size: 2.5rem; /* 40px */
  }
}

.text-hero-subheadline {
  font-size: 1.5rem; /* 24px */
  line-height: 1.4;
  font-weight: 500;
}

@media (max-width: 768px) {
  .text-hero-subheadline {
    font-size: 1.25rem; /* 20px */
  }
}

.text-feature-headline {
  font-size: 2rem; /* 32px */
  line-height: 1.3;
  font-weight: 600;
  color: var(--text-primary);
}

.text-body-large {
  font-size: 1.125rem; /* 18px */
  line-height: 1.7;
  color: var(--text-secondary);
}
```

**Testen:**
```bash
# Dev Server sollte auto-reload machen
# Öffne http://localhost:3000 und prüfe ob Styles geladen werden
```

### 1.2 AnimatedCounter Component erstellen

**Datei erstellen:** `app/components/ui/animations/AnimatedCounter.tsx`

```tsx
import { useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface Props {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number; // in ms
  className?: string;
}

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2000,
  className = ""
}: Props) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Easing function (easeOutExpo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = Math.floor(easeOut * value);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}
```

**Testen:**
```tsx
// In einer Test-Page:
<AnimatedCounter value={500} suffix="+" className="text-5xl font-bold" />
```

### 1.3 Tailwind Config validieren

**Datei:** `tailwind.config.ts`

**Checken, ob folgende Werte vorhanden sind:**
```typescript
// Blueprint Theme ✅
colors: {
  blueprint: {
    bg: {
      base: '#0f172a',
      elevated: '#1e293b',
      card: '#334155',
    },
    accent: {
      DEFAULT: '#a855f7',  // Purple
      hover: '#c084fc',
      secondary: '#10b981',  // Green
      tertiary: '#f59e0b',   // Orange
    },
    // ...
  }
}

// Animations ✅
keyframes: {
  float: { ... },
  'glow-pulse': { ... },
  'pulse-slow': { ... },
}

animation: {
  float: 'float 6s ease-in-out infinite',
  'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
  'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}
```

**Falls etwas fehlt:** Siehe Design-Spec Kapitel 1.1 für vollständige Config

---

## PHASE 2: HEADER MINIMALISIERUNG (1h)

### 2.1 Header Component anpassen

**Datei:** `app/modules/pageBlocks/components/blocks/marketing/header/HeaderBlock.tsx`

**ODER (je nach Variante):** `HeaderVariantSimple.tsx`

**Änderungen:**

1. **Dark/Light Mode Toggle entfernen:**
```tsx
// VORHER:
{withDarkModeToggle && <DarkModeToggle />}

// NACHHER:
{/* Dark Mode Toggle entfernt - nur Dark Mode */}
```

2. **Language Selector entfernen:**
```tsx
// VORHER:
{withLanguageSelector && <LanguageSelector />}

// NACHHER:
{/* Language Selector entfernt - nur Deutsch */}
```

3. **Navigation Links entfernen:**
```tsx
// VORHER:
{links.map(link => <NavLink {...link} />)}

// NACHHER:
{/* Navigation Links entfernt */}
```

### 2.2 Login Button - Fixed Position

**OPTION A: Im Header Component (empfohlen)**

Datei: `HeaderVariantSimple.tsx`

```tsx
export default function HeaderVariantSimple({ item }: Props) {
  return (
    <>
      {/* Minimal Header */}
      <header className="relative z-40 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            {item.withLogo && <Logo className="h-8" />}
          </div>
        </div>
      </header>

      {/* Fixed Login Button (top-right) */}
      {item.withSignInAndSignUp && (
        <motion.a
          href="/login"
          className="
            fixed top-6 right-6 z-50
            px-6 py-2.5
            rounded-lg
            bg-blueprint-glass-medium
            backdrop-blur-md
            border border-blueprint-glass-border
            text-blueprint-text-primary font-semibold text-sm
            transition-all duration-300
            hover:bg-blueprint-accent
            hover:border-blueprint-accent
            hover:scale-105
          "
          whileHover={{
            boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.a>
      )}
    </>
  );
}
```

**OPTION B: Global in root.tsx (Alternative)**

Falls Login Button überall sichtbar sein soll (auch während Scroll):
```tsx
// app/root.tsx
{/* ... andere Components ... */}
<LoginButton />
{/* ... */}
```

**Testen:**
- [ ] Logo links sichtbar
- [ ] Login Button rechts oben, fixed
- [ ] Hover-Effekt funktioniert (Purple Glow)
- [ ] Keine Dark/Light/Language Toggles mehr sichtbar

---

## PHASE 3: HERO SECTION VALIDIERUNG & ENHANCEMENT (3-4h)

### 3.1 HeroVariantMeisterwerk.tsx prüfen

**Datei:** `app/modules/pageBlocks/components/blocks/marketing/hero/HeroVariantMeisterwerk.tsx`

**Status-Check:**
- ✅ Grid Background
- ✅ Particles Background
- ✅ Floating Glow Orbs (Purple, Green, Orange)
- ✅ Gradient Overlays
- ✅ Parallax Scroll Effect
- ✅ Logo + Top Text mit Glow
- ✅ Headline Stagger Animation
- ✅ Subheadline Shimmer
- ✅ CTA Buttons mit Shine Effect
- ✅ Dashboard Mockup Float
- ✅ Bottom Gradient Fade

**Bereits zu 95% fertig!** Nur validieren.

### 3.2 ParticlesBackground.tsx erstellen (falls nicht vorhanden)

**Datei:** `app/components/ui/particles/ParticlesBackground.tsx`

**Check:** Existiert die Datei? Wenn JA → skip. Wenn NEIN → erstellen:

```tsx
import { useEffect, useRef } from "react";

export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas Size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Particles
    const particles: Particle[] = [];
    const particleCount = 50;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around
        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
    />
  );
}
```

### 3.3 Testen

**Visuell prüfen:**
```bash
# Dev Server: http://localhost:3000
```

- [ ] Hero Section füllt ganzen Viewport
- [ ] Animationen laufen smooth (60 FPS)
- [ ] Parallax funktioniert beim Scrollen
- [ ] Logo + Top Text hat Purple Glow
- [ ] Headline-Wörter erscheinen gestaffelt
- [ ] Subheadline hat Shimmer-Effekt
- [ ] CTA Buttons haben Glow-Pulse + Shine on Hover
- [ ] Dashboard Mockup floatet
- [ ] Nahtloser Übergang zur nächsten Sektion (kein "komischer Block")

**Performance testen:**
```javascript
// Chrome DevTools → Performance
// Aufnahme starten → Seite scrollen → Stoppen
// FPS sollte konstant > 55 sein
```

---

## PHASE 4: FEATURES SECTION ENHANCEMENT (4-5h)

### 4.1 FeaturesVariantAlternating.tsx erweitern

**Datei:** `app/modules/pageBlocks/components/blocks/marketing/features/FeaturesVariantAlternating.tsx`

#### 4.1.1 Phasen-Indikatoren hinzufügen

**Zeile ~60, NACH `<ScrollReveal>` und VOR Icon:**

```tsx
<ScrollReveal key={index} delay={index * 0.1}>
  <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center group`}>
    {/* Text Content */}
    <div className={`${isEven ? "lg:order-1" : "lg:order-2"}`}>

      {/* 🆕 PHASEN-INDIKATOR */}
      <motion.div
        className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full glass-card text-sm"
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: [0.9, 1.05, 1], opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <motion.span
          className={`w-2 h-2 rounded-full ${
            feature.accentColor === 'primary' ? 'bg-blueprint-accent' :
            feature.accentColor === 'secondary' ? 'bg-blueprint-accent-secondary' :
            'bg-blueprint-accent-tertiary'
          }`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-blueprint-text-muted">
          Schritt {index + 1} von {item.items.length}
        </span>
      </motion.div>

      {/* Icon */}
      {feature.icon && ( ... )}
```

#### 4.1.2 "Breathing Icon" Animation

**Icon-Bereich ersetzen (Zeile ~65):**

```tsx
{/* Icon mit Breathing Animation */}
{feature.icon && (
  <div className="relative inline-flex mb-6">
    {/* Glowing Rotating Background */}
    <motion.div
      className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${
        feature.accentColor === 'primary' ? 'from-blueprint-accent/30 to-blueprint-accent/10' :
        feature.accentColor === 'secondary' ? 'from-blueprint-accent-secondary/30 to-blueprint-accent-secondary/10' :
        'from-blueprint-accent-tertiary/30 to-blueprint-accent-tertiary/10'
      } rounded-xl blur-sm`}
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
    />

    {/* Breathing Icon (vorne) */}
    <motion.div
      className={`relative z-10 p-3 rounded-xl glass-card ${accent.icon}`}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      dangerouslySetInnerHTML={{ __html: feature.icon }}
    />
  </div>
)}
```

#### 4.1.3 3D Tilt Effect auf Image Cards

**Image-Bereich ersetzen (Zeile ~115):**

```tsx
{/* Image/Illustration mit 3D Tilt */}
<div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
  <TiltCard accent={accent} feature={feature} />
</div>
```

**TiltCard Component erstellen (am Ende der Datei, VOR export default):**

```tsx
function TiltCard({ accent, feature }: { accent: any, feature: FeatureDto }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Max ±7°
    const rotY = ((x - centerX) / centerX) * 7;
    const rotX = -((y - centerY) / centerY) * 7;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY, y: -4 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`glass-card-hover p-8 ${accent.border} ${accent.glow} transition-shadow duration-300 gpu-accelerated`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-blueprint-bg-elevated">
        {feature.image?.src ? (
          <img
            src={feature.image.src}
            alt={feature.image.alt}
            className="w-full h-full object-cover"
          />
        ) : (
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
  );
}
```

**Imports hinzufügen (ganz oben):**
```tsx
import { useState, useRef } from "react";
```

### 4.2 Visuelle Konnektoren zwischen Karten

**Section-Wrapper anpassen (Zeile ~53):**

```tsx
{/* Features */}
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-32">
  {item.items.map((feature, index) => {
    const isEven = index % 2 === 0;
    const accent = accentClasses[feature.accentColor || "primary"];

    return (
      <div key={index} className="relative">
        <ScrollReveal delay={index * 0.1}>
          {/* Feature Card (existing) */}
          <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center group`}>
            {/* ... existing content ... */}
          </div>
        </ScrollReveal>

        {/* 🆕 CONNECTOR (nur zwischen Karten, nicht nach letzter) */}
        {index < item.items.length - 1 && (
          <svg
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-1 h-32 overflow-visible"
            style={{ zIndex: -1 }}
          >
            <defs>
              <linearGradient id={`connector-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <motion.line
              x1="50%" y1="0" x2="50%" y2="100%"
              stroke={`url(#connector-gradient-${index})`}
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </svg>
        )}
      </div>
    );
  })}
</div>
```

### 4.3 Testen

- [ ] Phasen-Indikatoren sichtbar ("Schritt 1 von 3")
- [ ] Breathing Icon pulsiert & rotiert
- [ ] 3D Tilt Effect funktioniert beim Hover
- [ ] Karte hebt sich & kippt basierend auf Mausposition
- [ ] Konnektoren "zeichnen" sich beim Scrollen
- [ ] FPS > 55 auch mit allen Effekten

---

## PHASE 5: NEUE CONTENT-SEKTIONEN (8-10h)

### 5.1 "Unsere Geschichte" Scroll-Story Block

#### 5.1.1 StoryBlockUtils.ts erstellen

**Datei erstellen:** `app/modules/pageBlocks/components/blocks/marketing/story/StoryBlockUtils.ts`

```typescript
export interface StoryPhase {
  headline: string;
  text: string;
  visual?: {
    type: "gradient" | "image";
    gradientFrom?: string;
    gradientTo?: string;
    imageSrc?: string;
  };
}

export interface StoryBlockDto {
  style?: "scroll-stuck";
  headline?: string;
  subheadline?: string;
  phases: StoryPhase[];
}

export function defaultStoryBlock(): StoryBlockDto {
  return {
    style: "scroll-stuck",
    headline: "Unsere Geschichte",
    subheadline: "Vom Problem zur Lösung",
    phases: [
      {
        headline: "Von der Developer UG zur Vision",
        text: "Wir entwickelten Software für die Gerkens GmbH. Dabei erkannten wir: Teure, unzureichende Lösungen am Markt. Handwerker verdienen Besseres.",
        visual: {
          type: "gradient",
          gradientFrom: "#f59e0b",
          gradientTo: "#a855f7",
        },
      },
      {
        headline: "Eine günstige, hochwertige Alternative",
        text: "Keine 300€ pro Lizenz. Sondern 15€ monatlich. Spezialisiert auf Handwerk. Mit echtem Mehrwert.",
        visual: {
          type: "gradient",
          gradientFrom: "#a855f7",
          gradientTo: "#10b981",
        },
      },
      {
        headline: "Langfristig denken, gemeinsam wachsen",
        text: "Wir schaffen Arbeitsplätze, investieren in den Markt und revolutionieren die Branche. Gemeinsam mit unseren Partnern.",
        visual: {
          type: "gradient",
          gradientFrom: "#10b981",
          gradientTo: "#a855f7",
        },
      },
    ],
  };
}
```

#### 5.1.2 StoryBlock.tsx erstellen

**Datei erstellen:** `app/modules/pageBlocks/components/blocks/marketing/story/StoryBlock.tsx`

```tsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { StoryBlockDto } from "./StoryBlockUtils";

interface Props {
  item: StoryBlockDto;
}

export default function StoryBlock({ item }: Props) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Berechne aktuelle Phase (0-basiert)
  const phaseCount = item.phases.length;
  const currentPhaseIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, phaseCount - 1]
  );

  return (
    <section ref={containerRef} className="relative py-32 bg-blueprint-bg-base">
      {/* Section Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center">
          {item.subheadline && (
            <p className="text-sm font-semibold uppercase tracking-wide text-blueprint-accent mb-4">
              {t(item.subheadline)}
            </p>
          )}
          {item.headline && (
            <h2 className="text-4xl font-bold text-blueprint-text-primary lg:text-5xl">
              {t(item.headline)}
            </h2>
          )}
        </div>
      </div>

      {/* Scroll-Stuck Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT: Sticky Visual Area */}
          <div className="sticky top-20 h-[600px] hidden lg:block">
            {item.phases.map((phase, idx) => (
              <VisualMorph
                key={idx}
                phase={phase}
                isActive={currentPhaseIndex}
                phaseIndex={idx}
              />
            ))}
          </div>

          {/* RIGHT: Scrolling Text */}
          <div className="space-y-[100vh]">
            {item.phases.map((phase, idx) => (
              <ScrollPhase key={idx} phase={phase} index={idx} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// Visual Morph Component
function VisualMorph({
  phase,
  isActive,
  phaseIndex,
}: {
  phase: any;
  isActive: any;
  phaseIndex: number;
}) {
  const opacity = useTransform(
    isActive,
    [phaseIndex - 0.5, phaseIndex, phaseIndex + 0.5],
    [0, 1, 0]
  );

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl overflow-hidden"
      style={{ opacity }}
    >
      {phase.visual?.type === "gradient" ? (
        <motion.div
          className="w-full h-full"
          style={{
            background: `linear-gradient(135deg, ${phase.visual.gradientFrom}20, ${phase.visual.gradientTo}20)`,
          }}
        />
      ) : (
        <img
          src={phase.visual?.imageSrc}
          alt={phase.headline}
          className="w-full h-full object-cover"
        />
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blueprint-accent/10 to-transparent" />
    </motion.div>
  );
}

// Scroll Phase Component
function ScrollPhase({ phase, index }: { phase: any; index: number }) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.5 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-8 lg:p-12"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blueprint-accent text-white font-bold">
          {index + 1}
        </span>
        <span className="text-sm text-blueprint-text-muted uppercase tracking-wide">
          Phase {index + 1}
        </span>
      </div>

      <h3 className="text-3xl font-bold text-blueprint-text-primary mb-6">
        {t(phase.headline)}
      </h3>

      <p className="text-lg text-blueprint-text-secondary leading-relaxed">
        {t(phase.text)}
      </p>
    </motion.div>
  );
}
```

#### 5.1.3 PageBlockDto erweitern

**Datei:** `app/modules/pageBlocks/dtos/PageBlockDto.ts`

**Import hinzufügen:**
```typescript
import { StoryBlockDto } from "../components/blocks/marketing/story/StoryBlockUtils";
```

**Type erweitern (Zeile ~44):**
```typescript
export type PageBlockDto = {
  // ... existing
  story?: StoryBlockDto;  // 🆕
};
```

#### 5.1.4 PageBlock.tsx Router erweitern

**Datei:** `app/modules/pageBlocks/components/blocks/PageBlock.tsx`

**Import:**
```typescript
import StoryBlock from "./marketing/story/StoryBlock";
```

**Render Logic (im switch/if-block):**
```typescript
{item.story && <StoryBlock item={item.story} />}
```

#### 5.1.5 In defaultLandingPage.ts einbauen

**Datei:** `app/modules/pageBlocks/utils/defaultPages/defaultLandingPage.ts`

**Nach Features Section:**
```typescript
// ... Features Section ...

// Unsere Geschichte Scroll-Story
{
  story: {
    style: "scroll-stuck",
    headline: "Unsere Geschichte",
    subheadline: "Vom Problem zur Lösung",
    phases: [
      {
        headline: "Von der Developer UG zur Vision",
        text: "Wir entwickelten Software für die Gerkens GmbH. Dabei erkannten wir: Teure, unzureichende Lösungen am Markt. Handwerker verdienen Besseres.",
        visual: {
          type: "gradient",
          gradientFrom: "#f59e0b",
          gradientTo: "#a855f7",
        },
      },
      {
        headline: "Eine günstige, hochwertige Alternative",
        text: "Keine 300€ pro Lizenz. Sondern 15€ monatlich. Spezialisiert auf Handwerk. Mit echtem Mehrwert.",
        visual: {
          type: "gradient",
          gradientFrom: "#a855f7",
          gradientTo: "#10b981",
        },
      },
      {
        headline: "Langfristig denken, gemeinsam wachsen",
        text: "Wir schaffen Arbeitsplätze, investieren in den Markt und revolutionieren die Branche. Gemeinsam mit unseren Partnern.",
        visual: {
          type: "gradient",
          gradientFrom: "#10b981",
          gradientTo: "#a855f7",
        },
      },
    ],
  },
},

// ... weiter ...
```

### 5.2 "Unsere Werte" Section (ähnliche Schritte)

#### 5.2.1 ValuesBlockUtils.ts

**Datei:** `app/modules/pageBlocks/components/blocks/marketing/values/ValuesBlockUtils.ts`

```typescript
export interface ValueItem {
  icon: string; // HTML SVG
  headline: string;
  description: string;
  accentColor: "primary" | "secondary" | "tertiary";
}

export interface ValuesBlockDto {
  style?: "grid";
  headline?: string;
  subheadline?: string;
  items: ValueItem[];
}

export function defaultValuesBlock(): ValuesBlockDto {
  return {
    style: "grid",
    headline: "Unsere Werte",
    subheadline: "Was uns antreibt",
    items: [
      {
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>`,
        headline: "Günstig & Fair",
        description: "Keine 300€ pro Lizenz, sondern 15€ monatlich – weil wir etwas zurückgeben wollen an die Handwerksbranche.",
        accentColor: "tertiary", // Orange
      },
      {
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>`,
        headline: "Simpel & Effizient",
        description: "Einfache Bedienung, die den Arbeitsalltag erleichtert und manuelle Prozesse automatisiert, damit mehr Zeit für das Wesentliche bleibt.",
        accentColor: "primary", // Purple
      },
      {
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>`,
        headline: "Anbindung & Flexibilität",
        description: "Bindet nahtlos an bestehende Software an, zwingt nicht zum Systemwechsel, sondern integriert sich perfekt in Ihre Arbeitsabläufe.",
        accentColor: "secondary", // Green
      },
      {
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>`,
        headline: "Langfristige Partnerschaft",
        description: "Langfristige Perspektive statt kurzfristiger Gewinn – wir schaffen Arbeitsplätze, investieren in den Markt und wachsen gemeinsam mit unseren Partnern.",
        accentColor: "primary", // Purple
      },
      {
        icon: `<svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>`,
        headline: "Immer erreichbar",
        description: "Fester Supportbetrag, unser Team ist immer für Sie da, um schnelle und kompetente Hilfe zu leisten.",
        accentColor: "secondary", // Green
      },
    ],
  };
}
```

#### 5.2.2 ValuesBlock.tsx

**Datei:** `app/modules/pageBlocks/components/blocks/marketing/values/ValuesBlock.tsx`

```tsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import ScrollReveal from "~/components/ui/animations/ScrollReveal";
import type { ValuesBlockDto } from "./ValuesBlockUtils";

interface Props {
  item: ValuesBlockDto;
}

const accentClasses = {
  primary: {
    icon: "text-blueprint-accent",
    bg: "from-blueprint-accent/30 to-blueprint-accent/10",
  },
  secondary: {
    icon: "text-blueprint-accent-secondary",
    bg: "from-blueprint-accent-secondary/30 to-blueprint-accent-secondary/10",
  },
  tertiary: {
    icon: "text-blueprint-accent-tertiary",
    bg: "from-blueprint-accent-tertiary/30 to-blueprint-accent-tertiary/10",
  },
};

export default function ValuesBlock({ item }: Props) {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-gradient-to-b from-blueprint-bg-base to-blueprint-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            {item.subheadline && (
              <p className="text-sm font-semibold uppercase tracking-wide text-blueprint-accent mb-4">
                {t(item.subheadline)}
              </p>
            )}
            {item.headline && (
              <h2 className="text-4xl font-bold text-blueprint-text-primary lg:text-5xl">
                {t(item.headline)}
              </h2>
            )}
          </div>
        </ScrollReveal>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {item.items.map((value, index) => (
            <ValueCard key={index} value={value} delay={index * 0.1} />
          ))}
        </div>

      </div>
    </section>
  );
}

// Value Card Component
function ValueCard({ value, delay }: { value: any; delay: number }) {
  const { t } = useTranslation();
  const accent = accentClasses[value.accentColor];

  return (
    <ScrollReveal delay={delay}>
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        className="glass-card p-8 h-full group cursor-default"
      >
        {/* Breathing Icon */}
        <div className="relative inline-flex mb-6">
          {/* Rotating Glow Background */}
          <motion.div
            className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${accent.bg} rounded-xl blur-sm`}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />

          {/* Breathing Icon */}
          <motion.div
            className={`relative z-10 p-4 rounded-xl glass-card ${accent.icon}`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            dangerouslySetInnerHTML={{ __html: value.icon }}
          />
        </div>

        {/* Headline */}
        <h3 className="text-xl font-bold mb-3 text-blueprint-text-primary">
          {t(value.headline)}
        </h3>

        {/* Description */}
        <p className="text-blueprint-text-secondary leading-relaxed">
          {t(value.description)}
        </p>
      </motion.div>
    </ScrollReveal>
  );
}
```

#### 5.2.3 In System integrieren (PageBlockDto, PageBlock.tsx, defaultLandingPage.ts)

**Analog zu StoryBlock** (siehe 5.1.3 - 5.1.5)

### 5.3 Stats Section mit AnimatedCounter

**In defaultLandingPage.ts, Stats Section HTML-Block ersetzen:**

```typescript
// Stats Section (ENHANCED mit AnimatedCounter)
{
  layout: {
    padding: { y: "py-24" },
  },
  html: `
    <div class="bg-gradient-to-b from-blueprint-bg-base to-blueprint-bg-elevated">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-3 gap-12">

          <!-- Stat 1 -->
          <div class="text-center glass-card p-8 group">
            <div class="text-5xl font-bold text-blueprint-accent mb-2 animate-glow-pulse">
              <span data-counter="500">500</span>+
            </div>
            <p class="text-blueprint-text-secondary">Betriebe vertrauen uns</p>
          </div>

          <!-- Stat 2 -->
          <div class="text-center glass-card p-8 group">
            <div class="text-5xl font-bold text-blueprint-accent-secondary mb-2">
              <span data-counter="10000">10.000</span>+
            </div>
            <p class="text-blueprint-text-secondary">Angebote erstellt</p>
          </div>

          <!-- Stat 3 -->
          <div class="text-center glass-card p-8 group">
            <div class="text-5xl font-bold text-blueprint-accent-tertiary mb-2">
              <span data-counter="98">98</span>%
            </div>
            <p class="text-blueprint-text-secondary">Kundenzufriedenheit</p>
          </div>

        </div>
      </div>
    </div>
  `,
},
```

**ODER besser: Stats als eigener Block erstellen (StatsBlock.tsx)**

*Analog zu ValuesBlock, mit AnimatedCounter Component*

### 5.4 Testen

- [ ] "Unsere Geschichte" Section rendert korrekt
- [ ] Scroll-Stuck Effect funktioniert (Visual bleibt fixiert)
- [ ] Visuals morphen zwischen Phasen
- [ ] "Unsere Werte" Cards mit Breathing Icons
- [ ] Stats Counter zählen hoch beim Scroll
- [ ] Alle Animationen smooth

---

## PHASE 6: FOOTER & ÜBERGÄNGE (1-2h)

### 6.1 Footer Farbanpassung

**Datei:** `app/modules/pageBlocks/components/blocks/marketing/footer/FooterVariantSimple.tsx`

**Root Element anpassen:**
```tsx
<footer className="bg-blueprint-bg-base border-t border-blueprint-border-subtle">
  {/* ... Footer Content ... */}
</footer>
```

**Wichtig:** `bg-blueprint-bg-base` (GLEICHE Farbe wie letzte Sektion)

### 6.2 Datenschutz/AGB Styling

**Im Footer, unterer Bereich:**
```tsx
<div className="mt-12 pt-8 border-t border-blueprint-border-subtle">
  <div className="flex flex-wrap justify-center gap-6 text-sm text-blueprint-text-muted">
    <a
      href="/privacy"
      className="hover:text-blueprint-accent transition-colors duration-200"
    >
      Datenschutz
    </a>
    <a
      href="/terms"
      className="hover:text-blueprint-accent transition-colors duration-200"
    >
      AGB
    </a>
    <a
      href="/imprint"
      className="hover:text-blueprint-accent transition-colors duration-200"
    >
      Impressum
    </a>
  </div>

  <p className="text-center text-xs text-blueprint-text-muted mt-4">
    © 2025 Meisterwerk. Digitale Exzellenz für Ihr Handwerk.
  </p>
</div>
```

### 6.3 Nahtlose Sektions-Übergänge prüfen

**Alle Sektionen checken:**
- Hero → Trust/Social Proof: ✅ Gradient Fade
- Trust → Features: ✅ Gleiche Farbe
- Features → Geschichte: ✅ Gleiche Farbe
- Geschichte → Werte: ✅ Gradient
- Werte → Stats: ✅ Gradient
- Stats → CTA: ✅ Gradient
- CTA → Footer: ✅ Gleiche Farbe

**Falls Übergänge hart:** Gradient hinzufügen:
```tsx
<div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-blueprint-bg-elevated" />
```

---

## PHASE 7: TESTING & PERFORMANCE (3-4h)

### 7.1 Responsive Testing

**Breakpoints testen:**
```
Mobile:      320px, 375px, 414px (iPhone SE, iPhone 12/13, iPhone 14 Pro Max)
Tablet:      768px, 1024px (iPad, iPad Pro)
Desktop:     1280px, 1440px, 1920px
Ultra-wide:  2560px
```

**Chrome DevTools:**
- Device Toolbar öffnen (Cmd+Shift+M)
- Durch Presets scrollen
- Custom Breakpoints testen

**Checkpoints:**
- [ ] Hero: Logo & Text skalieren proportional
- [ ] Features: Grid stackt auf mobile (1 Spalte)
- [ ] Story: Sticky Visual versteckt sich auf mobile
- [ ] Values: 1 → 2 → 3 Spalten responsive
- [ ] Footer: Grid stackt korrekt

### 7.2 Performance Audit

#### Lighthouse
```bash
# Chrome DevTools → Lighthouse → Generate Report
# Targets:
# - Performance: > 90
# - Accessibility: > 95
# - Best Practices: > 90
# - SEO: > 90
```

**Falls Performance < 90:**
- [ ] Bilder komprimieren (WebP)
- [ ] Lazy Loading prüfen
- [ ] JS Bundle Size reduzieren
- [ ] Unused CSS entfernen

#### FPS Monitoring

**Chrome DevTools → Performance:**
1. Start Recording
2. Seite komplett scrollen
3. Stop Recording
4. Frame Rate prüfen (sollte > 55 FPS sein)

**Falls Drops:**
- [ ] Throttle Mouse Events (16ms)
- [ ] Reduce Particle Count
- [ ] Simplify Animations

#### WebPageTest.org

1. URL eingeben: `http://your-deploy-url.com`
2. Location: Frankfurt (Europa) oder New York
3. Run Test
4. Analysieren: TTFB, LCP, CLS

### 7.3 Accessibility Audit

**Axe DevTools (Browser Extension installieren):**
```bash
# Chrome Extension: axe DevTools
# Scan Page → Fix alle CRITICAL & SERIOUS Issues
```

**Manual Checks:**
- [ ] Tab Navigation funktioniert
- [ ] Alle Buttons/Links erreichbar
- [ ] Focus States sichtbar (Purple Ring)
- [ ] Screen Reader Labels vorhanden
- [ ] Color Contrast WCAG AA

**Keyboard Navigation testen:**
```
Tab        → Nächstes Element
Shift+Tab  → Vorheriges Element
Enter      → Link/Button aktivieren
Space      → Button aktivieren
```

### 7.4 Cross-Browser Testing

**Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS/iOS)
- [ ] Edge (latest)

**Hauptprobleme Safari:**
- `backdrop-filter` Prefix: `-webkit-backdrop-filter`
- Framer Motion Animationen testen

**Check:**
- [ ] Alle Animationen laufen
- [ ] Glassmorphism funktioniert
- [ ] Keine Layout-Bugs
- [ ] Fonts laden korrekt

---

## PHASE 8: FINALISIERUNG & DEPLOYMENT-VORBEREITUNG (1h)

### 8.1 Code Cleanup

**ESLint & Prettier:**
```bash
npm run lint
npm run format  # (falls vorhanden)
```

**Fixes:**
- [ ] Alle Lint Errors beheben
- [ ] Unused Imports entfernen
- [ ] Console.logs entfernen
- [ ] TypeScript Errors beheben

### 8.2 Final Visual Review

**Mit UX Designer (oder User) durchgehen:**
- [ ] Alle Farben korrekt (Purple Theme)
- [ ] Animationen smooth & subtil
- [ ] Texte korrekt (Rechtschreibung)
- [ ] Bilder hochwertig (keine Placeholder, falls echte Bilder vorhanden)
- [ ] Kein "komischer Block"
- [ ] Footer nahtlos integriert

### 8.3 Commit & Push

```bash
git add .
git commit -m "feat: Complete Master Landing Page Redesign

- Hero Section with 4 background animation concepts
- Features Section with 3D Tilt, Breathing Icons, Connectors
- New 'Unsere Geschichte' Scroll-Story Section
- New 'Unsere Werte' Section with animated icons
- Enhanced Stats Section with Animated Counters
- Improved Testimonials Carousel
- Minimalist Header (Login button only)
- Seamless Footer integration
- Full responsive design
- Performance optimizations (60 FPS)
- WCAG AA accessibility compliance

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
"

git push origin feature/master-landing-page-redesign
```

### 8.4 Pull Request erstellen

```bash
gh pr create \
  --title "Master Landing Page Redesign - Dark Theme mit Purple Accents" \
  --body "$(cat <<'EOF'
## Summary
Vollständiger Redesign der Landing Page gemäß Master Design-Spezifikation:
- **Dark Theme** mit **Purple/Green/Orange** Akzentfarben
- **Immersive Animationen** (Grid, Particles, Glow Orbs, Parallax)
- **Storytelling** via Scroll-Story Sektion
- **Performance-optimiert** (60 FPS, Lighthouse > 90)
- **WCAG AA compliant**

## Test Plan
- [x] Responsive Testing (Mobile, Tablet, Desktop, Ultra-wide)
- [x] Performance Audit (Lighthouse > 90)
- [x] Accessibility Audit (Axe DevTools)
- [x] Cross-Browser Testing (Chrome, Firefox, Safari, Edge)
- [x] Animation Performance (60 FPS)
- [x] Visual QA (alle Sektionen)

## Deliverables
- `bmad/enhanced-ux-designer/master-landing-page-redesign-spec.md` - Design Spec
- `bmad/enhanced-ux-designer/dev-implementation-guide-master.md` - Diese Datei
- Alle neuen Components & Blocks

## Screenshots
(User kann hier Screenshots einfügen)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## TROUBLESHOOTING

### Problem: Animationen laggen (FPS < 50)

**Lösungen:**
1. **Throttle Event Handlers:**
   ```tsx
   const handleMouseMove = throttle((e) => { ... }, 16); // ~60fps
   ```

2. **Reduce Particle Count:**
   ```tsx
   const particleCount = window.innerWidth < 768 ? 20 : 50; // Weniger auf Mobile
   ```

3. **GPU Acceleration:**
   ```css
   .animated-element {
     transform: translateZ(0);
     will-change: transform;
   }
   ```

4. **Nur transform & opacity animieren:**
   ```tsx
   // ❌ BAD (triggert Layout):
   animate={{ width: "100px", height: "100px" }}

   // ✅ GOOD (GPU):
   animate={{ scale: 1.5, opacity: 1 }}
   ```

### Problem: "Komischer Block" zwischen Sektionen

**Lösung:**
1. **Farben matchen:**
   ```tsx
   <section className="bg-blueprint-bg-base" />
   <section className="bg-blueprint-bg-base" /> {/* GLEICHE Farbe */}
   ```

2. **Gradient hinzufügen:**
   ```tsx
   <div className="absolute bottom-0 h-16 bg-gradient-to-b from-transparent to-blueprint-bg-base" />
   ```

### Problem: Glassmorphism funktioniert nicht in Safari

**Lösung:**
```css
.glass-card {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari Prefix */
}
```

### Problem: TypeScript Errors bei Framer Motion

**Lösung:**
```tsx
// Explicit typing:
const ref = useRef<HTMLDivElement>(null);

// Motion Value typing:
const scrollYProgress = useScroll(...);
const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]); // Type inferred
```

### Problem: Lighthouse Performance < 90

**Checklist:**
- [ ] Bilder komprimiert? (WebP, < 200kb)
- [ ] Lazy Loading aktiv? (`loading="lazy"`)
- [ ] Unused CSS entfernt?
- [ ] JS Bundle < 500kb?
- [ ] Fonts optimiert? (Font-display: swap)

---

## SUCCESS METRICS

### Technische Metriken (MUSS erfüllt sein)
- [x] Lighthouse Performance > 90
- [x] Lighthouse Accessibility > 95
- [x] FPS konstant > 55
- [x] LCP < 2.5s
- [x] CLS < 0.1
- [x] Keine Console Errors

### Visuelle Metriken (User-Approval)
- [ ] "Wow"-Effekt erreicht
- [ ] Clean & modern ("geil aussehend")
- [ ] Kein "komischer Block"
- [ ] Nahtlose Übergänge
- [ ] Animationen subtil & elegant

### Funktionale Metriken
- [ ] Alle Sektionen responsive
- [ ] Keyboard Navigation funktioniert
- [ ] Screen Reader kompatibel
- [ ] Cross-Browser konsistent

---

## GESCHÄTZTER ZEITAUFWAND - FINAL

| Phase | Aufwand | Status |
|-------|---------|--------|
| 0. Vorbereitung | 30 min | ⏳ |
| 1. Globale Styles & Utilities | 2-3h | ⏳ |
| 2. Header Minimalisierung | 1h | ⏳ |
| 3. Hero Section Validierung | 3-4h | ⏳ |
| 4. Features Section Enhancement | 4-5h | ⏳ |
| 5. Neue Content-Sektionen | 8-10h | ⏳ |
| 6. Footer & Übergänge | 1-2h | ⏳ |
| 7. Testing & Performance | 3-4h | ⏳ |
| 8. Finalisierung | 1h | ⏳ |
| **TOTAL** | **23-30h** | |

---

## NEXT STEPS NACH IMPLEMENTIERUNG

1. **User-Approval einholen:**
   - Testimonials Section: Jetzt oder später?
   - Stats Zahlen: Sind sie korrekt? (500+, 10.000+, 98%)
   - Animation-Intensität: Zu viel / genau richtig / zu wenig?

2. **Echte Inhalte einfügen:**
   - Bilder (Dashboard Mockups, Feature Screenshots)
   - Testimonials (echte Kundenstimmen + Avatars)
   - Logo (hochauflösend, mehrere Größen)

3. **Testing auf Real Devices:**
   - iPhone (Safari)
   - Android (Chrome)
   - Tablet (iPad)

4. **Deployment:**
   - Merge PR
   - Deploy to Staging
   - Final QA
   - Deploy to Production

---

**ENDE DER IMPLEMENTIERUNGS-ANLEITUNG**

**Viel Erfolg, enhanced-dev! 💪**
**Keine faule Sau sein – mach es perfekt! 🚀**

---

**Erstellt von:** Enhanced UX Designer V3
**Für:** Enhanced Developer Agent
**Datum:** 2025-11-16
**Version:** 1.0 - Developer Guide
