import CheckIcon from "~/components/ui/icons/CheckIcon";
import XIcon from "~/components/ui/icons/XIcon";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import TableSimple from "~/components/ui/tables/TableSimple";
import DateUtils from "~/utils/shared/DateUtils";
import { IGetMessagesData } from "../services/.server/NotificationService";

interface CreatedAtCellProps {
  readonly createdAt: Date;
}

const CreatedAtCell = ({ createdAt }: CreatedAtCellProps) => {
  return (
    <div className="flex flex-col">
      <div>{DateUtils.dateYMD(createdAt)}</div>
      <div className="text-xs">{DateUtils.dateAgo(createdAt)}</div>
    </div>
  );
};

interface StatusIconCellProps {
  readonly isActive: boolean;
}

const StatusIconCell = ({ isActive }: StatusIconCellProps) => {
  return <div>{isActive ? <CheckIcon className="text-theme-500 h-4 w-4" /> : <XIcon className="text-muted-foreground h-4 w-4" />}</div>;
};

interface PayloadCellProps {
  readonly payload: unknown;
}

const PayloadCell = ({ payload }: PayloadCellProps) => {
  return (
    <pre className="max-w-sm truncate">
      <ShowPayloadModalButton payload={payload} />
    </pre>
  );
};

const headers = [
  {
    name: "createdAt",
    title: "Created at",
    value: (i: IGetMessagesData["data"][number]) => <CreatedAtCell createdAt={i.createdAt} />,
  },
  { name: "templateIdentifier", title: "Template", value: (i: IGetMessagesData["data"][number]) => i.templateIdentifier },
  { name: "channel", title: "Channel", value: (i: IGetMessagesData["data"][number]) => i.channel },
  {
    name: "seen",
    title: "Seen",
    value: (i: IGetMessagesData["data"][number]) => <StatusIconCell isActive={i.seen} />,
  },
  {
    name: "read",
    title: "Read",
    value: (i: IGetMessagesData["data"][number]) => <StatusIconCell isActive={i.read} />,
  },
  {
    name: "payload",
    title: "Payload",
    value: (i: IGetMessagesData["data"][number]) => <PayloadCell payload={i.payload} />,
  },
  { name: "_id", title: "_id", value: (i: IGetMessagesData["data"][number]) => i._id },
] as const;

export default function NotificationMessagesTable({ items, withPagination = true }: { readonly items: IGetMessagesData | null; readonly withPagination?: boolean }) {
  return (
    <TableSimple
      items={items?.data ?? []}
      pagination={
        withPagination
          ? {
              page: (items?.page ?? 0) + 1,
              pageSize: items?.pageSize ?? 0,
              totalItems: items?.totalCount ?? 0,
              totalPages: Math.ceil((items?.totalCount ?? 0) / (items?.pageSize ?? 0)),
            }
          : undefined
      }
      headers={headers}
    ></TableSimple>
  );
}
