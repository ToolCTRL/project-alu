import { Link, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Badge } from "~/components/ui/badge";
import { WorkflowEngineIndexApi } from "./index.api.server";
import { Sparkles, Activity, Settings2, PlayCircle, Workflow, Shield, Zap } from "lucide-react";
import NumberUtils from "~/utils/shared/NumberUtils";

export default function WorkflowEngineIndexView() {
  const data = useLoaderData<WorkflowEngineIndexApi.LoaderData>();
  const { t } = useTranslation();
  const stats = [
    { title: "Workflows", value: data.summary.workflowsTotal, icon: <PlayCircle className="h-5 w-5" /> },
    { title: "Ausführungen", value: data.summary.executionsTotal, icon: <Activity className="h-5 w-5" /> },
    { title: "Zugangsdaten", value: data.summary.credentialsTotal, icon: <Settings2 className="h-5 w-5" /> },
    { title: "Variablen", value: data.summary.variablesTotal, icon: <Sparkles className="h-5 w-5" /> },
  ];

  const navLinks = [
    { title: "Workflows", desc: "Design & Veröffentlichung", href: "workflows", icon: <Workflow className="h-4 w-4" /> },
    { title: "Variablen", desc: "Umgebung & Secrets", href: "variables", icon: <Shield className="h-4 w-4" /> },
    { title: "Zugangsdaten", desc: "Verbindungen", href: "credentials", icon: <Settings2 className="h-4 w-4" /> },
    { title: "Ausführungen", desc: "Verlauf & Logs", href: "executions", icon: <Activity className="h-4 w-4" /> },
    { title: "Vorlagen", desc: "Starter-Flows", href: "templates", icon: <PlayCircle className="h-4 w-4" /> },
    { title: "Gefahrenzone", desc: "Danger Zone", href: "danger", icon: <Zap className="h-4 w-4" /> },
  ];

  return (
    <main className="relative z-0 flex-1 overflow-hidden pb-10 text-white">
      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8">
        <section className="section-shell relative overflow-hidden rounded-[var(--radius-xl,1.75rem)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-6 py-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">Steuerzentrale</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-emerald-100">{t("workflows.title") ?? "Workflows"}</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight">{t("workflows.title") ?? "Workflows"}</h1>
                <p className="text-base text-white/75">{t("workflows.subtitle") ?? "Automationen, Ausführungen und Ressourcen im Überblick."}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/70">
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  {data.summary.workflowsTotal} {t("workflows.title") ?? "Workflows"}
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  {data.summary.executionsTotal} Executions
                </Badge>
              </div>
            </div>

            <div className="relative ml-auto hidden h-72 w-72 shrink-0 items-center justify-center overflow-visible lg:flex">
              <div className="pointer-events-none absolute right-[-8rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,197,253,0.3),rgba(79,93,141,0.08)_55%,transparent_75%)] blur-3xl opacity-80" />
              <motion.div
                className="absolute right-[-3rem] top-[-2rem] h-[22rem] w-[22rem] text-white/85 drop-shadow-[0_14px_40px_rgba(0,0,0,0.55)]"
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              >
                <Settings2 className="h-full w-full" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">Zusammenfassung</p>
              <p className="text-white/85 text-sm">Laufende Automationen, Ausführungen und Ressourcen.</p>
            </div>
          </div>
          <dl className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <SummaryCard key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} />
            ))}
          </dl>
        </section>

        <section className="rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">Navigation</p>
              <p className="text-white/85 text-sm">Schnelle Sprünge durch Automationen & Ressourcen.</p>
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
}

function SummaryCard({ title, value, icon }: Readonly<{ title: string; value: number; icon?: React.ReactNode }>) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-white/5 px-4 py-4 text-white shadow-[0_20px_40px_rgba(7,12,20,0.35)]">
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
        {icon && <span className="rounded-xl bg-white/10 p-2 text-white">{icon}</span>}
        <span>{title}</span>
      </dt>
      <dd className="mt-2 text-3xl font-semibold tracking-tight">{NumberUtils.intFormat(value)}</dd>
    </div>
  );
}
