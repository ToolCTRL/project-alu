import { useMemo, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from "react-router";
import { adminGetAllTenantsWithUsage, createTenantUser, TenantSimple, TenantWithUsage, updateTenantDeactivated } from "~/utils/db/tenants.db.server";
import { getTranslations } from "~/locale/i18next.server";
import TenantsTable from "~/components/core/tenants/TenantsTable";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import InputFilters from "~/components/ui/input/InputFilters";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { adminGetAllUsersNames } from "~/utils/db/users.db.server";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { useActionData, useNavigation, useSubmit } from "react-router";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import Stripe from "stripe";
import { getStripeInvoices } from "~/utils/stripe.server";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { getAllTenantTypes } from "~/utils/db/tenants/tenantTypes.db.server";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { EntityWithDetails, findEntityByName } from "~/utils/db/entities/entities.db.server";
import { TenantsApi } from "~/utils/api/.server/TenantsApi";
import { getAllRoles } from "~/utils/db/permissions/roles.db.server";
import { TenantUserType } from "~/application/enums/tenants/TenantUserType";
import InputCheckboxWithDescription from "~/components/ui/input/InputCheckboxWithDescription";
import FormGroup from "~/components/ui/forms/FormGroup";
import InputText, { RefInputText } from "~/components/ui/input/InputText";
import RowProperties from "~/components/entities/rows/RowProperties";
import UrlUtils from "~/utils/app/UrlUtils";
import { getExistingSlug } from "~/utils/services/tenantService";
import DeactivateTenantModal from "~/components/core/tenants/DeactivateTenantModal";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
import { Button } from "~/components/ui/button";
import { ActionTile } from "~/components/ui/cards";
import { Badge } from "~/components/ui/badge";
import { Blocks, Building2, ShieldCheck, Sparkles, Users as UsersIcon, Activity, Wallet } from "lucide-react";
import { motion } from "framer-motion";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<LoaderData> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  items: TenantWithUsage[];
  filterableProperties: FilterablePropertyDto[];
  pagination: PaginationDto;
  tenantInvoices: Stripe.Invoice[];
  isStripeTest: boolean;
  tenantSettingsEntity: EntityWithDetails | null;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "admin.accounts");
  await time(verifyUserHasPermission(request, "admin.accounts.view"), "verifyUserHasPermission");
  let { t } = await time(getTranslations(request), "getTranslations");

  const filterableProperties = [
    { name: "name", title: "models.tenant.name" },
    { name: "slug", title: "models.tenant.slug" },
    {
      name: "userId",
      title: "models.user.object",
      manual: true,
      options: (await time(adminGetAllUsersNames(), "adminGetAllUsersNames")).map((item) => {
        return {
          value: item.id,
          name: item.email,
        };
      }),
    },
    {
      name: "typeId",
      title: t("shared.type"),
      manual: true,
      options: [
        { value: "null", name: "- Default -" },
        ...(await time(getAllTenantTypes(), "getAllTenantTypes")).map((item) => {
          return {
            value: item.id,
            name: t(item.title),
          };
        }),
      ],
    },
  ];
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
  const { items, pagination } = await time(adminGetAllTenantsWithUsage(filters, currentPagination), "adminGetAllTenantsWithUsage");

  const tenantInvoices: Stripe.Invoice[] = [];
  await Promise.all(
    items.map(async (item) => {
      if (item.subscription?.stripeCustomerId) {
        const invoices = await getStripeInvoices(item.subscription?.stripeCustomerId);
        tenantInvoices.push(...invoices);
      }
    })
  );

  const data: LoaderData = {
    title: `${t("models.tenant.plural")} | ${process.env.APP_NAME}`,
    items: items.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
    filterableProperties,
    pagination,
    tenantInvoices,
    isStripeTest: process.env.STRIPE_SK?.toString().startsWith("sk_test_") ?? true,
    tenantSettingsEntity: await findEntityByName({ tenantId: null, name: "tenantSettings" }),
  };
  return Response.json(data, { headers: getServerTimingHeader() });
};

