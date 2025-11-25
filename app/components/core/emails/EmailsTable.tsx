import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import PaperClipIcon from "~/components/ui/icons/PaperClipIcon";
import RightIcon from "~/components/ui/icons/RightIcon";
import TableSimple from "~/components/ui/tables/TableSimple";
import { EmailWithSimpleDetails } from "~/utils/db/email/emails.db.server";
import DateUtils from "~/utils/shared/DateUtils";

interface Props {
  items: EmailWithSimpleDetails[];
  withTenant: boolean;
  pagination: PaginationDto;
}

// Extracted component definitions
const FromCell = ({ item }: { item: EmailWithSimpleDetails }) => (
  <div className="flex w-40 flex-col truncate">
    <div className={clsx("truncate", item._count.reads === 0 && "text-foreground font-medium")}>{item.fromName}</div>
    <div className="truncate">{item.fromEmail}</div>
  </div>
);

const ToCell = ({ item }: { item: EmailWithSimpleDetails }) => (
  <div className="flex w-40 flex-col truncate">
    <div className={clsx("truncate", item._count.reads === 0 && "text-foreground font-medium")}>{item.toName}</div>
    <div className="truncate">{item.toEmail}</div>
  </div>
);

const SubjectCell = ({ item }: { item: EmailWithSimpleDetails }) => (
  <div className="flex max-w-sm items-center space-x-1 truncate">
    <div className={clsx(item._count.reads === 0 && "text-foreground font-medium")}>{item.subject}</div>
    <div className="text-muted-foreground">-</div>
    <div className="text-muted-foreground truncate font-light">{item.textBody}</div>
  </div>
);

const AttachmentsCell = ({ item }: { item: EmailWithSimpleDetails }) => (
  <div>{item._count.attachments > 0 && <PaperClipIcon className="text-muted-foreground h-4 w-4" />}</div>
);

export default function EmailsTable({ items, withTenant, pagination }: Props) {
  const { t } = useTranslation();
  const [headers, setHeaders] = useState<RowHeaderDisplayDto<EmailWithSimpleDetails>[]>([]);

  useEffect(() => {
    const headers: RowHeaderDisplayDto<EmailWithSimpleDetails>[] = [];
    if (withTenant) {
      const tenantHeader: RowHeaderDisplayDto<EmailWithSimpleDetails> = {
        name: "tenant",
        title: t("models.tenant.object"),
        value: (i) => i.tenantInboundAddress?.tenant.name ?? "-",
      };
      headers.push(tenantHeader);
    }
    const fromHeader: RowHeaderDisplayDto<EmailWithSimpleDetails> = {
      name: "from",
      title: t("models.email.from"),
      value: (i) => i.fromEmail,
      formattedValue: (i) => <FromCell item={i} />,
    };
    const toHeader: RowHeaderDisplayDto<EmailWithSimpleDetails> = {
      name: "to",
      title: t("models.email.to"),
      value: (i) => i.toEmail,
      formattedValue: (i) => <ToCell item={i} />,
    };
    const subjectHeader: RowHeaderDisplayDto<EmailWithSimpleDetails> = {
      name: "subject",
      title: t("models.email.subject"),
      value: (i) => i.subject,
      formattedValue: (i) => <SubjectCell item={i} />,
      href: (i) => i.id,
    };
    const attachmentsHeader: RowHeaderDisplayDto<EmailWithSimpleDetails> = {
      name: "attachments",
      title: "",
      value: (i) => i._count.attachments,
      formattedValue: (i) => <AttachmentsCell item={i} />,
    };
    const dateHeader: RowHeaderDisplayDto<EmailWithSimpleDetails> = {
      name: "date",
      title: t("models.email.date"),
      value: (i) => DateUtils.dateAgo(i.date),
    };
    headers.push(fromHeader, toHeader, subjectHeader, attachmentsHeader, dateHeader);
    setHeaders(headers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withTenant]);

  return (
    <div>
      <TableSimple
        onClickRoute={(_, i) => i.id}
        className={(_, i) =>
          i._count.reads === 0 ? "group-hover:border-theme-500 bg-background cursor-pointer" : "group-hover:border-theme-500 bg-secondary/90 cursor-pointer"
        }
        items={items}
        actions={[
          {
            title: <RightIcon className="h-4 w-4" />,
            onClickRoute: (_, i) => i.id,
          },
        ]}
        headers={headers}
        pagination={pagination}
      />
    </div>
  );
}
