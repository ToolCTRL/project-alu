import { useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ActionFunctionArgs, Link, LoaderFunctionArgs, MetaFunction, useActionData, useLoaderData } from "react-router";
import { adminGetAllUsers, getUser, updateUserPassword, UserWithDetails } from "~/utils/db/users.db.server";
import { createUserSession, getUserInfo, setLoggedUser } from "~/utils/session.server";
import { getTranslations } from "~/locale/i18next.server";
import bcrypt from "bcryptjs";
import UsersTable from "~/components/core/users/UsersTable";
import { deleteUserWithItsTenants } from "~/utils/services/userService";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { useAdminData } from "~/utils/data/useAdminData";
import InputFilters from "~/components/ui/input/InputFilters";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { adminGetAllTenantsIdsAndNames, getTenant } from "~/utils/db/tenants.db.server";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { Log } from "@prisma/client";
import { getLastUserLog } from "~/utils/db/logs.db.server";
import { useNavigate, useOutlet } from "react-router";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { ActionTile } from "~/components/ui/cards";
import { Badge } from "~/components/ui/badge";
import { ShieldCheck, Users as UsersIcon, Clock3, UserPlus, ShieldHalf, KeySquare, ActivitySquare } from "lucide-react";
export { serverTimingHeaders as headers } from "~/modules/metrics/utils/defaultHeaders.server";

// export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];
export const meta = ({ data }: { data: LoaderData }) => [{ title: data.title }];

type LoaderData = {
  title: string;
  items: UserWithDetails[];
  filterableProperties: FilterablePropertyDto[];
  pagination: PaginationDto;
  lastLogs: { userId: string; log: Log }[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "admin.users");
  await time(verifyUserHasPermission(request, "admin.users.view"), "verifyUserHasPermission");
  let { t } = await getTranslations(request);

  const filterableProperties: FilterablePropertyDto[] = [
    { name: "email", title: t("models.user.email") },
    { name: "firstName", title: t("models.user.firstName") },
    { name: "lastName", title: t("models.user.lastName") },
    {
      name: "tenantId",
      title: t("models.tenant.object"),
      manual: true,
      options: (await adminGetAllTenantsIdsAndNames()).map((tenant) => {
        return {
          value: tenant.id,
          name: tenant.name,
        };
      }),
    },
    {
      name: "lastLogin",
      title: "Has logged in",
      manual: true,
      options: [
        {
          value: "last-24-hours", // days
          name: t("app.shared.periods.LAST_24_HOURS"),
        },
        {
          value: "last-7-days", // days
          name: t("app.shared.periods.LAST_WEEK"),
        },
        {
          value: "last-30-days", // days
          name: t("app.shared.periods.LAST_30_DAYS"),
        },
        {
          value: "last-3-months", // months
          name: t("app.shared.periods.LAST_3_MONTHS"),
        },
        {
          value: "last-6-months", // months
          name: t("app.shared.periods.LAST_N_MONTHS", { 0: "6" }),
        },
        {
          value: "last-year", // months
          name: t("app.shared.periods.LAST_YEAR"),
        },
      ],
    },
    {
      name: "isAdmin",
      title: "Is admin",
      manual: true,
      isBoolean: true,
      hideSearch: true,
    },
  ];
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
  const { items, pagination } = await time(adminGetAllUsers(filters, currentPagination), "adminGetAllUsers");

  const lastLogs = (
    await time(
      Promise.all(
        items.map(async (user) => {
          const log = await getLastUserLog(user.id);
          return log ? { userId: user.id, log } : null;
        })
      ),
      "getLastUserLog"
    )
  )
    .filter((entry) => entry !== null)
    .map((entry) => entry as { userId: string; log: Log });

  const data: LoaderData = {
    title: `${t("models.user.plural")} | ${process.env.APP_NAME}`,
    items,
    filterableProperties,
    pagination,
    lastLogs,
  };
  return Response.json(data, { headers: getServerTimingHeader() });
};

