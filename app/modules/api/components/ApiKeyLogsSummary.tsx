import { Link, useParams, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import ApiKeyLogUtils from "../utils/ApiKeyLogUtils";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import { ApiCallSummaryDto } from "../dtos/ApiCallSummaryDto";
import ApiKeyLogsConstants from "../utils/ApiKeyLogsConstants";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { FilterableValueLink } from "~/components/ui/links/FilterableValueLink";
import WarningBanner from "~/components/ui/banners/WarningBanner";
import InputCombobox from "~/components/ui/input/InputCombobox";
import InputFilters from "~/components/ui/input/InputFilters";
import TableSimple from "~/components/ui/tables/TableSimple";
import NumberUtils from "~/utils/shared/NumberUtils";
import UrlUtils from "~/utils/app/UrlUtils";
import ApiUtils from "~/utils/app/ApiUtils";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { Colors } from "~/application/enums/shared/Colors";
import ApiCallSpeedBadge from "./ApiCallSpeedBadge";
import { useTranslation } from "react-i18next";

const buildSummaryHeaders = ({
  groupBy,
  params,
  data,
  t,
}: {
  groupBy: string[];
  params: ReturnType<typeof useParams>;
  data: Props["data"];
  t: (key: string) => string;
}): RowHeaderDisplayDto<ApiCallSummaryDto>[] => {
  const activeGroupBy = groupBy.length === 0 ? ApiKeyLogsConstants.DEFAULT_GROUP_BY : groupBy;
  const getCountLink = (item: ApiCallSummaryDto) => {
    const searchParams = new URLSearchParams();
    activeGroupBy.forEach((by) => {
      if (by === "method") {
        searchParams.append("method", item.method);
      } else if (by === "endpoint") {
        searchParams.append("endpoint", item.endpoint);
      } else if (by === "params") {
        searchParams.append("params", item.params);
      } else if (by === "status") {
        searchParams.append("status", item.status?.toString() ?? "{null}");
      } else if (by === "tenantId") {
        searchParams.append("tenantId", item.tenantId ?? "{null}");
      }
    });
    return UrlUtils.getModulePath(params, `api/logs?${searchParams.toString()}`);
  };

  const headers: RowHeaderDisplayDto<ApiCallSummaryDto>[] = [];

  if (activeGroupBy.includes("method")) {
    headers.push({
      name: "method",
      title: "Method",
      value: (item) => (
        <FilterableValueLink name="method" value={item.method}>
          <SimpleBadge title={item.method} color={ApiUtils.getMethodColor(item.method)} underline />
        </FilterableValueLink>
      ),
    });
  }
  if (activeGroupBy.includes("endpoint")) {
    headers.push({
      name: "endpoint",
      title: "Endpoint",
      value: (item) => <FilterableValueLink name="endpoint" value={item.endpoint} />,
    });
  }
  if (activeGroupBy.includes("params")) {
    headers.push({
      name: "params",
      title: "Params",
      value: (item) => <FilterableValueLink name="params" value={item.params} />,
    });
  }
  if (activeGroupBy.includes("status")) {
    headers.push({
      name: "status",
      title: "Status",
      value: (item) => (
        <FilterableValueLink name="status" value={item.status?.toString() ?? "{null}"}>
          <SimpleBadge title={item.status?.toString() ?? "?"} color={item.status?.toString().startsWith("4") ? Colors.RED : Colors.GREEN} />
        </FilterableValueLink>
      ),
    });
  }
  if (activeGroupBy.includes("tenantId")) {
    headers.push({
      name: "tenantId",
      title: "Tenant",
      value: (item) => {
        const tenant = data.allTenants.find((x) => x.id === item.tenantId);
        return <FilterableValueLink name="tenantId" value={tenant?.name ?? ""} />;
      },
    });
  }

  headers.push(
    {
      name: "apiCalls",
      title: "API calls",
      align: "right",
      value: (item) => (
        <div className="flex justify-end text-right">
          <Link to={getCountLink(item)} className="hover:underline">
            {NumberUtils.intFormat(Number(item._count._all))} {item._count._all === 1 ? "call" : "calls"}
          </Link>
        </div>
      ),
    },
    {
      name: "duration",
      title: "Avg. duration",
      value: (item) =>
        item._avg.duration === null ? (
          <span className="text-muted-foreground text-xs italic">-</span>
        ) : (
          <div>{NumberUtils.custom(Number(item._avg.duration), "0,0.001")} ms</div>
        ),
    },
    {
      name: "speed",
      title: "Speed",
      value: (item) =>
        item._avg.duration === null ? (
          <span className="text-muted-foreground text-xs italic">-</span>
        ) : (
          <ApiCallSpeedBadge duration={Number(item._avg.duration)} />
        ),
    },
    {
      name: "actions",
      title: "",
      value: (item) => (
        <Link to={getCountLink(item)} className="hover:underline">
          {t("shared.details")} <span className="ml-1">&rarr;</span>
        </Link>
      ),
    }
  );

  return headers;
};

interface Props {
  readonly data: {
    items: ApiCallSummaryDto[];
    allTenants: { id: string; name: string }[];
    filterableProperties: FilterablePropertyDto[];
  };
}

export default function ApiKeyLogsSummary({ data }: Props) {
  const { t } = useTranslation();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [groupBy, setGroupBy] = useState<string[]>(ApiKeyLogUtils.getGroupByValues(searchParams));

  const [headers, setHeaders] = useState<RowHeaderDisplayDto<ApiCallSummaryDto>[]>([]);

  useEffect(() => {
    const sortedGroupBy = ApiKeyLogUtils.getGroupByValues(searchParams).sort((a, b) => a.localeCompare(b));
    const sortedCurrentGroupBy = groupBy.slice().sort((a, b) => a.localeCompare(b));
    if (sortedGroupBy.join(",") !== sortedCurrentGroupBy.join(",")) {
      searchParams.delete("groupBy");
      groupBy.forEach((by) => {
        searchParams.append("groupBy", by);
      });
      setSearchParams(searchParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]);

  useEffect(() => {
    setHeaders(buildSummaryHeaders({ groupBy, params, data, t }));
  }, [data, groupBy, params, t]);

  return (
    <div className="space-y-2">
      <div className="flex w-full items-center space-x-2">
        <InputCombobox
          name="groupBy"
          prefix="Group by: "
          selectPlaceholder="Select group by"
          options={[
            { value: "method", name: "Method" },
            { value: "endpoint", name: "Endpoint" },
            { value: "params", name: "Params" },
            { value: "status", name: "Status" },
            { value: "tenantId", name: "Tenant" },
          ]}
          value={groupBy}
          onChange={(value) => {
            setGroupBy(value as string[]);
          }}
        />
        <div className="grow"></div>
        <InputFilters filters={data.filterableProperties} />
      </div>
      {groupBy.length === 0 ? (
        <WarningBanner title="Group by" text="Please select at least one group by" />
      ) : (
        <TableSimple items={data.items} headers={headers} />
      )}
    </div>
  );
}
