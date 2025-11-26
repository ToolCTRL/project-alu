import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { ApplicationEvents } from "~/modules/events/types/ApplicationEvent";
import EventsTable from "~/modules/events/components/EventsTable";
import InputFilters from "~/components/ui/input/InputFilters";
import { getTranslations } from "~/locale/i18next.server";
import { EventWithAttempts, getEvents } from "~/modules/events/db/events.db.server";
import { adminGetAllTenantsIdsAndNames } from "~/utils/db/tenants.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { adminGetAllUsersNames } from "~/utils/db/users.db.server";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Badge } from "~/components/ui/badge";
import { Activity, Filter } from "lucide-react";

type LoaderData = {
  title: string;
  items: EventWithAttempts[];
  pagination: PaginationDto;
  filterableProperties: FilterablePropertyDto[];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.events.view");
  const { t } = await getTranslations(request);

  const urlSearchParams = new URL(request.url).searchParams;
  const current = getPaginationFromCurrentUrl(urlSearchParams);
  const filterableProperties: FilterablePropertyDto[] = [
    {
      name: "name",
      title: "Event",
      options: ApplicationEvents.map((item) => {
        return {
          value: item.value,
          name: `${item.value} - ${item.name}`,
        };
      }),
    },
    {
      name: "data",
      title: "Data",
    },
    {
      name: "tenantId",
      title: t("models.tenant.object"),
      options: [
        { name: "- No tenant -", value: "{null}" },
        ...(await adminGetAllTenantsIdsAndNames()).map((i) => {
          return { value: i.id, name: i.name };
        }),
      ],
    },
    {
      name: "userId",
      title: t("models.user.object"),
      options: (await adminGetAllUsersNames()).map((item) => {
        return {
          value: item.id,
          name: item.email,
        };
      }),
    },
  ];
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const { items, pagination } = await getEvents({ current, filters });

  const data: LoaderData = {
    title: `${t("models.event.plural")} | ${process.env.APP_NAME}`,
    items,
    pagination,
    filterableProperties,
  };
  return data;
};

export default function AdminEventsRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  return (
    <main className="relative z-0 flex-1 overflow-hidden pb-10 text-white">
      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8">
        <section className="section-shell relative overflow-hidden rounded-[var(--radius-xl,1.75rem)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-6 py-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">Steuerzentrale</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-emerald-100">{t("models.event.plural")}</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight">{t("models.event.plural")}</h1>
                <p className="text-base text-white/75">{t("settings.admin.subtitle") ?? "Logs, Hooks und Benachrichtigungen überwachen."}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/70">
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <Activity className="mr-2 h-4 w-4 text-amber-300" />
                  {data.pagination.totalItems ?? data.items.length} Events
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  {t("models.tenant.plural")}
                </Badge>
              </div>
            </div>

            <div className="relative ml-auto hidden h-72 w-72 shrink-0 items-center justify-center overflow-visible lg:flex">
              <div className="pointer-events-none absolute right-[-8rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,197,253,0.3),rgba(79,93,141,0.08)_55%,transparent_75%)] blur-3xl opacity-80" />
              <FlowNodes />
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white/70">
                <Filter className="h-4 w-4" />
                <span className="text-sm uppercase tracking-[0.28em]">Filter &amp; Aktionen</span>
              </div>
            <div className="flex items-center space-x-2">
              <InputFilters size="sm" filters={data.filterableProperties} />
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <EventsTable items={data.items} pagination={data.pagination} />
          </div>
        </section>
      </div>
    </main>
  );
}

function FlowNodes() {
  return (
    <div className="absolute right-[-3rem] top-[-2rem] h-[22rem] w-[22rem] text-white/85 drop-shadow-[0_14px_40px_rgba(0,0,0,0.55)]">
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          <linearGradient id="flowGradEvents" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(56,189,248,0.7)" />
            <stop offset="100%" stopColor="rgba(236,72,153,0.7)" />
          </linearGradient>
        </defs>
        <motion.circle
          cx="60"
          cy="80"
          r="18"
          fill="url(#flowGradEvents)"
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="140"
          cy="120"
          r="18"
          fill="url(#flowGradEvents)"
          animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
        <motion.path
          d="M60 80 C90 90 110 110 140 120"
          stroke="url(#flowGradEvents)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="8 18"
          animate={{ strokeDashoffset: [24, 0, -24] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}
