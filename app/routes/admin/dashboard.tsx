import { ReactNode, useEffect, useMemo, useState } from "react";
import { LoaderFunctionArgs, Link, useLoaderData, useSearchParams } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { DashboardStats } from "~/components/ui/stats/DashboardStats";
import { getAdminDashboardStats } from "~/utils/services/adminDashboardService";
import { getSetupSteps } from "~/utils/services/setupService";
import SetupSteps from "~/components/admin/SetupSteps";
import ProfileBanner from "~/components/app/ProfileBanner";
import { adminGetAllTenantsWithUsage, TenantWithUsage } from "~/utils/db/tenants.db.server";
import TenantsTable from "~/components/core/tenants/TenantsTable";
import { SetupItem } from "~/application/dtos/setup/SetupItem";
import { Stat } from "~/application/dtos/stats/Stat";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { useTranslation } from "react-i18next";
import PeriodHelper, { defaultPeriodFilter, PeriodFilters } from "~/utils/helpers/PeriodHelper";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import { promiseHash } from "~/utils/promises/promiseHash";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import InputSelect from "~/components/ui/input/InputSelect";
import { requireAuth } from "~/utils/loaders.middleware";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
import { useFeatureFlag } from "~/hooks/useFeatureFlag";
import { UI_REFRESH_FLAG_GROUPS } from "~/application/featureFlags/constants";
import { KpiCard, ActionTile } from "~/components/ui/cards";
import { Activity, ClipboardList, ChevronLeft, ChevronRight, Hammer, Radar, Sparkles, UserPlus } from "lucide-react";
import { StatChange } from "~/application/dtos/stats/StatChange";
import { use3DTilt } from "~/hooks/use3DTilt";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<LoaderData> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  stats: Stat[];
  setupSteps: SetupItem[];
  tenants: {
    items: TenantWithUsage[];
    pagination: PaginationDto;
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "admin.dashboard");
  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);

  const { t } = await time(getTranslations(request), "getTranslations");
  const { stats, setupSteps, tenants } = await time(
    promiseHash({
      stats: time(
        getAdminDashboardStats({ gte: PeriodHelper.getGreaterThanOrEqualsFromRequest({ request }) }),
        "admin.dashboard.details.getAdminDashboardStats"
      ),
      setupSteps: time(getSetupSteps(), "admin.dashboard.details.getSetupSteps"),
      tenants: time(adminGetAllTenantsWithUsage(undefined, currentPagination), "admin.dashboard.details.adminGetAllTenantsWithUsage"),
    }),
    "admin.dashboard.details"
  );

  const data: LoaderData = {
    title: `${t("app.sidebar.dashboard")} | ${process.env.APP_NAME}`,
    stats,
    setupSteps,
    tenants,
  };
  return Response.json(data, { headers: getServerTimingHeader() });
};

export default function AdminNavigationRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const appOrAdminData = useAppOrAdminData();
  const [searchParams, setSearchParams] = useSearchParams();
  const userName = appOrAdminData.user?.firstName ?? appOrAdminData.user?.name ?? appOrAdminData.user?.email ?? undefined;
  // Force refresh while stabilizing design
  const isUiRefresh = true;

  if (isUiRefresh) {
    return <AdminDashboardRefresh data={data} t={t} searchParams={searchParams} setSearchParams={setSearchParams} userName={userName} />;
  }

  // fallback to classic layout if ever needed
  return (
    <main className="relative z-0 flex-1 pb-8">
      <div className="bg-background lg:border-border hidden shadow-xs md:block lg:border-t">
        <ProfileBanner user={appOrAdminData.user} />
      </div>
      <div className="mx-auto grid max-w-5xl gap-5 px-4 py-5 sm:px-8">
        {getUserHasPermission(appOrAdminData, "admin.dashboard.view") ? (
          <div className="space-y-5 overflow-hidden">
            <div className="overflow-x-auto">
              {data.setupSteps.filter((f) => f.completed).length < data.setupSteps.length && <SetupSteps items={data.setupSteps} />}
            </div>
            <div className="space-y-3 truncate p-1">
              <div className="flex items-center justify-between space-x-2">
                <h3 className="text-foreground grow font-medium leading-4">{t("app.dashboard.summary")}</h3>
                <div>
                  <InputSelect
                    className="w-44"
                    name="period"
                    value={searchParams.get("period")?.toString() ?? defaultPeriodFilter}
                    options={PeriodFilters.map((f) => {
                      return { value: f.value, name: t(f.name) };
                    })}
                    setValue={(value) => {
                      if (value) searchParams.set("period", value?.toString() ?? "");
                      else searchParams.delete("period");
                      setSearchParams(searchParams);
                    }}
                  />
                </div>
              </div>
              <DashboardStats items={data.stats} />
            </div>
            <div className="space-y-4 overflow-x-auto p-1">
              <div className="flex items-center justify-between space-x-2">
                <h3 className="text-foreground font-medium leading-4">{t("models.tenant.plural")}</h3>
                <ButtonSecondary to="/admin/accounts">{t("shared.viewAll")}</ButtonSecondary>
              </div>
              <TenantsTable items={data.tenants.items} pagination={data.tenants.pagination} />
            </div>
          </div>
        ) : (
          <div className="font-medium">You don't have permission to view the dashboard.</div>
        )}
      </div>
    </main>
  );
}

