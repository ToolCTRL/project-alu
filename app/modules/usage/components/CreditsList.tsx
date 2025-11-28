import { useSubmit, useNavigation, useParams, useSearchParams, Link } from "react-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import RefreshIcon from "~/components/ui/icons/RefreshIcon";
import InputFilters from "~/components/ui/input/InputFilters";
import InputSearchWithURL from "~/components/ui/input/InputSearchWithURL";
import { FilterableValueLink } from "~/components/ui/links/FilterableValueLink";
import TableSimple from "~/components/ui/tables/TableSimple";
import DateUtils from "~/utils/shared/DateUtils";
import { CreditWithDetails } from "../db/credits.db.server";

interface Props {
  data: {
    items: CreditWithDetails[];
    filterableProperties: FilterablePropertyDto[];
    pagination: PaginationDto;
    canDelete: boolean;
  };
}

const CreatedAtCell = ({ item }: { item: CreditWithDetails }) => (
  <div className="text-muted-foreground text-xs">{item.createdAt && <span>{DateUtils.dateYMDHMS(item.createdAt)}</span>}</div>
);

const TenantCell = ({ item }: { item: CreditWithDetails }) => (
  <FilterableValueLink name="tenantId" value={item?.tenant?.name} param={item?.tenant?.id} />
);

const TypeCell = ({ item }: { item: CreditWithDetails }) => <div>{item.type}</div>;

const ResourceCell = ({ item, t }: { item: CreditWithDetails; t: (key: string) => string }) => (
  <div className="max-w-xs truncate">
    {item.objectId ? (
      <Link to={item.objectId} className="truncate underline">
        {item.objectId}
      </Link>
    ) : (
      <span className="truncate">{t("shared.undefined")}</span>
    )}
  </div>
);

const UserCell = ({ item }: { item: CreditWithDetails }) => (
  <FilterableValueLink name="userId" value={item.user?.email} param={item.user?.id} />
);

export default function CreditsList({ data }: Readonly<Props>) {
  const { t } = useTranslation();
  const submit = useSubmit();
  const navigation = useNavigation();
  const params = useParams();

  const canDelete = data.canDelete;

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedRows, setSelectedRows] = useState<CreditWithDetails[]>([]);
  function onDelete(ids: string[]) {
    if (!canDelete) {
      return;
    }
    const form = new FormData();
    form.set("action", "delete");
    form.set("ids", ids.join(","));
    submit(form, {
      method: "post",
    });
  }

  const renderCreatedAt = useCallback((item: CreditWithDetails) => DateUtils.dateYMDHMS(item.createdAt), []);
  const renderResource = useCallback((item: CreditWithDetails) => <ResourceCell item={item} t={t} />, [t]);
  const headers = useMemo(
    () => [
      {
        name: "createdAt",
        title: t("shared.createdAt"),
        value: renderCreatedAt,
        formattedValue: CreatedAtCell,
      },
      {
        name: "tenant",
        title: "Tenant",
        value: TenantCell,
        hidden: !!params.tenant,
      },
      {
        name: "type",
        title: t("shared.type"),
        value: TypeCell,
      },
      {
        name: "resource",
        title: t("models.credit.resource"),
        className: "w-full",
        value: renderResource,
      },
      {
        name: "user",
        title: t("models.user.object"),
        value: UserCell,
      },
    ],
    [params.tenant, renderCreatedAt, renderResource, t]
  );
  return (
    <div className="space-y-2">
      <div className="flex w-full items-center space-x-2">
        <div className="grow">
          <InputSearchWithURL />
        </div>
        {canDelete && selectedRows.length > 0 && (
          <ButtonSecondary
            destructive
            onClick={() => {
              onDelete(selectedRows.map((x) => x.id));
              setSelectedRows([]);
            }}
          >
            {t("shared.delete")} {selectedRows.length}
          </ButtonSecondary>
        )}
        <ButtonSecondary onClick={() => setSearchParams(searchParams)} isLoading={navigation.state === "loading"}>
          <RefreshIcon className="h-4 w-4" />
        </ButtonSecondary>
        <InputFilters filters={data.filterableProperties} />
      </div>
      <TableSimple
        selectedRows={canDelete ? selectedRows : undefined}
        onSelected={canDelete ? setSelectedRows : undefined}
        items={data.items}
        pagination={data.pagination}
        actions={[
          {
            title: t("shared.delete"),
            onClick: (_, item) => onDelete([item.id]),
            hidden: () => !canDelete,
            disabled: () => !canDelete,
            destructive: true,
          },
        ]}
        headers={headers}
      />
    </div>
  );
}
