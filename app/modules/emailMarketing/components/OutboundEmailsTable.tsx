import { Link, useParams } from "react-router";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import { Colors } from "~/application/enums/shared/Colors";
import { OutboundEmailWithDetails } from "~/modules/emailMarketing/db/outboundEmails.db.server";
import { EntityWithDetails } from "~/utils/db/entities/entities.db.server";
import RowHelper from "~/utils/helpers/RowHelper";
import DateUtils from "~/utils/shared/DateUtils";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import XIcon from "~/components/ui/icons/XIcon";
import Modal from "~/components/ui/modals/Modal";
import TableSimple from "~/components/ui/tables/TableSimple";

interface EmailCellProps {
  item: OutboundEmailWithDetails;
  contactEntity?: EntityWithDetails;
  t: (key: string) => string;
}

function EmailCell({ item, contactEntity, t }: Readonly<EmailCellProps>) {
  return (
    <div className="flex flex-col">
      <div>
        {item.contactRow && contactEntity ? (
          <div>{RowHelper.getTextDescription({ entity: contactEntity, item: item.contactRow, t })}</div>
        ) : (
          <div className="text-muted-foreground text-xs italic">
            <div>{item.email}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function SentAtCell({ item }: Readonly<{ item: OutboundEmailWithDetails }>) {
  return (
    <div className="flex justify-center">
      {item.sentAt ? <OutboundEmailDateFormat date={item.sentAt} /> : <XIcon className="h-4 w-4 text-red-500" />}
    </div>
  );
}

function DeliveredCell({ item }: Readonly<{ item: OutboundEmailWithDetails }>) {
  return (
    <div className="flex justify-center">
      {item.deliveredAt ? <CheckIcon className="h-4 w-4 text-teal-500" /> : <XIcon className="h-4 w-4 text-red-500" />}
    </div>
  );
}

interface ActivityCellProps {
  item: OutboundEmailWithDetails;
  onSelectEmail: (email: OutboundEmailWithDetails) => void;
  t: (key: string) => string;
}

function ActivityCell({ item, onSelectEmail, t }: Readonly<ActivityCellProps>) {
  return (
    <div className="flex flex-col justify-start space-y-1 text-left">
      <button
        type="button"
        disabled={item.opens.length === 0}
        onClick={() => onSelectEmail(item)}
        className={clsx(
          item.opens.length === 0 ? "text-muted-foreground cursor-not-allowed text-left" : "text-blue-600 underline",
          "text-muted-foreground lowercase"
        )}
      >
        {item.opens.length} {t("emails.opens")}
      </button>
      <button
        type="button"
        disabled={item.clicks.length === 0}
        onClick={() => onSelectEmail(item)}
        className={clsx(
          item.clicks.length === 0 ? "text-muted-foreground cursor-not-allowed text-left" : "text-blue-600 underline",
          "text-muted-foreground lowercase"
        )}
      >
        {item.clicks.length} {t("emails.clicks")}
      </button>
    </div>
  );
}

function ErrorCell({ item }: Readonly<{ item: OutboundEmailWithDetails }>) {
  return <div className="text-red-500">{item.error}</div>;
}

interface CampaignCellProps {
  item: OutboundEmailWithDetails;
  tenant?: string;
  t: (key: string) => string;
}

function CampaignCell({ item, tenant, t }: Readonly<CampaignCellProps>) {
  return (
    <div>
      {item.campaignId ? (
        <Link
          to={tenant ? `/admin/${tenant}/email-marketing/campaigns/${item.campaignId}` : `/admin/email-marketing/campaigns/${item.campaignId}`}
          className="focus:bg-secondary/90 hover:border-border rounded-md border-b border-dashed border-transparent"
        >
          {item.campaign?.name}
        </Link>
      ) : (
        <div>{item.isPreview ? <SimpleBadge title={t("shared.preview")} color={Colors.GRAY} /> : <div>-</div>}</div>
      )}
    </div>
  );
}

function DateCell({ item }: Readonly<{ item: OutboundEmailWithDetails }>) {
  return (
    <div className="text-muted-foreground">{DateUtils.dateYMDHMS(item.createdAt)}</div>
  );
}

function TypeCell({ item }: Readonly<{ item: { type: "click" | "open" } }>) {
  return <>{item.type === "open" ? "Open" : "Click"}</>;
}

function DescriptionCell({ item }: Readonly<{ item: { description: string } }>) {
  return <>{item.description}</>;
}

export default function OutboundEmailsTable({
  items,
  pagination,
  withCampaign,
  allEntities,
}: Readonly<{
  items: OutboundEmailWithDetails[];
  pagination?: PaginationDto;
  withCampaign?: boolean;
  allEntities: EntityWithDetails[];
}>) {
  const { t } = useTranslation();
  const params = useParams();
  const [contactEntity, setContactEntity] = useState<EntityWithDetails>();
  const [selectedEmail, setSelectedEmail] = useState<OutboundEmailWithDetails>();

  useEffect(() => {
    setContactEntity(allEntities.find((e) => e.name === "contact"));
  }, [allEntities]);

  const renderEmail = useCallback(
    (i: OutboundEmailWithDetails) => <EmailCell item={i} contactEntity={contactEntity} t={t} />,
    [contactEntity, t]
  );
  const renderSentAt = useCallback((i: OutboundEmailWithDetails) => <SentAtCell item={i} />, []);
  const renderDelivered = useCallback((i: OutboundEmailWithDetails) => <DeliveredCell item={i} />, []);
  const renderActivity = useCallback(
    (i: OutboundEmailWithDetails) => <ActivityCell item={i} onSelectEmail={setSelectedEmail} t={t} />,
    [t]
  );
  const renderError = useCallback((i: OutboundEmailWithDetails) => <ErrorCell item={i} />, []);
  const renderUnsubscribed = useCallback((i: OutboundEmailWithDetails) => <OutboundEmailDateFormat date={i.unsubscribedAt} />, []);
  const renderBounced = useCallback((i: OutboundEmailWithDetails) => <OutboundEmailDateFormat date={i.bouncedAt} />, []);
  const renderSpamComplained = useCallback((i: OutboundEmailWithDetails) => <OutboundEmailDateFormat date={i.spamComplainedAt} />, []);
  const renderCampaign = useCallback(
    (item: OutboundEmailWithDetails) => <CampaignCell item={item} tenant={params.tenant} t={t} />,
    [params.tenant, t]
  );
  const headers = useMemo<RowHeaderDisplayDto<OutboundEmailWithDetails>[]>(() => {
    const baseHeaders: RowHeaderDisplayDto<OutboundEmailWithDetails>[] = [
      {
        name: "email",
        title: t("emails.to"),
        value: renderEmail,
      },
      {
        name: "sentAt",
        title: t("emails.sentAt"),
        value: renderSentAt,
      },
      {
        name: "delivered",
        title: t("emails.delivered"),
        value: renderDelivered,
      },
      {
        name: "activity",
        title: t("emailMarketing.activity"),
        value: renderActivity,
      },
      {
        name: "error",
        title: t("shared.error"),
        value: renderError,
      },
      {
        name: "unsubscribedAt",
        title: t("emails.unsubscribedAt"),
        value: renderUnsubscribed,
      },
      {
        name: "bouncedAt",
        title: t("emails.bouncedAt"),
        value: renderBounced,
      },
      {
        name: "spamComplainedAt",
        title: t("emails.spamComplainedAt"),
        value: renderSpamComplained,
      },
    ];

    if (withCampaign) {
      baseHeaders.unshift({
        name: "campaignId",
        title: t("emailMarketing.campaign"),
        value: renderCampaign,
      });
    }

    return baseHeaders;
  }, [renderActivity, renderBounced, renderCampaign, renderDelivered, renderEmail, renderError, renderSentAt, renderSpamComplained, renderUnsubscribed, t, withCampaign]);
  return (
    <div>
      <TableSimple headers={headers} items={items} pagination={pagination} />
      <Modal className="sm:max-w-md" open={!!selectedEmail} setOpen={() => setSelectedEmail(undefined)}>
        <div className="space-y-2">
          <div>
            <h3 className="text-foreground text-lg font-medium leading-6">{t("emails.emailActivity")}</h3>
          </div>
          <div className="border-border overflow-hidden rounded-md border-2 border-dashed">
            <div className="h-64 overflow-y-auto">{selectedEmail && <OutboundEmailActivity email={selectedEmail} />}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

type OutboundEmailActivityItem = { type: "click" | "open"; createdAt: Date; description: string };

const outboundEmailActivityHeaders: RowHeaderDisplayDto<OutboundEmailActivityItem>[] = [
  {
    name: "createdAt",
    title: "Date",
    value: (i) => <DateCell item={i} />,
  },
  {
    name: "type",
    title: "Type",
    value: (i) => <TypeCell item={i} />,
  },
  {
    name: "description",
    title: "Description",
    value: (i) => <DescriptionCell item={i} />,
    className: "w-full",
  },
];

function OutboundEmailDateFormat({ date }: Readonly<{ date: Date | null }>) {
  return (
    <>
      {date && (
        <div title={DateUtils.dateYMDHMS(date)} className="flex flex-col">
          <div>{DateUtils.dateYMD(date)}</div>
          <div className="text-xs">{DateUtils.dateAgo(date)}</div>
        </div>
      )}
    </>
  );
}

function OutboundEmailActivity({ email }: Readonly<{ email: OutboundEmailWithDetails }>) {
  const [items, setItems] = useState<OutboundEmailActivityItem[]>([]);
  const headers = useMemo(() => outboundEmailActivityHeaders, []);
  useEffect(() => {
    const items: { type: "click" | "open"; createdAt: Date; description: string }[] = [];
    email.opens.forEach((o) => {
      items.push({
        type: "open",
        createdAt: o.createdAt,
        description: o.firstOpen ? "First open" : "",
      });
    });
    email.clicks.forEach((c) => {
      items.push({
        type: "click",
        createdAt: c.createdAt,
        description: c.link,
      });
    });
    setItems(items.toSorted((a, b) => (b.createdAt > a.createdAt ? -1 : 1)));
  }, [email]);
  return (
    <TableSimple
      items={items}
      headers={headers}
    />
  );
}
