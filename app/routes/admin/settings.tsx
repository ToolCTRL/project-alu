import { LoaderFunctionArgs, useOutlet, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import IconAnalytics from "~/components/layouts/icons/IconAnalytics";
import IconKeys from "~/components/layouts/icons/IconKeys";
import CacheIcon from "~/components/ui/icons/CacheIcon";
import CookieIcon from "~/components/ui/icons/CookieIcon";
import CurrencyIcon from "~/components/ui/icons/CurrencyIcon";
import EmailIcon from "~/components/ui/icons/EmailIcon";
import ExclamationTriangleIcon from "~/components/ui/icons/ExclamationTriangleIcon";
import GearIcon from "~/components/ui/icons/GearIcon";
import UserIcon from "~/components/ui/icons/UserIcon";
import MembershipCardIcon from "~/components/ui/icons/settings/MembershipCardIcon";
import { getTranslations } from "~/locale/i18next.server";
import { ActionTile } from "~/components/ui/cards";
import { Badge } from "~/components/ui/badge";
import { Sparkles, ShieldCheck, LifeBuoy, Wrench } from "lucide-react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  return Response.json({
    title: t("app.sidebar.settings"),
    appName: process.env.APP_NAME ?? "SaasRock",
    environment: (process.env.NODE_ENV ?? "development").toUpperCase(),
  });
};

export default function AdminSettings() {
  const { t } = useTranslation();
  const outlet = useOutlet();
  const loaderData = useLoaderData<typeof loader>();

  if (outlet) {
    return outlet;
  }

  const environment = loaderData?.environment ?? "DEV";
  const appName = loaderData?.appName ?? "SaasRock";

  const items = [
    {
      name: t("settings.admin.profile.title"),
      description: t("settings.admin.profile.description"),
      href: "/admin/settings/profile",
      icon: <UserIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <UserIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.general.title"),
      description: t("settings.admin.general.description"),
      href: "/admin/settings/general",
      icon: <GearIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <GearIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.pricing.title"),
      description: t("settings.admin.pricing.description"),
      href: "/admin/settings/pricing",
      icon: <CurrencyIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <CurrencyIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.authentication.title"),
      description: t("settings.admin.authentication.description"),
      href: "/admin/settings/authentication",
      icon: <IconKeys className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <IconKeys className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.analytics.title"),
      description: t("settings.admin.analytics.description"),
      href: "/admin/settings/analytics",
      icon: <IconAnalytics className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <IconAnalytics className="size-5 shrink-0" aria-hidden="true" />,
    },
    // {
    //   name: t("settings.admin.seo.title"),
    // description: t("settings.admin.seo.description"),
    //   href: "/admin/settings/seo",
    //   icon: <MagnifyingGlassIcon className=" size-5 shrink-0" aria-hidden="true" />,
    //   iconSelected: <MagnifyingGlassIcon className=" size-5 shrink-0" aria-hidden="true" />,
    // },
    // {
    //   name: t("settings.admin.internationalization.title"),
    // description: t("settings.admin.internationalization.description"),
    //   href: "/admin/settings/internationalization",
    //   icon: <LanguageIcon className="size-5 shrink-0" aria-hidden="true" />,
    //   iconSelected: <LanguageIcon className="size-5 shrink-0" aria-hidden="true" />,
    // },
    {
      name: t("settings.admin.transactionalEmails.title"),
      description: t("settings.admin.transactionalEmails.description"),
      href: "/admin/settings/transactional-emails",
      icon: <EmailIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <EmailIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.tenants.types.title"),
      description: t("settings.admin.tenants.types.description"),
      href: "/admin/settings/accounts/types",
      icon: <MembershipCardIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <MembershipCardIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.cookies.title"),
      description: t("settings.admin.cookies.description"),
      href: "/admin/settings/cookies",
      icon: <CookieIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <CookieIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.cache.title"),
      description: t("settings.admin.cache.description"),
      href: "/admin/settings/cache",
      icon: <CacheIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <CacheIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.danger.title"),
      description: t("settings.admin.danger.description"),
      href: "/admin/settings/danger",
      icon: <ExclamationTriangleIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <ExclamationTriangleIcon className="size-5 shrink-0" aria-hidden="true" />,
      bottom: true,
    },
  ];
  return (
    <main className="relative z-0 flex-1 overflow-hidden pb-10">
      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-8 text-white">
        <section className="section-shell relative overflow-hidden rounded-[var(--radius-xl,1.75rem)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-6 py-3 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))] min-h-[170px]">
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">Control Center</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-emerald-100">Settings</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight">{t("app.sidebar.settings")}</h1>
                <p className="text-base text-white/75">{t("settings.admin.subtitle") ?? "Grundkonfiguration, Sicherheit und Kommunikation."}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/70">
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <Sparkles className="mr-2 h-4 w-4 text-amber-300" />
                  {appName}
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <ShieldCheck className="mr-2 h-4 w-4 text-emerald-300" />
                  {environment}
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <LifeBuoy className="mr-2 h-4 w-4 text-sky-300" />
                  {t("shared.status") ?? "Status"}: {t("shared.active") ?? "Active"}
                </Badge>
              </div>
            </div>

            <div className="relative ml-auto hidden h-72 w-72 shrink-0 items-center justify-center lg:flex overflow-visible">
              <div className="absolute inset-0 translate-x-20 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_70%)] blur-2xl" />
              <div
                className="absolute right-[-8rem] top-[-1rem] h-[22rem] w-[22rem] text-white/60"
                style={{ animation: "spin 18s linear infinite" }}
                aria-hidden
              >
                <GearIcon className="h-full w-full drop-shadow-[0_14px_40px_rgba(0,0,0,0.55)]" />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <ActionTile
              key={item.href}
              title={item.name}
              description={item.description}
              hint="Module"
              icon={item.icon}
              href={item.href}
              tone={item.href.includes("danger") ? "outline" : "accent"}
              actionLabel={item.href.includes("danger") ? t("shared.open") : t("shared.manage") ?? "Öffnen"}
            />
          ))}
        </section>

        <section className="rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-white/5 p-4 shadow-[var(--shadow-soft,0px_20px_40px_rgba(7,12,20,0.35))]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">{t("shared.shortcuts") ?? "Shortcuts"}</p>
              <div className="flex flex-wrap gap-2 text-sm text-white/80">
                <a className="rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:border-white/30" href="/admin/accounts/users">
                  {t("models.user.plural")}
                </a>
                <a className="rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:border-white/30" href="/admin/api">
                  API
                </a>
                <a className="rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:border-white/30" href="/admin/email-marketing">
                  Emails
                </a>
                <a className="rounded-full border border-white/15 bg-white/5 px-3 py-1 hover:border-white/30" href="/admin/analytics">
                  Analytics
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
