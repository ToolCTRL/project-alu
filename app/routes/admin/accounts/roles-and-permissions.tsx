import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, MetaFunction, redirect, Outlet, useLocation, useNavigate } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import UrlUtils from "~/utils/app/UrlUtils";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { Badge } from "~/components/ui/badge";
import { ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

type LoaderData = {
  title: string;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.roles.view");
  const { t } = await getTranslations(request);

  if (UrlUtils.stripTrailingSlash(new URL(request.url).pathname) === "/admin/accounts/roles-and-permissions") {
    throw redirect("/admin/accounts/roles-and-permissions/roles");
  }

  const data: LoaderData = {
    title: `${t("models.role.plural")} | ${process.env.APP_NAME}`,
  };
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function AdminRolesRoute() {
  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (UrlUtils.stripTrailingSlash(location.pathname) === "/admin/accounts/roles-and-permissions") {
      navigate("/admin/accounts/roles-and-permissions/roles");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <main className="relative z-0 flex-1 overflow-hidden pb-10 text-white">
      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-8">
        <section className="section-shell relative overflow-hidden rounded-[var(--radius-xl,1.75rem)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-6 py-4 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))] min-h-[150px]">
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">Zugriff</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-emerald-100">{t("app.sidebar.rolesAndPermissions")}</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight">{t("app.sidebar.rolesAndPermissions")}</h1>
                <p className="text-base text-white/75">{t("settings.admin.roles.subtitle") ?? "Rollen, Berechtigungen und Zuweisungen steuern."}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/70">
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <ShieldCheck className="mr-2 h-4 w-4 text-emerald-300" />
                  RBAC
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  {t("models.permission.plural")}
                </Badge>
              </div>
            </div>

            <div className="relative ml-auto hidden h-72 w-80 shrink-0 items-center justify-center overflow-visible lg:flex">
              <div className="absolute inset-0 translate-x-16 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_70%)] blur-2xl" />
              <motion.div
                className="absolute right-[-6rem] top-[-1rem] h-[19rem] w-[19rem] text-white/75 drop-shadow-[0_14px_40px_rgba(0,0,0,0.55)]"
                aria-hidden
                animate={{
                  y: [-10, 10, -10],
                  x: [-6, 6, -6],
                  rotate: [-3, 3, -3],
                  scale: [0.97, 1.03, 0.97],
                }}
                transition={{ duration: 6.5, ease: "easeInOut", repeat: Infinity }}
              >
                <ShieldCheck className="h-full w-full" strokeWidth={1.8} />
                <motion.div
                  className="pointer-events-none absolute inset-[10%] rounded-full"
                  animate={{ opacity: [0, 0.85, 0], scale: [0.55, 1.2, 1.55] }}
                  transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
                  style={{
                    background: "radial-gradient(circle, rgba(74, 222, 128, 0.35), transparent 65%)",
                    filter: "blur(12px)",
                  }}
                />
                <motion.div
                  className="pointer-events-none absolute inset-[-8%] rounded-full"
                  animate={{ x: ["-12%", "12%", "-12%"], opacity: [0, 0.55, 0] }}
                  transition={{ duration: 2.6, ease: "easeInOut", repeat: Infinity }}
                  style={{
                    background: "linear-gradient(90deg, transparent 30%, rgba(94, 234, 212, 0.35), transparent 70%)",
                    filter: "blur(18px)",
                  }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        <EditPageLayout
          tabs={[
            { name: t("models.role.plural"), routePath: "/admin/accounts/roles-and-permissions/roles" },
            { name: t("models.permission.plural"), routePath: "/admin/accounts/roles-and-permissions/permissions" },
            { name: t("models.role.adminRoles"), routePath: "/admin/accounts/roles-and-permissions/admin-users" },
            { name: t("models.role.userRoles"), routePath: "/admin/accounts/roles-and-permissions/account-users" },
            { name: "Seed", routePath: "/admin/accounts/roles-and-permissions/seed" },
          ]}
        >
          <Outlet />
        </EditPageLayout>
      </div>
    </main>
  );
}
