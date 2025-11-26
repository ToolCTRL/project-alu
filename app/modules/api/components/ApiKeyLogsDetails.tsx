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

interface Props {
  readonly data: {
    items: ApiKeyLogDto[];
    filterableProperties: FilterablePropertyDto[];
    pagination: PaginationDto;
  };
}

function TenantCell({ item }: { readonly item: ApiKeyLogDto }) {
  return <FilterableValueLink name="tenantId" value={item.apiKey?.tenant?.name} param={item.apiKey?.tenant?.id} />;
}

function ApiKeyCell({ item }: { readonly item: ApiKeyLogDto }) {
  return <FilterableValueLink name="apiKeyId" value={item.apiKey?.alias ?? "{null}"} param={item.apiKeyId ?? "{null}"} />;
}

function IpCell({ item }: { readonly item: ApiKeyLogDto }) {
  return <div>{item.ip.length > 0 ? <FilterableValueLink name="ip" value={item.ip} /> : <span className="text-gray-300">?</span>}</div>;
}

function EndpointCell({ item }: { readonly item: ApiKeyLogDto }) {
  return <FilterableValueLink name="endpoint" value={item.endpoint} />;
}

function MethodCell({ item }: { readonly item: ApiKeyLogDto }) {
  return (
    <div>
      <FilterableValueLink name="method" value={item.method}>
        <SimpleBadge title={item.method} color={ApiUtils.getMethodColor(item.method)} underline />
      </FilterableValueLink>
    </div>
  );
}

function StatusCell({ item }: { readonly item: ApiKeyLogDto }) {
  return (
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
}

function DurationCell({ item }: { readonly item: ApiKeyLogDto }) {
  return item.duration === null ? (
    <span className="text-muted-foreground text-xs italic">-</span>
  ) : (
    <div>{NumberUtils.custom(Number(item.duration), "0,0.001")} ms</div>
  );
}

function SpeedCell({ item }: { readonly item: ApiKeyLogDto }) {
  return item.duration === null ? <span className="text-muted-foreground text-xs italic">-</span> : <ApiCallSpeedBadge duration={Number(item.duration)} />;
}

function ParamsCell({ item }: { readonly item: ApiKeyLogDto }) {
  return item.params === "{}" ? (
    <span className="text-muted-foreground text-xs italic">-</span>
  ) : (
    <ShowPayloadModalButton description={item.params} payload={item.params} />
  );
}

function ErrorCell({ item }: { readonly item: ApiKeyLogDto }) {
  return <div className="text-red-500">{item.error}</div>;
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
        headers={[
          {
            name: "createdAt",
            title: t("shared.createdAt"),
            value: (item) => DateUtils.dateYMDHMS(item.createdAt),
            formattedValue: (item) => (
              <div className="text-muted-foreground text-xs">{item.createdAt && <span>{DateUtils.dateYMDHMS(item.createdAt)}</span>}</div>
            ),
          },
          {
            name: "tenant",
            title: "Tenant",
            value: (item) => <TenantCell item={item} />,
            hidden: !!params.tenant,
          },
          {
            name: "apiKeyId",
            title: t("models.apiKey.alias"),
            value: (item) => <ApiKeyCell item={item} />,
          },
          {
            name: "ip",
            title: t("models.apiKeyLog.ip"),
            value: (item) => item.ip,
            formattedValue: (item) => <IpCell item={item} />,
          },
          {
            name: "endpoint",
            title: t("models.apiKeyLog.endpoint"),
            value: (item) => <EndpointCell item={item} />,
          },
          {
            name: "method",
            title: t("models.apiKeyLog.method"),
            value: (item) => item.method,
            formattedValue: (item) => <MethodCell item={item} />,
          },
          {
            name: "status",
            title: t("models.apiKeyLog.status"),
            value: (item) => item.status,
            formattedValue: (item) => <StatusCell item={item} />,
          },
          {
            name: "duration",
            title: "Duration",
            value: (item) => <DurationCell item={item} />,
          },
          {
            name: "speed",
            title: "Speed",
            value: (item) => <SpeedCell item={item} />,
          },
          {
            name: "params",
            title: t("models.apiKeyLog.params"),
            value: (item) => <ParamsCell item={item} />,
          },
          {
            name: "error",
            title: "Error",
            value: (item) => <ErrorCell item={item} />,
          },
        ]}
      />
    </div>
  );
}
