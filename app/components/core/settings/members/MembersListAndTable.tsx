import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { TenantUserType } from "~/application/enums/tenants/TenantUserType";
import { TenantUserStatus } from "~/application/enums/tenants/TenantUserStatus";
import { TenantUserWithUser } from "~/utils/db/tenants.db.server";
import DateUtils from "~/utils/shared/DateUtils";
import UserBadge from "../../users/UserBadge";
import TableSimple from "~/components/ui/tables/TableSimple";

interface Props {
  items: TenantUserWithUser[];
}

function MemberUserCell({ item, t }: { readonly item: TenantUserWithUser; readonly t: (key: string) => string }) {
  return <UserBadge item={item.user} withAvatar={true} admin={item.user.admin} href={"edit/" + item.id} />;
}

function MemberRoleCell({ item, t }: { readonly item: TenantUserWithUser; readonly t: (key: string) => string }) {
  return <div>{t("settings.profile.types." + TenantUserType[item.type])}</div>;
}

function MemberStatusCell({ item, t }: { readonly item: TenantUserWithUser; readonly t: (key: string) => string }) {
  return <div>{t("settings.profile.status." + TenantUserStatus[item.status])}</div>;
}

function MemberCreatedAtCell({ item }: { readonly item: TenantUserWithUser }) {
  return (
    <time dateTime={DateUtils.dateYMDHMS(item.user.createdAt)} title={DateUtils.dateYMDHMS(item.user.createdAt)}>
      {DateUtils.dateAgo(item.user.createdAt)}
    </time>
  );
}

function MemberActionsCell({ item, t }: { readonly item: TenantUserWithUser; readonly t: (key: string) => string }) {
  return (
    <div className="flex items-center space-x-2">
      <Link to={"edit/" + item.id} className="flex items-center space-x-2 text-theme-600 hover:text-theme-900">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        <div>{t("shared.edit")}</div>
      </Link>
    </div>
  );
}

export default function MembersListAndTable({ items }: Readonly<Props>) {
  const { t } = useTranslation();

  return (
    <div>
      <TableSimple
        items={items}
        headers={[
          {
            name: "user",
            title: t("models.user.object"),
            value: (item) => MemberUserCell({ item, t }),
          },
          {
            name: "role",
            title: t("settings.profile.type"),
            value: (item) => MemberRoleCell({ item, t }),
          },
          {
            name: "status",
            title: t("shared.status"),
            value: (item) => MemberStatusCell({ item, t }),
          },
          {
            name: "createdAt",
            title: t("shared.createdAt"),
            value: (item) => MemberCreatedAtCell({ item }),
          },
          {
            name: "actions",
            title: t("shared.actions"),
            value: (item) => MemberActionsCell({ item, t }),
          },
        ]}
      />
    </div>
  );
}
