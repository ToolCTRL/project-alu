import { useTranslation } from "react-i18next";
import DateUtils from "~/utils/shared/DateUtils";
import { useEffect, useState } from "react";
import { ApiKeyLogWithDetails } from "~/utils/db/apiKeys.db.server";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { Colors } from "~/application/enums/shared/Colors";
import TableSimple from "~/components/ui/tables/TableSimple";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import ApiUtils from "~/utils/app/ApiUtils";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";

interface Props {
  items: ApiKeyLogWithDetails[];
  withTenant: boolean;
  pagination: PaginationDto;
}

// Extracted component definitions
const CreatedAtCell = ({ item }: { item: ApiKeyLogWithDetails }) => (
  <div className="text-muted-foreground text-xs">
    {item.createdAt && <span>{DateUtils.dateYMDHMS(item.createdAt)}</span>}
  </div>
);

const AliasCell = ({ item }: { item: ApiKeyLogWithDetails }) => (
  <div>{item.apiKey ? item.apiKey?.alias : <span className="text-gray-300">?</span>}</div>
);

const IpCell = ({ item }: Readonly<{ item: ApiKeyLogWithDetails }>) => (
  <div>{item.ip.length > 0 ? item.ip : <span className="text-gray-300">?</span>}</div>
);

const MethodCell = ({ item }: { item: ApiKeyLogWithDetails }) => (
  <div>
    <SimpleBadge title={item.method} color={ApiUtils.getMethodColor(item.method)} />
  </div>
);

const StatusCell = ({ item }: { item: ApiKeyLogWithDetails }) => (
  <div>
    {item.status ? (
      <span>
        <SimpleBadge title={item.status.toString()} color={item.status.toString().startsWith("4") ? Colors.RED : Colors.GREEN} />
      </span>
    ) : (
      <span className="text-gray-300">?</span>
    )}
  </div>
);

const DurationCell = ({ item }: { item: ApiKeyLogWithDetails }) => (
  <div>
    <div>{item.duration ? <span>{item.duration / 1000} s</span> : <span className="text-gray-300">?</span>}</div>
  </div>
);

const ParamsCell = ({ item }: { item: ApiKeyLogWithDetails }) => (
  <ShowPayloadModalButton description={item.params} payload={item.params} />
);

const ErrorCell = ({ item }: { item: ApiKeyLogWithDetails }) => (
  <div className="text-red-500">{item.error}</div>
);

export default function ApiKeyLogsTable({ withTenant, items, pagination }: Readonly<Props>) {
  const { t } = useTranslation();

  const [headers, setHeaders] = useState<RowHeaderDisplayDto<ApiKeyLogWithDetails>[]>([]);

  useEffect(() => {
    let headers: RowHeaderDisplayDto<ApiKeyLogWithDetails>[] = [];

    const createdAtHeader: RowHeaderDisplayDto<ApiKeyLogWithDetails> = {
      name: "createdAt",
      title: t("shared.createdAt"),
      value: (item) => DateUtils.dateYMDHMS(item.createdAt),
      formattedValue: CreatedAtCell,
    };
    headers.push(createdAtHeader);
    if (withTenant) {
      const tenantHeader: RowHeaderDisplayDto<ApiKeyLogWithDetails> = {
        name: "tenant",
        title: t("models.tenant.object"),
        value: (item) => item.apiKey?.tenant.name,
      };
      headers.push(tenantHeader);
    }
    const aliasHeader: RowHeaderDisplayDto<ApiKeyLogWithDetails> = {
      name: "alias",
      title: t("models.apiKey.alias"),
      value: (item) => item.apiKey?.alias,
      formattedValue: AliasCell,
    };
    headers.push(aliasHeader);
    const ipHeader: RowHeaderDisplayDto<ApiKeyLogWithDetails> = {
      name: "ip",
      title: t("models.apiKeyLog.ip"),
      value: (item) => item.ip,
      formattedValue: IpCell,
    };
    headers.push(ipHeader);
    const endpointHeader: RowHeaderDisplayDto<ApiKeyLogWithDetails> = {
      name: "endpoint",
      title: t("models.apiKeyLog.endpoint"),
      value: (item) => item.endpoint,
    };
    headers.push(endpointHeader);
    const methodHeader: RowHeaderDisplayDto<ApiKeyLogWithDetails> = {
      name: "method",
      title: t("models.apiKeyLog.method"),
      value: (item) => item.method,
      formattedValue: MethodCell,
    };
    const statusHeader: RowHeaderDisplayDto<ApiKeyLogWithDetails> = {
      name: "status",
      title: t("models.apiKeyLog.status"),
      value: (item) => item.status,
      formattedValue: StatusCell,
    };
    const durationHeader: RowHeaderDisplayDto<ApiKeyLogWithDetails> = {
      name: "duration",
      title: "Duration",
      formattedValue: DurationCell,
    };
    const paramsHeader: RowHeaderDisplayDto<ApiKeyLogWithDetails> = {
      name: "params",
      title: t("models.apiKeyLog.params"),
      formattedValue: ParamsCell,
    };
    const errorHeader: RowHeaderDisplayDto<ApiKeyLogWithDetails> = {
      name: "error",
      title: "Error",
      formattedValue: ErrorCell,
    };
    headers = [...headers, methodHeader, statusHeader, durationHeader, paramsHeader, errorHeader];
    setHeaders(headers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withTenant]);

  return (
    <div className="space-y-2">
      <TableSimple items={items} headers={headers} pagination={pagination} />
    </div>
  );
}