type ActionData = {
  error?: string;
  success?: string;
};
const success = (data: ActionData) => Response.json(data, { status: 200 });
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action = async ({ request }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.users.view");
  const userInfo = await getUserInfo(request);
  const { t } = await getTranslations(request);

  const form = await request.formData();
  const action = form.get("action")?.toString();
  const userId = form.get("user-id")?.toString();
  const user = await getUser(userId);

  if (!userId || !user || !action) {
    return badRequest({ error: "Form not submitted correctly." });
  }
  switch (action) {
    case "impersonate": {
      await verifyUserHasPermission(request, "admin.users.impersonate");
      const userSession = await setLoggedUser(user);
      if (!userSession) {
        return badRequest({
          error: t("shared.notFound"),
        });
      }
      const tenant = await getTenant(userSession.defaultTenantId);
      return createUserSession(
        {
          ...userInfo,
          ...userSession,
          impersonatingFromUserId: userInfo.userId,
        },
        tenant ? `/app/${tenant.slug ?? tenant.id}/dashboard` : "/app"
      );
    }
    case "change-password": {
      await verifyUserHasPermission(request, "admin.users.changePassword");
      const passwordNew = form.get("password-new")?.toString();
      if (!passwordNew || passwordNew.length < 8) {
        return badRequest({ error: "Set a password with 8 characters minimum" });
      } else if (user?.admin) {
        return badRequest({ error: "You cannot change password for admin user" });
      }

      const passwordHash = await bcrypt.hash(passwordNew, 10);
      await updateUserPassword({ passwordHash }, user?.id);

      return success({ success: t("shared.updated") });
    }
    case "delete-user": {
      await verifyUserHasPermission(request, "admin.users.delete");
      // TODO: CANCEL TENANTS SUBSCRIPTIONS, DELETE TENANTS AND SUBSCRIPTIONS
      try {
        await deleteUserWithItsTenants(userId);
      } catch (e: any) {
        return badRequest({
          error: e,
        });
      }
      return success({ success: t("shared.deleted") });
    }
    default: {
      return badRequest({ error: "Form not submitted correctly." });
    }
  }
};