type ActionData = {
  error?: string;
  success?: string;
  createdTenantId?: string;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.accounts.view");
  const { t } = await getTranslations(request);

  const form = await request.formData();
  const action = form.get("action")?.toString();
  const id = form.get("id")?.toString();
  if (action === "deactivate" && id) {
    const deactivatedReason = form.get("reason")?.toString();
    if (!deactivatedReason) {
      return Response.json({ error: "Missing reason" }, { status: 400 });
    }
    await updateTenantDeactivated(id, {
      active: false,
      deactivatedReason,
    });
    return Response.json({ success: "Tenant deactivated" });
  } else if (action === "activate" && id) {
    await updateTenantDeactivated(id, {
      active: true,
      deactivatedReason: null,
    });
    return Response.json({});
  } else if (action === "create") {
    await verifyUserHasPermission(request, "admin.accounts.create");
    const name = form.get("name")?.toString() ?? "";
    const slug = form.get("slug")?.toString() ?? "";
    const existingSlug = await getExistingSlug(slug);
    if (!slug || existingSlug) {
      return Response.json({ error: t("shared.slugTaken") }, { status: 400 });
    }
    const { tenant, user } = await TenantsApi.create({ request, form, name, slug });
    const addMySelf = Boolean(form.get("addMySelf"));
    if (addMySelf) {
      const roles = await getAllRoles("app");
      await createTenantUser(
        {
          tenantId: tenant.id,
          userId: user.id,
          type: TenantUserType.OWNER,
        },
        roles
      );
    }
    const data: ActionData = {
      createdTenantId: tenant.id,
    };
    return data;
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function AdminTenantsRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const appOrAdminData = useAppOrAdminData();
  const { t } = useTranslation();
  const submit = useSubmit();
  const navigation = useNavigation();

  const [deactivatingTenant, setDeactivatingTenant] = useState<TenantWithUsage>();
  const [creatingNewAccount, setCreatingNewAccount] = useState(false);
  const stats = useMemo(() => {
    const total = data.pagination.totalItems ?? data.items.length;
    const active = data.items.filter((item) => !item.deactivatedReason).length;
    const totalUsers = data.items.reduce((sum, item) => sum + (item._count.users ?? 0), 0);
    const rows = data.items.reduce((sum, item) => sum + (item._count.rows ?? 0), 0);
    return { total, active, totalUsers, rows };
  }, [data.items, data.pagination.totalItems]);
  const accountsSubtitle = useMemo(() => {
    const translated = t("app.sidebar.accountsDescription");
    return translated === "app.sidebar.accountsDescription" ? "Mandanten, Abos und Zugänge auf einen Blick." : translated;
  }, [t]);

  useEffect(() => {
    if (actionData?.createdTenantId) {
      setCreatingNewAccount(false);
    }
  }, [actionData]);

  function onToggleActive(item: TenantWithUsage) {
    if (!item.deactivatedReason) {
      setDeactivatingTenant(item);
    } else {
      onConfirmedToggleActive(item, "", true);
    }
  }

  function onConfirmedToggleActive(value: TenantSimple, reason: string, activate: boolean) {
    const form = new FormData();
    form.set("action", !activate ? "deactivate" : "activate");
    form.set("reason", reason ?? "");
    form.set("id", value.id);
    submit(form, {
      method: "post",
    });

    setDeactivatingTenant(undefined);
  }

  return (
    <main className="relative z-0 flex-1 overflow-hidden pb-10">
      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8 text-white">
        <section className="section-shell relative overflow-hidden rounded-[var(--radius-xl,1.75rem)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 p-6 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">Steuerzentrale</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-emerald-100">Konten</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight">{t("models.tenant.plural")}</h1>
                <p className="text-base text-white/75">{accountsSubtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/70">
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <ShieldCheck className="mr-2 h-4 w-4 text-emerald-300" />
                  Compliance bereit
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <Sparkles className="mr-2 h-4 w-4 text-amber-300" />
                  Setup-Status: live
                </Badge>
              </div>
            </div>

            <div className="relative ml-auto hidden h-72 w-72 shrink-0 items-center justify-center overflow-visible lg:flex">
              <div className="pointer-events-none absolute right-[-8rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(133,196,255,0.28),rgba(79,93,141,0.08)_55%,transparent_72%)] blur-3xl opacity-80" />
              <motion.div
                className="absolute right-[-3rem] top-[-2rem] h-[22rem] w-[22rem] text-white/80 drop-shadow-[0_14px_40px_rgba(0,0,0,0.55)]"
                aria-hidden
                animate={{
                  y: [-16, 16, -16],
                  rotate: [-4, 4, -4],
                  scale: [0.96, 1.06, 0.96],
                }}
                transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity }}
              >
                <Blocks className="h-full w-full" strokeWidth={1.5} />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="grid gap-4 md:grid-cols-2">
              <ActionTile
                title={t("shared.new")}
                description="Neuen Mandanten anlegen"
                hint="Schnellaktion"
                icon={<Building2 className="h-5 w-5" />}
                onClick={() => setCreatingNewAccount(true)}
                actionLabel={t("shared.open")}
              />
              <ActionTile
                title={t("models.user.plural")}
                description="Benutzer & Rollen verwalten"
                hint="Zugriff"
                icon={<UsersIcon className="h-5 w-5" />}
                href="/admin/accounts/users"
                tone="neutral"
                actionLabel={t("shared.manage")}
              />
              <ActionTile
                title="Abrechnung"
                description="Rechnungen & Subscriptions prüfen"
                hint="Abrechnung"
                icon={<Wallet className="h-5 w-5" />}
                href="/admin/accounts/subscriptions"
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
              <div className="mt-3 flex items-center justify-between text-xs text-white/60">
                <span>Stripe</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-white/80">{data.isStripeTest ? "Test" : "Live"}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg,1.25rem)] border border-white/8 bg-white/8 p-5 shadow-[0_18px_42px_rgba(5,9,20,0.35)] backdrop-blur-xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-[0.32em] text-white/65">{t("models.tenant.plural")}</p>
              <h2 className="text-xl font-semibold text-white">{accountsSubtitle}</h2>
              <p className="text-sm text-white/60">Aktive und inaktive Accounts mit Status, Billing und Nutzungszahlen.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={!getUserHasPermission(appOrAdminData, "admin.accounts.create")}
                onClick={() => setCreatingNewAccount(true)}
                className="border-white/20 bg-white/10 text-white hover:border-white/40 hover:bg-white/20"
              >
                {t("shared.new")}
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/6 shadow-[0_12px_30px_rgba(5,9,20,0.28)]">
            <TenantsTable
              items={data.items}
              pagination={data.pagination}
              tenantInvoices={data.tenantInvoices}
              isStripeTest={data.isStripeTest}
              actions={[
                {
                  renderTitle: (i) => (!i.deactivatedReason ? t("shared.deactivate") : t("shared.activate")),
                  onClick: (_idx, item) => onToggleActive(item),
                  disabled: () => navigation.state === "submitting",
                  renderIsDestructive: (i) => !i.deactivatedReason,
                },
              ]}
            />
          </div>
        </section>
      </div>

      <DeactivateTenantModal
        open={!!deactivatingTenant}
        onClose={() => setDeactivatingTenant(undefined)}
        item={deactivatingTenant}
        onConfirm={(item, reason) => onConfirmedToggleActive(item, reason, false)}
      />

      <SlideOverWideEmpty
        title={"New Account"}
        open={creatingNewAccount}
        onClose={() => {
          setCreatingNewAccount(false);
        }}
        className="sm:max-w-sm"
        overflowYScroll={true}
      >
        <div className="-mx-1 -mt-3">
          <div className="space-y-4">
            <CreateTenantForm tenantSettingsEntity={data.tenantSettingsEntity} />
          </div>
        </div>
      </SlideOverWideEmpty>

      <ActionResultModal actionData={actionData} />
    </main>
  );
}

