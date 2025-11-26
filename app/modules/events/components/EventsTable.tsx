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
        headers={[
          {
            name: "event",
            title: t("models.event.object"),
            value: (i) => i.name,
            formattedValue: (i) => <Badge variant="secondary">{i.name}</Badge>,
          },
          {
            name: "data",
            title: t("models.event.data"),
            value: (i) => (
              <button type="button" onClick={() => setSelectedData(i)} className="hover:text-theme-500 truncate underline">
                {i.description}
              </button>
            ),
            className: "w-full",
          },
          {
            name: "tenant",
            title: t("models.tenant.object"),
            value: (i) => (
              <div className="text-xs">
                {i.tenant ? (
                  <Fragment>
                    <div className="font-medium">{i.tenant?.name}</div>
                    <Link
                      to={"/app/" + i.tenant?.slug}
                      target="_blank"
                      className="text-muted-foreground focus:bg-secondary/90 hover:border-border rounded-md border-b border-dashed text-xs hover:border-dashed"
                    >
                      <span>/{i.tenant.slug}</span>
                    </Link>
                  </Fragment>
                ) : (
                  <span className="text-muted-foreground italic">?</span>
                )}
              </div>
            ),
            hidden: !!params.tenant,
          },
          {
            name: "createdAt",
            title: t("shared.createdAt"),
            value: (i) => (
              <div className="text-xs">
                <div>{i.user?.email ?? <span className="text-muted-foreground italic">?</span>}</div>
                <div className="text-muted-foreground text-xs">{DateUtils.dateAgo(i.createdAt)}</div>
              </div>
            ),
          },
        ]}
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