export default function AdminUsersRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const adminData = useAdminData();
  const outlet = useOutlet();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = data.items.length;
    const admins = data.items.filter((user) => user.admin).length;
    const now = Date.now();
    const recentThreshold = 7 * 24 * 60 * 60 * 1000;
    const recentActive = (data.lastLogs ?? []).filter((entry) => {
      const createdAt = entry.log?.createdAt ? new Date(entry.log.createdAt).getTime() : 0;
      return createdAt > 0 && now - createdAt <= recentThreshold;
    }).length;
    return { total, admins, recentActive };
  }, [data.items, data.lastLogs]);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <main className="relative z-0 flex-1 overflow-hidden pb-10">
      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8 text-white">
        <section className="section-shell relative overflow-hidden rounded-[var(--radius-xl,1.75rem)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">Konten &amp; Benutzer</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-emerald-100">Live</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight">{t("models.user.plural")}</h1>
                <p className="text-base text-white/75">{t("app.users.accountsAndRoles")}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/70">
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <ShieldCheck className="mr-2 h-4 w-4 text-emerald-300" />
                  {t("app.sidebar.rolesAndPermissions")}
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <Clock3 className="mr-2 h-4 w-4 text-sky-300" />
                  {t("shared.lastActivity")}
                </Badge>
              </div>
            </div>

            <div className="relative ml-auto hidden h-72 w-72 shrink-0 items-center justify-center overflow-visible lg:flex">
              <style>
                {`@keyframes usersLoop {
                    0% { opacity: 0; transform: translate(220px, 0); }
                    12% { opacity: 1; transform: translate(0, 0); }
                    62% { opacity: 1; transform: translate(0, 0); }
                    74% { opacity: 1; transform: translate(0, 360px); }
                    78% { opacity: 0; transform: translate(0, 420px); }
                    100% { opacity: 0; transform: translate(220px, 0); }
                  }
                  @keyframes usersShake {
                    0% { transform: translate(0,0); }
                    50% { transform: translate(4px,-3px); }
                    100% { transform: translate(-3px,2px); }
                  }`}
              </style>
              <div
                className="absolute right-[-11rem] top-[-4rem] flex h-[30rem] w-[42rem] items-start justify-end gap-12 overflow-visible"
                style={{
                  opacity: 0,
                  animation: "usersLoop 3s ease-in-out 0s infinite",
                }}
              >
                {[0, 1].map((index) => {
                  const xOffsets = [0, -160];
                  const palette = ["#eef3ff", "#d5e6ff"];
                  return (
                    <div
                      key={index}
                      className="relative h-[30rem] w-[30rem]"
                      style={{ transform: `translate(${xOffsets[index]}px, 0)` }}
                      aria-hidden
                    >
                      <div className="absolute inset-0 scale-[1.08] text-white/25 blur-[6px]" style={{ animation: "usersShake 1.4s ease-in-out infinite alternate" }}>
                        <UsersIcon className="h-full w-full drop-shadow-[0_14px_40px_rgba(0,0,0,0.35)]" />
                      </div>
                      <div
                        className="relative h-full w-full"
                        style={{
                          animation: "usersShake 1.4s ease-in-out infinite alternate",
                          color: palette[index],
                          filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.55))",
                        }}
                      >
                        <UsersIcon className="h-full w-full" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="grid gap-4 md:grid-cols-2">
              <ActionTile
                title={t("shared.new")}
                description="Neuen Benutzer sofort anlegen"
                hint="Schnellaktion"
                icon={<UserPlus className="h-5 w-5" />}
                href="new"
                actionLabel={t("shared.open")}
              />
              <ActionTile
                title={t("app.sidebar.rolesAndPermissions")}
                description="Rollen & Rechte zuweisen"
                hint="Zugriff"
                icon={<ShieldCheck className="h-5 w-5" />}
                href="/admin/accounts/roles-and-permissions"
                tone="neutral"
                actionLabel={t("shared.manage")}
              />
              <ActionTile
                title="Audit Trails"
                description="Letzte Aktivitäten prüfen"
                hint="Sicherheit"
                icon={<KeySquare className="h-5 w-5" />}
                href="/admin/audit-trails"
                tone="outline"
                actionLabel={t("shared.open")}
                className="md:col-span-2"
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-white/5 p-4 shadow-[var(--shadow-soft,0px_20px_40px_rgba(7,12,20,0.35))]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Filter</p>
                  <p className="text-sm text-white/80">Suchen und filtern</p>
                </div>
                <Badge variant="outline" className="border-white/20 bg-white/10 text-white/80">
                  {data.pagination.totalItems ?? data.items.length} Ergebnisse
                </Badge>
              </div>
              <div className="mt-3">
                <InputFilters size="sm" filters={data.filterableProperties} />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{t("models.user.plural")}</p>
              <h2 className="text-xl font-semibold text-white">{t("app.users.accountsAndRoles")}</h2>
            </div>
            <div className="flex items-center gap-2">
              <Button asChild type="button" variant="secondary" size="sm" className="border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20">
                <Link to="new">{t("shared.new")}</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <UsersTable
              items={data.items}
              canImpersonate={getUserHasPermission(adminData, "admin.users.impersonate")}
              canChangePassword={getUserHasPermission(adminData, "admin.users.changePassword")}
              canDelete={getUserHasPermission(adminData, "admin.users.delete")}
              canSetUserRoles={adminData.isSuperAdmin}
              pagination={data.pagination}
              lastLogs={data.lastLogs}
            />
          </div>
        </section>
      </div>

      <SlideOverWideEmpty
        open={!!outlet}
        onClose={() => {
          navigate(".", { replace: true });
        }}
        className="sm:max-w-sm"
        overflowYScroll={true}
      >
        <div className="-mx-1 -mt-3">
          <div className="space-y-4">{outlet}</div>
        </div>
      </SlideOverWideEmpty>
    </main>
  );
}
