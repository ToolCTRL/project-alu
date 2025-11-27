import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import TenantBadge from "~/components/core/tenants/TenantBadge";
import UserBadge from "~/components/core/users/UserBadge";
import DateCell from "~/components/ui/dates/DateCell";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import XIcon from "~/components/ui/icons/XIcon";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import TableSimple from "~/components/ui/tables/TableSimple";
import { EntityViewWithTenantAndUser } from "~/utils/db/entities/entityViews.db.server";
import { defaultDisplayProperties } from "~/utils/helpers/PropertyHelper";
import NumberUtils from "~/utils/shared/NumberUtils";
import EntityViewLayoutBadge from "./EntityViewLayoutBadge";

type ViewScopeRenderer = (view: EntityViewWithTenantAndUser) => JSX.Element;

const SystemScope: ViewScopeRenderer = () => <div className="font-medium italic">System view</div>;

const DefaultScope: ViewScopeRenderer = () => (
  <div className="flex flex-col">
    <div className="font-medium italic">
      Default <span className="text-muted-foreground text-xs font-normal">(all accounts)</span>
    </div>
  </div>
);

const TenantAndUserScope: ViewScopeRenderer = (view) => (
  <div className="flex items-center space-x-1">
    <div>
      <TenantBadge item={view.tenant} />
    </div>
    <div>&rarr;</div>
    <UserBadge item={view.user} />
  </div>
);

const TenantOnlyScope: ViewScopeRenderer = (view) => (
  <div>
    <TenantBadge item={view.tenant} />
  </div>
);

const UserOnlyScope: ViewScopeRenderer = (view) => (
  <div>
    <UserBadge item={view.user} />
  </div>
);

const scopeRenders: Record<string, ViewScopeRenderer> = {
  system: SystemScope,
  default: DefaultScope,
  tenantAndUser: TenantAndUserScope,
  tenantOnly: TenantOnlyScope,
  userOnly: UserOnlyScope,
};

function getViewScopeKey(view: EntityViewWithTenantAndUser) {
  if (view.isSystem) return "system";
  if (!view.tenant && !view.user) return "default";
  if (view.tenant && view.user) return "tenantAndUser";
  if (view.tenant) return "tenantOnly";
  if (view.user) return "userOnly";
  return "invalid";
}

function renderViewScope(view: EntityViewWithTenantAndUser) {
  const renderer = scopeRenders[getViewScopeKey(view)];
  return renderer ? renderer(view) : <div className="italic text-red-500">Invalid view</div>;
}

const EntityCell = ({ item, t }: Readonly<{ item: EntityViewWithTenantAndUser; t: (key: string) => string }>) => (
  <div className="flex flex-col">
    <div>{t(item.entity.titlePlural)}</div>
  </div>
);

const LayoutCell = ({ item }: Readonly<{ item: EntityViewWithTenantAndUser }>) => (
  <div>
    <EntityViewLayoutBadge layout={item.layout} className="text-muted-foreground mx-auto h-5 w-5" />
  </div>
);

const TitleCell = ({ item, t }: Readonly<{ item: EntityViewWithTenantAndUser; t: (key: string) => string }>) => (
  <div className="flex flex-col">
    <Link to={`/admin/entities/views/${item.id}`} className="hover:underline">
      {t(item.title)}
    </Link>
  </div>
);

const AppliesToCell = ({ item }: Readonly<{ item: EntityViewWithTenantAndUser }>) => (
  <div className="flex items-center space-x-1">
    <div>{renderViewScope(item)}</div>
  </div>
);

const PropertiesCell = ({ item, t }: Readonly<{ item: EntityViewWithTenantAndUser; t: (key: string) => string }>) => (
  <div>
    <ShowPayloadModalButton
      description={item.properties.length > 1 ? `${item.properties.length} properties` : `${item.properties.length} property`}
      title="Properties"
      payload={JSON.stringify(
        item.properties.map((p) => {
          const defaultProperty = defaultDisplayProperties.find((f) => f.name === p.name);
          if (defaultProperty) {
            return t(defaultProperty.title);
          }
          return p.name;
        }),
        null,
        2
      )}
    />
  </div>
);

