import type { Config } from "tailwindcss";
const colors = require("tailwindcss/colors");

const config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    // "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}", // Tremor module
  ],

  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        headline: ['Manrope', 'system-ui', 'sans-serif'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Digital Blueprint Theme Colors
        blueprint: {
          bg: {
            base: '#0f172a',      // slate-900
            elevated: '#1e293b',  // slate-800
            card: '#334155',      // slate-700
          },
          accent: {
            DEFAULT: '#a855f7',   // Purple (purple-500)
            hover: '#c084fc',     // purple-400
            glow: 'rgba(168, 85, 247, 0.2)',
            glowStrong: 'rgba(168, 85, 247, 0.4)', // NEU: Für CTA-Buttons
            // Zusätzliche Akzentfarben
            secondary: '#10b981',   // Grün für "Erfolg/Automatisierung"
            secondaryHover: '#34d399', // Grün Hover
            secondaryGlow: 'rgba(16, 185, 129, 0.2)', // Grün Glow
            tertiary: '#f59e0b',    // Orange für "Energie/Projekte"
            tertiaryHover: '#fbbf24',  // Orange Hover
            tertiaryGlow: 'rgba(245, 158, 11, 0.2)', // Orange Glow
          },
          text: {
            primary: '#f8fafc',   // slate-50
            secondary: '#cbd5e1', // slate-300
            muted: '#64748b',     // slate-500
            contrast: '#ffffff',   // NEU: Für maximale Lesbarkeit auf Glassmorphism
          },
          border: {
            DEFAULT: '#334155',   // slate-700
            subtle: '#1e293b',    // slate-800
            glow: 'rgba(168, 85, 247, 0.3)', // NEU: Purple glow für Glassmorphism-Rahmen
          },
          glass: { // NEU: Dedizierte Glassmorphism-Werte
            light: 'rgba(255, 255, 255, 0.05)',
            medium: 'rgba(255, 255, 255, 0.1)',
            strong: 'rgba(255, 255, 255, 0.15)',
            border: 'rgba(168, 85, 247, 0.3)', // NEU: Purple border
          },
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        theme: {
          50: colors.zinc[50],
          100: colors.zinc[100],
          200: colors.zinc[200],
          300: colors.zinc[300],
          400: colors.zinc[400],
          500: colors.zinc[500],
          600: colors.zinc[600],
          700: colors.zinc[700],
          800: colors.zinc[800],
          900: colors.zinc[900],
        },
        // light mode
        tremor: {
          brand: {
            faint: colors.blue[50],
            muted: colors.blue[200],
            subtle: colors.blue[400],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            inverted: colors.white,
          },
          background: {
            muted: colors.gray[50],
            subtle: colors.gray[100],
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
          content: {
            subtle: colors.gray[400],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            strong: colors.gray[900],
            inverted: colors.white,
          },
        },
        // dark mode
        "dark-tremor": {
          brand: {
            faint: "#0B1229",
            muted: colors.blue[950],
            subtle: colors.blue[800],
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[400],
            inverted: colors.blue[950],
          },
          background: {
            muted: "#131A2B",
            subtle: colors.gray[800],
            DEFAULT: colors.gray[900],
            emphasis: colors.gray[300],
          },
          border: {
            DEFAULT: colors.gray[800],
          },
          ring: {
            DEFAULT: colors.gray[800],
          },
          content: {
            subtle: colors.gray[600],
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[200],
            strong: colors.gray[50],
            inverted: colors.gray[950],
          },
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "tremor-small": "0.375rem",
        "tremor-default": "0.5rem",
        "tremor-full": "9999px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        "background-position-spin": {
          "0%": { backgroundPosition: "top center" },
          "100%": { backgroundPosition: "bottom center" },
        },
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        // Meisterwerk Animations
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(168, 85, 247, 0.4)'
          },
        },
        'pulse-slow': {
          '0%, 100%': {
            opacity: '0.1'
          },
          '50%': {
            opacity: '0.2'
          },
        },
        'shimmer': {
          '0%': {
            backgroundPosition: '200% center',
          },
          '100%': {
            backgroundPosition: '-200% center',
          },
        },
        'blob': {
          '0%, 100%': {
            transform: 'translate(0, 0) scale(1)',
          },
          '25%': {
            transform: 'translate(20px, -30px) scale(1.05)',
          },
          '50%': {
            transform: 'translate(-20px, 20px) scale(0.95)',
          },
          '75%': {
            transform: 'translate(30px, 10px) scale(1.02)',
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",

        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        backgroundPositionSpin: "background-position-spin 3000ms infinite alternate",
        scroll: "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        // Meisterwerk Animations
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 8s ease-in-out infinite',
        'blob': 'blob 12s ease-in-out infinite',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            maxWidth: "100%",
          },
        },
        dark: {
          css: {
            color: theme("colors.gray.400"),
            h1: {
              color: theme("colors.gray.50"),
            },
            "h2, h3, h4, thead th": {
              color: theme("colors.gray.200"),
            },
            "h2 small, h3 small, h4 small": {
              color: theme("colors.gray.400"),
            },
            code: {
              color: theme("colors.gray.200"),
            },
            hr: {
              borderColor: theme("colors.gray.200"),
              opacity: "0.05",
            },
            pre: {
              boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.1)",
            },
            a: {
              color: theme("colors.white"),
              borderBottomColor: theme("colors.sky.400"),
            },
            strong: {
              color: theme("colors.gray.200"),
            },
            thead: {
              color: theme("colors.gray.300"),
              borderBottomColor: "rgb(148 163 184 / 0.2)",
            },
            "tbody tr": {
              borderBottomColor: "rgb(148 163 184 / 0.1)",
            },
          },
        },
      }),
      boxShadow: {
        // light
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        // dark
        "dark-tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "dark-tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "dark-tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
  },
  // safelist: [
  //   {
  //     pattern:
  //       /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  //     variants: ["hover", "ui-selected"],
  //   },
  //   {
  //     pattern:
  //       /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  //     variants: ["hover", "ui-selected"],
  //   },
  //   {
  //     pattern:
  //       /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  //     variants: ["hover", "ui-selected"],
  //   },
  //   {
  //     pattern:
  //       /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  //   },
  //   {
  //     pattern:
  //       /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  //   },
  //   {
  //     pattern:
  //       /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  //   },
  // ],
  plugins: [
    require("@headlessui/tailwindcss"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animate"),
  ],
} satisfies Config;

export default config;