type AdminDashboardRefreshProps = {
  data: LoaderData;
  t: ReturnType<typeof useTranslation>["t"];
  searchParams: URLSearchParams;
  setSearchParams: ReturnType<typeof useSearchParams>[1];
  userName?: string;
};

function AdminDashboardRefresh({ data, t, searchParams, setSearchParams, userName }: AdminDashboardRefreshProps) {
  const periodValue = searchParams.get("period")?.toString() ?? defaultPeriodFilter;
  const stats = data.stats.slice(0, 3);
  const pendingSteps = data.setupSteps.filter((step) => !step.completed);
  const periodLabel = t(PeriodFilters.find((filter) => filter.value === periodValue)?.name ?? "app.dashboard.summary");
  const quickActions = [
    { title: "Kunde anlegen", description: "Neuen Lead oder Partner sofort erfassen", href: "/admin/accounts/users", icon: <UserPlus className="h-5 w-5" />, hint: "CRM" },
    { title: "Auftrag starten", description: "Stammdaten, Angebote und Checklisten", href: "/admin/entities", icon: <Hammer className="h-5 w-5" />, hint: "Workflows" },
    { title: "Workflow auslösen", description: "Automationen direkt aus dem Board starten", href: "/admin/workflows", icon: <Sparkles className="h-5 w-5" />, hint: "Automation" },
    { title: "Ticket erfassen", description: "Servicefall mit SLA & Timeline anlegen", href: "/admin/help-desk", icon: <ClipboardList className="h-5 w-5" />, hint: "Support" },
  ];

  const quickSignals = [
    { label: "Aktive Mandanten", value: data.tenants.items.length.toString(), detail: "Live-Instanzen", icon: <Radar className="h-4 w-4" /> },
    { label: "Setup-Status", value: pendingSteps.length > 0 ? `${pendingSteps.length} offen` : "Fertig", detail: pendingSteps.length > 0 ? "Guided" : "Bereit", icon: <ClipboardList className="h-4 w-4" />, tone: pendingSteps.length > 0 ? "warning" : "positive" },
    { label: "Automationen", value: stats[0]?.change ?? "Stabil", detail: "Trend vs. vorher", icon: <Activity className="h-4 w-4" /> },
  ];

  const [quickActionIndex, setQuickActionIndex] = useState(0);
  const quickAction =
    quickActions.length > 0 ? quickActions[((quickActionIndex % quickActions.length) + quickActions.length) % quickActions.length] : undefined;
  const cycleQuickAction = (direction: number) =>
    setQuickActionIndex((prev) => {
      if (quickActions.length === 0) return 0;
      const next = (prev + direction + quickActions.length) % quickActions.length;
      return next;
    });
  const [now, setNow] = useState<Date>();
  const [sessionStart] = useState<Date>(() => new Date());
  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  const elapsed = useMemo(() => {
    if (!now) return "--:--:--";
    const diffMs = now.getTime() - sessionStart.getTime();
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  }, [now, sessionStart]);

  return (
    <main className="relative z-0 flex-1 overflow-hidden pb-10">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-7 px-4 py-8 text-white">
        <section className="section-shell relative overflow-hidden rounded-[var(--radius-xl,1.75rem)] border border-white/10 p-6">
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">Command Center</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-emerald-100">Live Dashboard</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight lg:text-4xl">{`Willkommen zurück${userName ? `, ${userName}.` : ","}`}</h1>
                <p className="text-base text-white/75">KPI-Übersicht, Workflows und Kundenlage in Echtzeit.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/70">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  Automation stabil
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                  <Radar className="h-4 w-4 text-sky-300" />
                  Service Monitoring aktiv
                </span>
                {pendingSteps.length > 0 && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-amber-500/10 px-3 py-1 text-amber-100">
                    <ClipboardList className="h-4 w-4" />
                    {pendingSteps.length} Setup offen
                  </span>
                )}
              </div>
            </div>

            <div className="ml-auto grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
              {quickSignals.map((signal) => (
                <SignalPill key={signal.label} {...signal} />
              ))}
              <div className="flex items-center justify-between rounded-[1rem] border border-white/10 bg-white/5 px-4 py-3">
                <div className="space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">Zeitraum</p>
                  <p className="text-sm font-semibold text-white/90">{periodLabel}</p>
                </div>
                <InputSelect
                  className="w-36 text-white"
                  name="period"
                  value={periodValue}
                  options={PeriodFilters.map((filter) => ({ value: filter.value, name: t(filter.name) }))}
                  setValue={(value) => {
                    if (value) searchParams.set("period", value?.toString() ?? "");
                    else searchParams.delete("period");
                    setSearchParams(searchParams);
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid items-stretch gap-4 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-8">
            <div className="min-h-[420px] rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">KPIs</p>
                  <h2 className="text-xl font-semibold text-white">Performance Snapshot</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Live</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat, index) => (
                  <KpiCard
                    key={stat.name}
                    title={stat.name}
                    value={stat.stat}
                    subtitle={stat.hint}
                    badge={index === 0 ? "Aufträge" : index === 1 ? "Pipeline" : "Service"}
                    icon={[<ClipboardList key="kpi-0" className="h-5 w-5" />, <Hammer key="kpi-1" className="h-5 w-5" />, <Sparkles key="kpi-2" className="h-5 w-5" />][index % 3]}
                    delta={{
                      value: stat.change ?? "0%",
                      direction: stat.changeType === StatChange.Decrease ? "down" : stat.changeType === StatChange.Equal ? "flat" : "up",
                      label: "vs. vorher",
                    }}
                    sparkline={[14, 18, 17, 20, 24, 23, 28].slice(index, index + 5)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="flex min-h-[420px] flex-col gap-4 rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/60">Workflows</p>
                  <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70">Live</span>
                  <span className="rounded-full bg-white/10 px-2 py-1 font-semibold">
                    {quickActionIndex + 1}/{quickActions.length}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="grid grid-cols-2 gap-3 text-sm text-white/75">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">Laufzeit</p>
                    <AnimatePresence mode="popLayout">
                      <motion.p key={elapsed} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18, ease: "easeOut" }} className="text-2xl font-semibold tabular-nums text-white">
                        {elapsed}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-xs text-white/60">Seit Login aktiv</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">Aktuelle Zeit</p>
                    <AnimatePresence mode="popLayout">
                      <motion.p
                        key={now ? now.toISOString() : "no-time"}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="text-lg font-semibold text-cyan-100"
                      >
                        {now ? now.toLocaleTimeString() : "—"}
                      </motion.p>
                    </AnimatePresence>
                    <p className="text-xs text-white/60">{now ? now.toLocaleDateString() : "Datum"}</p>
                  </div>
                </div>
              </div>

              <div className="relative grow overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/10 via-white/5 to-transparent pointer-events-none" />
                <div className="flex h-full flex-col gap-3 p-4">
                  {quickAction && (
                    <div className="relative">
                      <ActionTile {...quickAction} className="min-h-[150px] border-white/10 bg-white/5 pr-12 text-left shadow-none" disableTilt />
                      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2 rounded-xl bg-white/5 p-1">
                        <button
                          type="button"
                          className="rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:border-white/20 hover:bg-white/20"
                          onClick={() => cycleQuickAction(-1)}
                          aria-label="Vorherige Aktion"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-white/10 bg-white/10 p-2 text-white transition hover:border-white/20 hover:bg-white/20"
                          onClick={() => cycleQuickAction(1)}
                          aria-label="Nächste Aktion"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <TopCustomersCard tenants={data.tenants.items} className="section-shell mt-2" />
      </div>
    </main>
  );
}

function TopCustomersCard({ tenants, className }: { tenants: TenantWithUsage[]; className?: string }) {
  const { handleMouseMove, handleMouseLeave } = use3DTilt({ maxAngle: 2 });
  const topTenants = tenants.slice(0, 5);
  const maxRows = Math.max(...topTenants.map((tenant) => tenant._count?.rows ?? 0), 1);
  return (
    <section
      className={clsx(
        "relative overflow-hidden rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-[0px_18px_36px_rgba(7,12,20,0.35)] transition-transform duration-200 will-change-transform",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(59,130,246,0.15),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(249,115,22,0.18),transparent_40%)]" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-white/60">Accounts</p>
          <h3 className="text-lg font-semibold text-white">Top Kunden</h3>
          <p className="text-sm text-white/60">Umsatzstarke Mandanten & offene Fälle</p>
        </div>
        <Link to="/admin/accounts" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
          Alle Accounts
        </Link>
      </div>
      {topTenants.length === 0 ? (
        <p className="relative mt-6 text-sm text-white/70">Noch keine Kunden aktiv.</p>
      ) : (
        <ul className="relative mt-4 space-y-3">
          {topTenants.map((tenant, index) => {
            const progress = Math.max(10, Math.min(100, Math.round(((tenant._count?.rows ?? 0) / maxRows) * 100)));
            return (
              <li key={tenant.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <TenantAvatar tenant={tenant} />
                    <div>
                      <p className="font-medium text-white">{tenant.name}</p>
                      <p className="text-xs text-white/60">{tenant.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/70">
                    <span className="rounded-full bg-white/5 px-2 py-1">{tenant._count?.users ?? 0} Nutzer</span>
                    <span className="rounded-full bg-white/5 px-2 py-1">{tenant._count?.rows ?? 0} Vorgänge</span>
                    <Link to={`/admin/accounts/${tenant.id}`} className="text-[11px] font-semibold text-white/90 underline-offset-4 hover:underline">
                      Öffnen
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-white/70">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[11px] font-semibold">#{index + 1}</span>
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between text-xs text-white/70">
                      <span>Auftragsvolumen</span>
                      <span className="font-semibold text-white/90">{tenant._count?.rows ?? 0} Vorgänge</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <span className="block h-full rounded-full bg-gradient-to-r from-orange-400/80 via-amber-300/60 to-sky-300/70" style={{ width: `${progress}%` }}></span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function TenantAvatar({ tenant }: { tenant: TenantWithUsage }) {
  const initials = tenant.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (tenant.icon) {
    return <img src={tenant.icon} alt={tenant.name} className="h-10 w-10 rounded-full border border-white/10 object-cover" />;
  }
  return <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">{initials}</div>;
}

type SignalPillProps = { label: string; value: string; detail: string; icon?: ReactNode; tone?: "accent" | "warning" | "positive" };
function SignalPill({ label, value, detail, icon, tone = "accent" }: SignalPillProps) {
  const toneClasses: Record<NonNullable<SignalPillProps["tone"]>, string> = {
    accent: "border-white/10 bg-white/5",
    warning: "border-amber-300/30 bg-amber-500/10",
    positive: "border-emerald-300/30 bg-emerald-500/10",
  };
  return (
    <div className={`flex items-center justify-between gap-3 rounded-[1rem] border px-4 py-3 ${toneClasses[tone]}`}>
      <div className="space-y-0.5">
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
        <p className="text-xs text-white/70">{detail}</p>
      </div>
      {icon && <div className="rounded-2xl bg-white/10 p-2 text-white">{icon}</div>}
    </div>
  );
}