const FiltersCell = ({ item }: Readonly<{ item: EntityViewWithTenantAndUser }>) => (
  <div>
    <ShowPayloadModalButton
      description={item.filters.length > 1 ? `${item.filters.length} filters` : `${item.filters.length} filter`}
      title="filters"
      payload={JSON.stringify(
        item.filters.map((p) => {
          return `${p.name} ${p.condition} ${p.value}`;
        }),
        null,
        2
      )}
    />
  </div>
);

const SortCell = ({ item }: Readonly<{ item: EntityViewWithTenantAndUser }>) => (
  <div>
    <ShowPayloadModalButton
      description={item.sort.length === 1 ? `${item.sort.length} sort option` : `${item.sort.length} sort options`}
      title="sort"
      payload={JSON.stringify(
        item.sort.map((p) => {
          return `${p.name} ${p.asc ? "asc" : "desc"}`;
        }),
        null,
        2
      )}
    />
  </div>
);

const PageSizeCell = ({ item }: Readonly<{ item: EntityViewWithTenantAndUser }>) => <div>{NumberUtils.intFormat(item.pageSize)}</div>;

const IsDefaultCell = ({ item }: Readonly<{ item: EntityViewWithTenantAndUser }>) => (
  <div>{item.isDefault ? <CheckIcon className="h-5 w-5 text-green-500" /> : <XIcon className="text-muted-foreground h-5 w-5" />}</div>
);

const UpdatedAtCell = ({ item }: Readonly<{ item: EntityViewWithTenantAndUser }>) => <DateCell date={item.updatedAt ?? null} />;

const CreatedAtCell = ({ item }: Readonly<{ item: EntityViewWithTenantAndUser }>) => <DateCell date={item.createdAt ?? null} />;

const CreatedByCell = ({ item }: Readonly<{ item: EntityViewWithTenantAndUser }>) => (item.createdByUser ? <UserBadge item={item.createdByUser} /> : <div>-</div>);

export default function EntityViewsTable({
  items,
  onClickRoute,
}: Readonly<{
  items: EntityViewWithTenantAndUser[];
  onClickRoute: (item: EntityViewWithTenantAndUser) => string;
}>) {
  const { t } = useTranslation();
  return (
    <TableSimple
      items={items}
      actions={[
        {
          title: t("shared.edit"),
          onClickRoute: (_, i) => onClickRoute(i),
        },
      ]}
      headers={[
        // {
        //   name: "debug",
        //   title: "Debug",
        //   value: (i) => (
        //     <div>
        //       <ShowPayloadModalButton title="Debug" description="Debug" payload={JSON.stringify(i, null, 2)} />
        //     </div>
        //   ),
        // },
        {
          name: "entity",
          title: t("models.entity.object"),
          value: (i) => <EntityCell item={i} t={t} />,
        },
        {
          name: "Layout",
          title: t("models.view.layout"),
          value: (i) => <LayoutCell item={i} />,
        },
        {
          name: "title",
          title: t("models.view.title"),
          className: "w-full",
          value: (i) => <TitleCell item={i} t={t} />,
        },
        {
          name: "appliesTo",
          title: t("models.view.appliesTo"),
          value: (i) => <AppliesToCell item={i} />,
        },
        {
          name: "properties",
          title: t("models.view.properties"),
          value: (i) => <PropertiesCell item={i} t={t} />,
        },
        {
          name: "filters",
          title: t("models.view.filters"),
          value: (i) => <FiltersCell item={i} />,
        },
        {
          name: "sort",
          title: t("models.view.sort"),
          value: (i) => <SortCell item={i} />,
        },
        {
          name: "pageSize",
          title: t("models.view.pageSize"),
          value: (i) => <PageSizeCell item={i} />,
        },
        {
          name: "isDefault",
          title: t("models.view.isDefault"),
          value: (i) => <IsDefaultCell item={i} />,
        },
        {
          name: "updatedAt",
          title: t("shared.updatedAt"),
          value: (i) => <UpdatedAtCell item={i} />,
        },
        {
          name: "createdAt",
          title: t("shared.createdAt"),
          value: (i) => <CreatedAtCell item={i} />,
        },
        {
          name: "createdBy",
          title: t("shared.createdBy"),
          value: (i) => <CreatedByCell item={i} />,
        },
      ]}
      noRecords={
        <div className="p-12 text-center">
          <h3 className="text-foreground mt-1 text-sm font-medium">No views yet</h3>
          <p className="text-muted-foreground mt-1 text-sm">Create custom views to display your data</p>
        </div>
      }
    />
  );
}
