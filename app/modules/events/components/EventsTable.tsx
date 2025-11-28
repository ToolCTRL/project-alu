import { Link, useParams } from "react-router";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { Colors } from "~/application/enums/shared/Colors";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import ExternalLinkEmptyIcon from "~/components/ui/icons/ExternalLinkEmptyIcon";
import OpenModal from "~/components/ui/modals/OpenModal";
import TableSimple from "~/components/ui/tables/TableSimple";
import DateUtils from "~/utils/shared/DateUtils";
import { EventWithAttempts } from "../db/events.db.server";
import MonacoEditor from "~/components/editors/MonacoEditor";
import { Badge } from "~/components/ui/badge";

interface Props {
  readonly items: EventWithAttempts[];
  readonly pagination: PaginationDto;
}

const buildHeaders = ({
  t,
  paramsTenant,
  onSelectData,
}: {
  t: ReturnType<typeof useTranslation>["t"];
  paramsTenant?: string;
  onSelectData: (item: EventWithAttempts) => void;
}) =>
  [
    {
      name: "event",
      title: t("models.event.object"),
      value: (i: EventWithAttempts) => i.name,
      formattedValue: (i: EventWithAttempts) => <EventBadge name={i.name} />,
    },
    {
      name: "data",
      title: t("models.event.data"),
      value: (i: EventWithAttempts) => <DataButton item={i} onClick={onSelectData} />,
      className: "w-full",
    },
    {
      name: "tenant",
      title: t("models.tenant.object"),
      value: (i: EventWithAttempts) => (
        <div className="text-xs">
          <TenantInfo item={i} tenant={paramsTenant} />
        </div>
      ),
      hidden: !!paramsTenant,
    },
    {
      name: "createdAt",
      title: t("shared.createdAt"),
      value: (i: EventWithAttempts) => <CreatedAtInfo item={i} />,
    },
  ] as const;

function EventBadge({ name }: { readonly name: string }) {
  return <Badge variant="secondary">{name}</Badge>;
}

function DataButton({ item, onClick }: { readonly item: EventWithAttempts; readonly onClick: (item: EventWithAttempts) => void }) {
  return (
    <button type="button" onClick={() => onClick(item)} className="hover:text-theme-500 truncate underline">
      {item.description}
    </button>
  );
}

function TenantInfo({ item, tenant }: { readonly item: EventWithAttempts; readonly tenant: string | undefined }) {
  if (!item.tenant) {
    return <span className="text-muted-foreground italic">?</span>;
  }
  return (
    <Fragment>
      <div className="font-medium">{item.tenant?.name}</div>
      <Link
        to={"/app/" + item.tenant?.slug}
        target="_blank"
        className="text-muted-foreground focus:bg-secondary/90 hover:border-border rounded-md border-b border-dashed text-xs hover:border-dashed"
      >
        <span>/{item.tenant.slug}</span>
      </Link>
    </Fragment>
  );
}

function CreatedAtInfo({ item }: { readonly item: EventWithAttempts }) {
  return (
    <div className="text-xs">
      <div>{item.user?.email ?? <span className="text-muted-foreground italic">?</span>}</div>
      <div className="text-muted-foreground text-xs">{DateUtils.dateAgo(item.createdAt)}</div>
    </div>
  );
}
export default function EventsTable({ items, pagination }: Props) {
  const { t } = useTranslation();
  const params = useParams();
  const [selectedData, setSelectedData] = useState<EventWithAttempts | undefined>(undefined);
  const formattedData = (item: EventWithAttempts) => {
    try {
      return JSON.stringify(JSON.parse(item.data), null, 2);
    } catch {
      return item.data;
    }
  };
  return (
    <>
      <TableSimple
        items={items}
        actions={[
          {
            title: t("shared.details"),
            onClickRoute: (_, i) => i.id,
          },
        ]}
        pagination={pagination}
        headers={buildHeaders({ t, paramsTenant: params.tenant, onSelectData: setSelectedData })}
      />

      {selectedData && (
        <OpenModal className="max-w-md" onClose={() => setSelectedData(undefined)}>
          <div className="space-y-3 text-sm">
            <div className="border-border flex justify-between border-b pb-3">
              <h3>
                <SimpleBadge className="text-lg" title={selectedData.name} color={Colors.VIOLET} />
              </h3>
              <div className="flex items-center space-x-2">
                <div className="text-muted-foreground text-sm">{DateUtils.dateYMDHMS(selectedData.createdAt)}</div>
                <Link to={selectedData.id} className="text-muted-foreground hover:text-foreground/80">
                  <ExternalLinkEmptyIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold">{t("models.event.data")}</p>
              <div className="h-96 overflow-auto p-2">
                <MonacoEditor value={formattedData(selectedData)} onChange={() => {}} theme="vs-dark" language="json" />
              </div>
            </div>
          </div>
        </OpenModal>
      )}
    </>
  );
}
