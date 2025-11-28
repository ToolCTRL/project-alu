import { useSubmit, useSearchParams, useNavigation, useParams } from "react-router";
import { useState } from "react";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import RefreshIcon from "~/components/ui/icons/RefreshIcon";
import InputFilters from "~/components/ui/input/InputFilters";
import InputSearchWithURL from "~/components/ui/input/InputSearchWithURL";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import { FilterableValueLink } from "~/components/ui/links/FilterableValueLink";
import TableSimple from "~/components/ui/tables/TableSimple";
import ApiUtils from "~/utils/app/ApiUtils";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import DateUtils from "~/utils/shared/DateUtils";
import NumberUtils from "~/utils/shared/NumberUtils";
import { ApiKeyLogDto } from "../dtos/ApiKeyLogDto";
import ApiCallSpeedBadge from "./ApiCallSpeedBadge";
import { useTranslation } from "react-i18next";
import ApiCallStatusBadge from "./ApiCallStatusBadge";

const CreatedAtCell = ({ item }: { readonly item: ApiKeyLogDto }) => (
  <div className="text-muted-foreground text-xs">{item.createdAt && <span>{DateUtils.dateYMDHMS(item.createdAt)}</span>}</div>
);

const TenantCell = ({ item, params }: { readonly item: ApiKeyLogDto; readonly params: ReturnType<typeof useParams> }) =>
  params.tenant ? null : <FilterableValueLink name="tenantId" value={item.apiKey?.tenant?.name} param={item.apiKey?.tenant?.id} />;

const ApiKeyCell = ({ item }: { readonly item: ApiKeyLogDto }) => (
  <FilterableValueLink name="apiKeyId" value={item.apiKey?.alias ?? "{null}"} param={item.apiKeyId ?? "{null}"} />
);

const IpCell = ({ item }: { readonly item: ApiKeyLogDto }) => (
  <div>{item.ip.length > 0 ? <FilterableValueLink name="ip" value={item.ip} /> : <span className="text-gray-300">?</span>}</div>
);

const EndpointCell = ({ item }: { readonly item: ApiKeyLogDto }) => <FilterableValueLink name="endpoint" value={item.endpoint} />;

const MethodCell = ({ item }: { readonly item: ApiKeyLogDto }) => (
  <div>
    <FilterableValueLink name="method" value={item.method}>
      <SimpleBadge title={item.method} color={ApiUtils.getMethodColor(item.method)} underline />
    </FilterableValueLink>
  </div>
);

const StatusCell = ({ item }: { readonly item: ApiKeyLogDto }) => (
  <div>
    {item.status ? (
      <span>
        <FilterableValueLink name="status" value={item.status.toString()}>
          <ApiCallStatusBadge item={item} underline />
        </FilterableValueLink>
      </span>
    ) : (
      <span className="text-gray-300">?</span>
    )}
  </div>
);

const buildHeaders = (t: (key: string) => string, params: ReturnType<typeof useParams>) =>
  [
    {
      name: "createdAt",
      title: t("shared.createdAt"),
      value: (item: ApiKeyLogDto) => DateUtils.dateYMDHMS(item.createdAt),
      formattedValue: (item: ApiKeyLogDto) => <CreatedAtCell item={item} />,
    },
    {
      name: "tenant",
      title: "Tenant",
      value: (item: ApiKeyLogDto) => <TenantCell item={item} params={params} />,
      hidden: !!params.tenant,
    },
    {
      name: "apiKeyId",
      title: t("models.apiKey.alias"),
      value: (item: ApiKeyLogDto) => <ApiKeyCell item={item} />,
    },
    {
      name: "ip",
      title: t("models.apiKeyLog.ip"),
      value: (item: ApiKeyLogDto) => item.ip,
      formattedValue: (item: ApiKeyLogDto) => <IpCell item={item} />,
    },
    {
      name: "endpoint",
      title: t("models.apiKeyLog.endpoint"),
      value: (item: ApiKeyLogDto) => <EndpointCell item={item} />,
    },
    {
      name: "method",
      title: t("models.apiKeyLog.method"),
      value: (item: ApiKeyLogDto) => item.method,
      formattedValue: (item: ApiKeyLogDto) => <MethodCell item={item} />,
    },
    {
      name: "status",
      title: t("models.apiKeyLog.status"),
      value: (item: ApiKeyLogDto) => item.status,
      formattedValue: (item: ApiKeyLogDto) => <StatusCell item={item} />,
    },
    {
      name: "duration",
      title: t("models.apiKeyLog.duration"),
      value: (item: ApiKeyLogDto) => (
        <>
          {NumberUtils.custom(Number(item.duration), "0,0.00")} ms <ApiCallSpeedBadge item={item} />
        </>
      ),
    },
    {
      name: "requestPayload",
      title: t("models.apiKeyLog.requestPayload"),
      value: (item: ApiKeyLogDto) => (
        <div>
          <ShowPayloadModalButton title="Request payload" payload={item.requestPayload} />
        </div>
      ),
    },
    {
      name: "responsePayload",
      title: t("models.apiKeyLog.responsePayload"),
      value: (item: ApiKeyLogDto) => (
        <div>
          <ShowPayloadModalButton title="Response payload" payload={item.responsePayload} />
        </div>
      ),
    },
  ] as const;

interface Props {
  readonly data: {
    items: ApiKeyLogDto[];
    filterableProperties: FilterablePropertyDto[];
    pagination: PaginationDto;
  };
}

export default function ApiKeyLogsDetails({ data }: Props) {
  const { t } = useTranslation();
  const appOrAdminData = useAppOrAdminData();
  const submit = useSubmit();
  const navigation = useNavigation();
  const params = useParams();

  const canDelete = !params.tenant;

  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedRows, setSelectedRows] = useState<ApiKeyLogDto[]>([]);
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
  return (
    <div className="space-y-2">
      <div className="flex w-full items-center space-x-2">
        <div className="grow">
          <InputSearchWithURL />
        </div>
        {canDelete && selectedRows.length > 0 && (
          <ButtonSecondary
            destructive
            disabled={!getUserHasPermission(appOrAdminData, "admin.apiKeys.delete")}
            onClick={() => {
              onDelete(selectedRows.map((x) => x.id));
              setSelectedRows([]);
            }}
          >
            Delete {selectedRows.length}
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
        headers={buildHeaders(t, params)}
      />
    </div>
  );
}
