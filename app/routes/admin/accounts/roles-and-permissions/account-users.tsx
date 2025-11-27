import { LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { adminGetAllTenants, TenantWithDetails } from "~/utils/db/tenants.db.server";
import { useTranslation } from "react-i18next";
import TableSimple from "~/components/ui/tables/TableSimple";
import { useState } from "react";
import InputSearch from "~/components/ui/input/InputSearch";
import DateUtils from "~/utils/shared/DateUtils";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  title: string;
  tenants: TenantWithDetails[];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.roles.update");
  const { t } = await getTranslations(request);

  const tenants = await adminGetAllTenants();

  const data: LoaderData = {
    title: `${t("models.permission.userRoles")} | ${process.env.APP_NAME}`,
    tenants,
  };
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

function TenantInfoCell({ name, slug }: { readonly name: string; readonly slug: string }) {
  return (
    <div className="max-w-sm truncate">
      <div className="text-foreground flex items-center space-x-1 truncate font-medium">{name}</div>
      <div className="text-muted-foreground text-xs">
        <span>/{slug}</span>
      </div>
    </div>
  );
}

function TenantTypesCell({ types, t }: { readonly types: any[]; readonly t: any }) {
  return types.length === 0 ? <span className="text-muted-foreground">{t("shared.default")}</span> : <>{types.map((f) => f.title).join(", ")}</>;
}

function TenantCreatedAtCell({ createdAt }: { readonly createdAt: Date }) {
  return (
    <div className="flex flex-col">
      <div>{DateUtils.dateYMD(createdAt)}</div>
      <div className="text-xs">{DateUtils.dateAgo(createdAt)}</div>
    </div>
  );
}

export default function AdminRolesAndPermissionsAccountUsersRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  const [searchInput, setSearchInput] = useState("");

  const filteredItems = () => {
    if (!data.tenants) {
      return [];
    }
    return data.tenants.filter(
      (f) =>
        f.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.users.some(
          (x) =>
            x.user.email?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
            x.user.firstName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
            x.user.lastName?.toString().toUpperCase().includes(searchInput.toUpperCase())
        )
    );
  };

  return (
    <div className="space-y-2">
      <InputSearch value={searchInput} setValue={setSearchInput} />
      <TableSimple
        items={filteredItems()}
        headers={[
          {
            name: "tenant",
            title: t("models.tenant.object"),
            value: (i) => <TenantInfoCell name={i.name} slug={i.slug} />,
          },
          {
            name: "types",
            title: t("shared.types"),
            value: (i) => <TenantTypesCell types={i.types} t={t} />,
          },
          {
            name: "users",
            title: t("models.user.plural"),
            className: "max-w-xs truncate",
            value: (i) => i.users.map((f) => f.user.email).join(", "),
            href: (i) => `/admin/accounts/users?tenantId=${i.id}`,
          },
          {
            name: "createdAt",
            title: t("shared.createdAt"),
            value: (i) => i.createdAt,
            formattedValue: (item) => <TenantCreatedAtCell createdAt={item.createdAt} />,
          },
        ]}
        actions={[
          {
            title: t("shared.setUserRoles"),
            onClickRoute: (_, item) => `${item.id}`,
          },
        ]}
      />
    </div>
  );
}
