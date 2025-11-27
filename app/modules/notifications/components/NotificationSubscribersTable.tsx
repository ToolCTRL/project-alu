import { Link } from "react-router";
import UserBadge from "~/components/core/users/UserBadge";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import XIcon from "~/components/ui/icons/XIcon";
import TableSimple from "~/components/ui/tables/TableSimple";
import DateUtils from "~/utils/shared/DateUtils";
import { IGetSubscribersData } from "../services/.server/NotificationService";

interface SubscriberInfo {
  readonly subscriberId: string;
  readonly email: string | null;
  readonly firstName: string | null;
  readonly lastName: string | null;
}

interface SubscriberCellProps {
  readonly subscriber: SubscriberInfo;
}

const SubscriberCell = ({ subscriber }: SubscriberCellProps) => {
  return (
    <div>
      {subscriber.email ? (
        <Link to={"/admin/notifications/messages?subscriberId=" + subscriber.subscriberId}>
          <UserBadge
            item={{
              id: subscriber.subscriberId,
              email: subscriber.email,
              firstName: subscriber.firstName,
              lastName: subscriber.lastName,
            }}
          />
        </Link>
      ) : (
        <div>-</div>
      )}
    </div>
  );
};

interface DeletedStatusCellProps {
  readonly deleted: boolean;
}

const DeletedStatusCell = ({ deleted }: DeletedStatusCellProps) => {
  return <div>{deleted ? <CheckIcon className="text-theme-500 h-4 w-4" /> : <XIcon className="text-muted-foreground h-4 w-4" />}</div>;
};

export default function NotificationSubscribersTable({ items }: { readonly items: IGetSubscribersData | null }) {
  return (
    <TableSimple
      items={items?.data ?? []}
      pagination={{
        page: (items?.page ?? 0) + 1,
        pageSize: items?.pageSize ?? 0,
        totalItems: items?.totalCount ?? 0,
        totalPages: Math.ceil((items?.totalCount ?? 0) / (items?.pageSize ?? 0)),
      }}
      headers={[
        {
          name: "subscriber",
          title: "Subscriber",
          value: (i) => (
            <SubscriberCell
              subscriber={{
                subscriberId: i.subscriberId,
                email: i.email,
                firstName: i.firstName,
                lastName: i.lastName,
              }}
            />
          ),
        },
        { name: "createdAt", title: "createdAt", value: (i) => DateUtils.dateAgo(new Date(i.createdAt)) },
        { name: "updatedAt", title: "updatedAt", value: (i) => DateUtils.dateAgo(new Date(i.updatedAt)) },
        {
          name: "deleted",
          title: "deleted",
          value: (i) => <DeletedStatusCell deleted={i.deleted} />,
        },
      ]}
    ></TableSimple>
  );
}
