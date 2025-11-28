import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, useLoaderData, Link, useNavigate, useOutlet, useParams, useSubmit } from "react-router";
import { useTranslation } from "react-i18next";
import TableSimple from "~/components/ui/tables/TableSimple";
import { getTranslations } from "~/locale/i18next.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { getAllTenantTypes, deleteTenantType } from "~/utils/db/tenants/tenantTypes.db.server";
import XIcon from "~/components/ui/icons/XIcon";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { TenantTypeDto } from "~/application/dtos/tenants/TenantTypeDto";
import { getAllSubscriptionProducts } from "~/utils/db/subscriptionProducts.db.server";
import { getAllTenantsWithoutTypes } from "~/utils/db/tenants.db.server";
import clsx from "clsx";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import LockClosedIcon from "~/components/ui/icons/LockClosedIcon";
import { useRootData } from "~/utils/data/useRootData";
import WarningBanner from "~/components/ui/banners/WarningBanner";
import BackButtonWithTitle from "~/components/ui/buttons/BackButtonWithTitle";
import { Button } from "~/components/ui/button";

type LoaderData = {
  title: string;
  types: TenantTypeDto[];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.accountTypes.view");
  const types: TenantTypeDto[] = await getAllTenantTypes();
  const subscriptionProducts = await getAllSubscriptionProducts();
  const allTenants = await getAllTenantsWithoutTypes();
  types.unshift({
    title: "Default",
    titlePlural: "Default",
    description: null,
    isDefault: true,
    subscriptionProducts: subscriptionProducts
      .filter((f) => !f.assignsTenantTypes || f.assignsTenantTypes?.length === 0)
      .map((f) => ({ id: f.id, title: f.title })),
    _count: { tenants: allTenants.length },
  });

  const data: LoaderData = {
    title: `Tenant Types | ${process.env.APP_NAME}`,
    types,
  };
  return data;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.accountTypes.update");
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action")?.toString();

  if (action === "delete") {
    await verifyUserHasPermission(request, "admin.accountTypes.delete");
    const id = form.get("id")?.toString() ?? "";
    await deleteTenantType(id);
    return Response.json({ success: t("shared.deleted") });
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function AccountTypesList() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const rootData = useRootData();
  const submit = useSubmit();
  const outlet = useOutlet();
  const navigate = useNavigate();
  const params = useParams();

  const [open, setOpen] = useState(!!outlet);
  useEffect(() => {
    setOpen(!!outlet);
  }, [outlet]);

  function onToggleTypeEntity(typeId: string, entityId: string) {
    const form = new FormData();
    form.set("action", "toggle-entity");
    form.set("typeId", typeId);
    form.set("entityId", entityId);
    submit(form, {
      method: "post",
    });
  }

  const renderName = useCallback(
    (item: TenantTypeDto) => (
      <div className={clsx("flex max-w-xs flex-col truncate", item.id && "cursor-pointer hover:underline")}>
        <div className="flex items-center space-x-2">
          {!item.id && <LockClosedIcon className="text-muted-foreground h-4 w-4" />}
          <div>
            {item.title} <span className="text-muted-foreground text-xs font-normal">({item.titlePlural})</span>
          </div>
        </div>
        <div className="text-muted-foreground truncate text-sm">{item.description}</div>
      </div>
    ),
    []
  );
  const renderInProducts = useCallback(
    (item: TenantTypeDto) => <div className="max-w-md truncate">{item.subscriptionProducts?.map((f) => t(f.title)).join(", ") || "-"}</div>,
    [t]
  );
  const renderInTenants = useCallback((item: TenantTypeDto) => item._count?.tenants, []);
  const renderIsDefault = useCallback(
    (item: TenantTypeDto) => (item.isDefault ? <CheckIcon className="h-4 w-4 text-green-500" /> : <XIcon className="text-muted-foreground h-4 w-4" />),
    []
  );
  const renderActions = useCallback(
    (item: TenantTypeDto) => (
      <Fragment>
        {item.id && (
          <Link to={item.id} className="hover:underline">
            {t("shared.edit")}
          </Link>
        )}
      </Fragment>
    ),
    [t]
  );
  const hrefName = useCallback((item: TenantTypeDto) => item.id ?? undefined, []);
  const hrefTenants = useCallback((item: TenantTypeDto) => "/admin/accounts?typeId=" + item.id || "null", []);
  const headers = useMemo(
    () => [
      {
        name: "name",
        title: t("shared.title"),
        value: renderName,
        href: hrefName,
      },
      {
        name: "inProducts",
        title: "Plans",
        className: "w-full",
        value: renderInProducts,
      },
      {
        name: "inTenants",
        title: "Accounts",
        value: renderInTenants,
        href: hrefTenants,
      },
      {
        name: "isDefault",
        title: t("shared.default"),
        value: renderIsDefault,
      },
      {
        name: "actions",
        title: "",
        value: renderActions,
      },
    ],
    [hrefName, hrefTenants, renderActions, renderInProducts, renderInTenants, renderIsDefault, renderName, t]
  );

  return (
    <EditPageLayout
      title={<BackButtonWithTitle href="/admin/settings">{t("models.tenantType.plural")}</BackButtonWithTitle>}
      buttons={
        <Button type="button" variant="default" size="sm" asChild>
          <Link to="new">{t("shared.new")}</Link>
        </Button>
      }
    >
      <div className="space-y-2">
        {!rootData.appConfiguration.app.features.tenantTypes && <WarningBanner title={t("shared.warning")} text={"Tenant Types are not enabled."} />}
        <TableSimple
          items={data.types}
          onClickRoute={(idx, item) => item.id ?? undefined}
          headers={headers}
        />
      </div>

      <SlideOverWideEmpty
        title={params.id ? "Edit Tenant Type" : "New Tenant Type"}
        open={open}
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
    </EditPageLayout>
  );
}
