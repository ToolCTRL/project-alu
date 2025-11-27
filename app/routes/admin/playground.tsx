import { LoaderFunctionArgs, MetaFunction, Link, Outlet } from "react-router";
import { motion } from "framer-motion";
import { Sparkles, Beaker, Database, MessageSquare, Code, Wand2 } from "lucide-react";

type LoaderData = {
  title: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const data: LoaderData = {
    title: `Playground | ${process.env.APP_NAME}`,
  };
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function AdminPlaygroundRoute() {
  const navLinks = [
    { title: "Einführung", desc: "Hier starten", href: " ", icon: <Wand2 className="h-4 w-4" /> },
    { title: "CRUD-Beispiele", desc: "Daten-Basics", href: "crud", icon: <Database className="h-4 w-4" /> },
    { title: "Langläufer", desc: "Hintergrundjobs", href: "long-running-tasks", icon: <Beaker className="h-4 w-4" /> },
    { title: "Supabase Storage", desc: "Buckets & Dateien", href: "supabase/storage/buckets", icon: <Database className="h-4 w-4" /> },
    { title: "ChatGPT", desc: "OpenAI-Demos", href: "ai/openai/chatgpt", icon: <MessageSquare className="h-4 w-4" /> },
    { title: "Monaco Editor", desc: "Code-Editor", href: "monaco-editor", icon: <Code className="h-4 w-4" /> },
    { title: "Novel Editor", desc: "Rich Text", href: "novel-editor", icon: <Sparkles className="h-4 w-4" /> },
    { title: "Row Repositories & Models", desc: "Daten-Layer", href: "repositories-and-models", icon: <Database className="h-4 w-4" /> },
    { title: "Handlebars.js", desc: "Vorlagen", href: "handlebars", icon: <Sparkles className="h-4 w-4" /> },
    { title: "Chat", desc: "Chat-Spielwiese", href: "chat", icon: <MessageSquare className="h-4 w-4" /> },
  ];
  return (
    <main className="relative z-0 flex-1 overflow-hidden pb-10 text-white">
      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8">
        <section className="section-shell relative overflow-hidden rounded-[var(--radius-xl,1.75rem)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-6 py-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">Playground</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-emerald-100">Experimente</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight">Playground</h1>
                <p className="text-base text-white/75">Demos, Editor-Tests und API-Spielwiese.</p>
              </div>
            </div>
            <div className="relative ml-auto hidden h-72 w-72 shrink-0 items-center justify-center overflow-visible lg:flex">
              <div className="pointer-events-none absolute right-[-8rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,197,253,0.3),rgba(79,93,141,0.08)_55%,transparent_75%)] blur-3xl opacity-80" />
              <MagicOrbit />
            </div>
          </div>
        </section>

        <div className="rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="border-border overflow-hidden rounded-lg border-2 border-dashed bg-white/5">
            <Outlet />
          </div>
        </div>

        <section className="rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">Navigation</p>
              <p className="text-white/85 text-sm">Springe direkt in Demos und Tools.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                relative="path"
                className="group relative overflow-hidden rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-white/5 p-4 text-white shadow-[0_20px_40px_rgba(7,12,20,0.35)] transition hover:border-white/25 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-white/10 p-2 text-white">{item.icon}</span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-white/70">{item.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

function MagicPulse() {
  return (
    <div className="absolute right-[-3rem] top-[-2rem] h-[22rem] w-[22rem] text-white/85 drop-shadow-[0_14px_40px_rgba(0,0,0,0.55)]">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="magicGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(167,139,250,0.8)" />
            <stop offset="100%" stopColor="rgba(52,211,153,0.7)" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="100"
          cy="100"
          r="12"
          fill="url(#magicGrad)"
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="100"
            cy="100"
            r={38 + i * 14}
            fill="none"
            stroke="url(#magicGrad)"
            strokeWidth="3"
            strokeDasharray="10 12"
            animate={{ rotate: i % 2 === 0 ? [0, 120, 240, 360] : [0, -120, -240, -360] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "linear" }}
            opacity={0.4 - i * 0.08}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`spark-${i}`}
            cx="100"
            cy="100"
            r="6"
            fill="url(#magicGrad)"
            animate={{
              x: [0, Math.cos((i * 2 * Math.PI) / 3) * 50, Math.cos((i * 2 * Math.PI) / 3) * 50],
              y: [0, Math.sin((i * 2 * Math.PI) / 3) * 50, Math.sin((i * 2 * Math.PI) / 3) * 50],
              opacity: [0.8, 0.4, 0.8],
            }}
            transition={{ duration: 2.4 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}

function MagicOrbit() {
  return (
    <div className="absolute right-[-3rem] top-[-2rem] h-[22rem] w-[22rem] text-white/85 drop-shadow-[0_14px_40px_rgba(0,0,0,0.55)]">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(147,197,253,0.9)" />
            <stop offset="100%" stopColor="rgba(236,72,153,0.85)" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="100"
          cy="100"
          r="10"
          fill="url(#orbitGrad)"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="100"
            cy="100"
            r={30 + i * 14}
            fill="none"
            stroke="url(#orbitGrad)"
            strokeWidth="4"
            strokeDasharray="6 10"
            animate={{ rotate: i % 2 === 0 ? [0, 180, 360] : [0, -180, -360] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: "linear" }}
            opacity={0.5 - i * 0.1}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={`orb-${i}`}
            cx="100"
            cy="100"
            r="6"
            fill="url(#orbitGrad)"
            animate={{
              x: [0, Math.cos((i * 2 * Math.PI) / 3) * 55, Math.cos((i * 2 * Math.PI) / 3) * 55],
              y: [0, Math.sin((i * 2 * Math.PI) / 3) * 55, Math.sin((i * 2 * Math.PI) / 3) * 55],
              opacity: [0.9, 0.4, 0.9],
            }}
            transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </svg>
    </div>
  );
}
