import { useTranslation } from "react-i18next";
import DateUtils from "~/utils/shared/DateUtils";
import { useEffect, useState } from "react";
import { LogWithDetails } from "~/utils/db/logs.db.server";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import TableSimple from "~/components/ui/tables/TableSimple";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import { Link } from "react-router";
import LogDetailsButton from "./LogDetailsButton";

interface Props {
  readonly items: LogWithDetails[];
  readonly withTenant: boolean;
  readonly pagination: PaginationDto;
}

function TenantCell({ item }: { readonly item: LogWithDetails }) {
  return (
    <div>
      {item.tenant ? (
        <Link to={`/app/${item.tenant?.slug}`} className="focus:bg-secondary/90 hover:border-border rounded-md border-b border-dashed border-transparent">
          {item.tenant.name}
        </Link>
      ) : (
        <div>-</div>
      )}
    </div>
  );
}

function ActionCell({ item }: { readonly item: LogWithDetails }) {
  return <div>{item.action}</div>;
}

function UrlCell({ item }: { readonly item: LogWithDetails }) {
  return <div>{item.url}</div>;
}

function DetailsCell({ item }: { readonly item: LogWithDetails }) {
  return <LogDetailsButton item={item} />;
}

function CreatedByCell({ item }: { readonly item: LogWithDetails }) {
  return (
    <div>
      {item.user && (
        <span>
          {item.user.firstName} {item.user.lastName} <span className=" text-muted-foreground text-xs">({item.user.email})</span>
        </span>
      )}
      {item.apiKey && (
        <span>
          API Key <span className=" text-muted-foreground text-xs">({item.apiKey.alias})</span>
        </span>
      )}
    </div>
  );
}

function CreatedAtCell({ item }: { readonly item: LogWithDetails }) {
  return (
    <div className="flex flex-col">
      <div>{DateUtils.dateYMD(item.createdAt)}</div>
      <div className="text-xs">{DateUtils.dateAgo(item.createdAt)}</div>
    </div>
  );
}

export default function LogsTable({ withTenant, items, pagination }: Readonly<Props>) {
  const { t } = useTranslation();

  const [headers, setHeaders] = useState<RowHeaderDisplayDto<LogWithDetails>[]>([]);

  useEffect(() => {
    let headers: RowHeaderDisplayDto<LogWithDetails>[] = [];
    if (withTenant) {
      headers.push({
        name: "tenant",
        title: t("models.tenant.object"),
        value: TenantCell,
        breakpoint: "sm",
      });
    }
    headers = [
      ...headers,
      {
        name: "action",
        title: t("models.log.action"),
        value: ActionCell,
      },
      {
        name: "url",
        title: t("models.log.url"),
        value: UrlCell,
      },
      {
        name: "details",
        title: t("models.log.details"),
        value: DetailsCell,
      },
      {
        name: "createdBy",
        title: t("shared.createdBy"),
        value: CreatedByCell,
      },
      {
        name: "createdAt",
        title: t("shared.createdAt"),
        value: (item) => DateUtils.dateAgo(item.createdAt),
        formattedValue: CreatedAtCell,
        className: "text-muted-foreground text-xs",
        breakpoint: "sm",
        sortable: true,
      },
    ];
    setHeaders(headers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withTenant]);

  return <TableSimple items={items} headers={headers} pagination={pagination} className={() => "text-sm"} />;
}