function rowsLabel(rows: number) {
  if (rows >= 1000) return `${(rows / 1000).toFixed(1)}k`;
  return rows.toString();
}

function CreateTenantForm({ tenantSettingsEntity }: { tenantSettingsEntity: EntityWithDetails | null }) {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [addMySelf, setAddMySelf] = useState(true);

  useEffect(() => {
    setSlug(UrlUtils.slugify(name));
  }, [name]);

  const firstInput = useRef<RefInputText>(null);
  useEffect(() => {
    setTimeout(() => {
      firstInput.current?.input.current?.focus();
    }, 100);
  }, []);

  return (
    <FormGroup
      labels={{
        create: t("shared.create"),
      }}
      withErrorModal={false}
    >
      <div className="space-y-3">
        <InputText ref={firstInput} autoFocus name="name" title={t("shared.name")} value={name} setValue={setName} required />
        <InputText name="slug" title={t("shared.slug")} value={slug} setValue={setSlug} required onBlur={() => setSlug(UrlUtils.slugify(slug))} />
        {tenantSettingsEntity && (
          <div className="col-span-6 sm:col-span-6">
            <RowProperties entity={tenantSettingsEntity} item={null} />
          </div>
        )}
        <InputCheckboxWithDescription
          name="addMySelf"
          title="Add myself as owner"
          description="You will be added as owner of the new account."
          value={addMySelf}
          setValue={setAddMySelf}
        />
      </div>
    </FormGroup>
  );
}
