import { LoaderFunctionArgs, MetaFunction, Link, Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Badge } from "~/components/ui/badge";
import { KeyRound, FileCode2, TerminalSquare, Gauge, Sparkles } from "lucide-react";
import { CreditTypes } from "~/modules/usage/dtos/CreditType";

type LoaderData = {
  title: string;
};

export const loader = async (_: LoaderFunctionArgs) => {
  const data: LoaderData = {
    title: `API | ${process.env.APP_NAME}`,
  };
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function AdminApiRoute() {
  const { t } = useTranslation();
  const navLinks = [
    { title: t("models.apiCall.plural"), desc: "Logs & usage", href: "logs", icon: <TerminalSquare className="h-4 w-4" /> },
    { title: t("models.apiKey.plural"), desc: "Keys & scopes", href: "keys", icon: <KeyRound className="h-4 w-4" /> },
    { title: t("models.credit.plural"), desc: "Quota & Credits", href: "credits", icon: <Gauge className="h-4 w-4" />, hidden: CreditTypes.length === 0 },
    { title: "Docs", desc: "Open docs", href: "docs", icon: <FileCode2 className="h-4 w-4" /> },
  ].filter((l) => !l.hidden);
  return (
    <main className="relative z-0 flex-1 overflow-hidden pb-10 text-white">
      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8">
        <section className="section-shell relative overflow-hidden rounded-[var(--radius-xl,1.75rem)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-6 py-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">Steuerzentrale</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-emerald-100">API</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight">API</h1>
                <p className="text-base text-white/75">Calls, Keys, Credits und Docs im Überblick.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/70">
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <Sparkles className="mr-2 h-4 w-4 text-amber-300" />
                  {t("models.apiCall.plural")}
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  {t("models.apiKey.plural")}
                </Badge>
              </div>
            </div>

            <div className="relative ml-auto hidden h-72 w-72 shrink-0 items-center justify-center overflow-visible lg:flex">
              <div className="pointer-events-none absolute right-[-8rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.25),rgba(59,130,246,0.12)_55%,transparent_75%)] blur-3xl opacity-80" />
              <ApiCircuitAnimation />
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
              <p className="text-white/85 text-sm">APIs, Keys und Credits schnell erreichen.</p>
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

function ApiCircuitAnimation() {
  return (
    <div className="absolute right-[-3rem] top-[-2rem] h-[22rem] w-[22rem] text-white/85 drop-shadow-[0_14px_40px_rgba(0,0,0,0.55)]">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="apiGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(52,211,153,0.9)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.9)" />
          </linearGradient>
        </defs>
        {/* Towers (computers) */}
        {[
          { x: 60, y: 120, h: 28, delay: 0 },
          { x: 140, y: 80, h: 32, delay: 0.4 },
          { x: 110, y: 150, h: 24, delay: 0.7 },
        ].map((p) => (
          <g key={`${p.x}-${p.y}`}>
            <motion.rect
              x={p.x - 12}
              y={p.y - p.h}
              width="24"
              height={p.h}
              rx="4"
              fill="rgba(18, 23, 38, 0.8)"
              stroke="url(#apiGrad)"
              strokeWidth="2"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            />
            <motion.rect
              x={p.x - 8}
              y={p.y - p.h + 6}
              width="16"
              height="2"
              fill="url(#apiGrad)"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: p.delay + 0.2 }}
            />
            <motion.circle
              cx={p.x}
              cy={p.y - p.h + 14}
              r="2"
              fill="url(#apiGrad)"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: p.delay + 0.4 }}
            />
          </g>
        ))}
        {/* Beams between towers */}
        <motion.line
          x1="60"
          y1="110"
          x2="140"
          y2="70"
          stroke="url(#apiGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="12 16"
          animate={{ strokeDashoffset: [40, 0, -40] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          opacity={0.9}
        />
        <motion.line
          x1="140"
          y1="70"
          x2="110"
          y2="140"
          stroke="url(#apiGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="12 16"
          animate={{ strokeDashoffset: [20, -20, -60] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          opacity={0.9}
        />
        <motion.line
          x1="60"
          y1="110"
          x2="110"
          y2="140"
          stroke="url(#apiGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="12 16"
          animate={{ strokeDashoffset: [10, -30, -70] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          opacity={0.9}
        />
        {/* Data packets */}
        {[0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx="60"
            cy="110"
            r="5"
            fill="rgba(255,255,255,0.95)"
            animate={{
              x: [0, 80, 50 * Math.cos(Math.PI / 6)],
              y: [0, -40, 30],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
          />
        ))}
      </svg>
    </div>
  );
}
