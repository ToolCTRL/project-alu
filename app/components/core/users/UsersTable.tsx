import { Log, Role, User } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSubmit } from "react-router";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import TableSimple from "~/components/ui/tables/TableSimple";
import { UserWithDetails } from "~/utils/db/users.db.server";
import DateUtils from "~/utils/shared/DateUtils";
import UserBadge from "./UserBadge";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { RowHeaderActionDto } from "~/application/dtos/data/RowHeaderActionDto";

interface Props {
  readonly items: UserWithDetails[];
  readonly canImpersonate: boolean;
  readonly canChangePassword: boolean;
  readonly canSetUserRoles?: boolean;
  readonly canDelete: boolean;
  readonly pagination?: PaginationDto;
  readonly lastLogs?: { userId: string; log: Log }[];
}
export default function UsersTable({ items, canImpersonate, canChangePassword, canSetUserRoles, canDelete, pagination, lastLogs }: Readonly<Props>) {
  const { t } = useTranslation();
  const submit = useSubmit();

  const confirmDelete = useRef<RefConfirmModal>(null);

  const [headers, setHeaders] = useState<RowHeaderDisplayDto<UserWithDetails>[]>([]);
  const [actions, setActions] = useState<RowHeaderActionDto<UserWithDetails>[]>([]);

  const getUserRoles = (user: UserWithDetails, tenantId: string | null): Role[] => {
    const roles: Role[] = [];
    user.roles
      .filter((f) => (tenantId ? f.tenantId === tenantId && f.role.type === "app" : f.role.type === "admin"))
      .forEach((role) => {
        if (!roles.some((f) => f.name === role.role.name)) {
          roles.push(role.role);
        }
      });

    return roles.toSorted((a, b) => {
      if (a.type === b.type) {
        return a.order - b.order;
      }
      return a.type.localeCompare(b.type);
    });
  };

  const renderTenantRoles = (user: UserWithDetails, tenantItem: any, t: any) => {
    const roles = getUserRoles(user, tenantItem.tenantId);
    const roleNames = roles.map((x) => x.name).join(", ");

    if (roles.length > 0) {
      return (
        <span
          className="text-muted-foreground truncate text-xs italic"
          title={roleNames}
        >
          ({roleNames})
        </span>
      );
    }

    return <span className="truncate text-xs italic text-red-500">({t("app.users.undefinedRoles")})</span>;
  };

  const renderTenantItem = (user: UserWithDetails, tenantItem: any, t: any) => {
    return (
      <div key={tenantItem.id} className="truncate">
        <Link
          to={"/app/" + tenantItem.tenant.slug}
          className="focus:bg-secondary/90 hover:border-border border-b border-dashed border-transparent hover:border-dashed"
        >
          <span>{tenantItem.tenant.name}</span>
        </Link>{" "}
        {renderTenantRoles(user, tenantItem, t)}
      </div>
    );
  };

  const renderUserBadgeCell = (item: UserWithDetails) => {
    return <UserBadge item={item} admin={item.admin} withAvatar={true} withSignUpMethod={true} />;
  };

  const renderTenantsCell = (i: UserWithDetails, t: any) => {
    const rolesDisplay = getUserRoles(i, null)
      .map((x) => x.name)
      .join(", ");

    return (
      <div className="max-w-sm truncate">
        <div className="text-muted-foreground truncate italic" title={rolesDisplay}>
          {rolesDisplay}
        </div>
        {i.tenants.map((f) => renderTenantItem(i, f, t))}
      </div>
    );
  };

  const renderCreatedAtValue = (item: UserWithDetails) => {
    return (
      <time dateTime={DateUtils.dateYMDHMS(item.createdAt)} title={DateUtils.dateYMDHMS(item.createdAt)}>
        {DateUtils.dateAgo(item.createdAt)}
      </time>
    );
  };

  useEffect(() => {
    const headers: RowHeaderDisplayDto<UserWithDetails>[] = [
      {
        name: "user",
        title: t("models.user.object"),
        value: (i) => i.email,
        formattedValue: renderUserBadgeCell,
        sortBy: "email",
      },
      {
        name: "tenants",
        title: t("app.users.accountsAndRoles"),
        value: (i) => renderTenantsCell(i, t),
      },
      {
        name: "lastActivity",
        title: t("shared.lastActivity"),
        value: (item) => LastActivity({ item, lastLogs }),
      },
      {
        name: "createdAt",
        title: t("shared.createdAt"),
        value: (i) => DateUtils.dateDM(i.createdAt),
        formattedValue: renderCreatedAtValue,
        sortBy: "createdAt",
      },
    ];

    const actions: RowHeaderActionDto<UserWithDetails>[] = [];
    if (canImpersonate) {
      actions.push({
        title: t("models.user.impersonate"),
        onClick: (_, item) => impersonate(item),
      });
    }
    if (canChangePassword) {
      actions.push({
        title: t("settings.profile.changePassword"),
        onClick: (_, item) => changePassword(item),
      });
    }
    if (canSetUserRoles) {
      actions.push({
        title: t("admin.users.setAdminRoles"),
        onClickRoute: (_, item) => `/admin/accounts/users/${item.email}/roles`,
      });
    }
    if (canDelete) {
      actions.push({
        title: t("shared.delete"),
        onClick: (_, item) => deleteUser(item),
        destructive: true,
      });
    }

    setActions(actions);
    setHeaders(headers);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, lastLogs, t]);

  function impersonate(user: UserWithDetails) {
    const form = new FormData();
    form.set("action", "impersonate");
    form.set("user-id", user.id);
    submit(form, {
      action: "/admin/accounts/users",
      method: "post",
    });
  }
  function changePassword(user: UserWithDetails) {
    const password = prompt(t("settings.profile.changePassword") + " - " + user.email);
    if (password && confirm("[ADMINISTRATOR] Update password for user " + user.email + "?")) {
      const form = new FormData();
      form.set("action", "change-password");
      form.set("user-id", user.id);
      form.set("password-new", password);
      submit(form, {
        action: "/admin/accounts/users",
        method: "post",
      });
    }
  }
  function deleteUser(item: UserWithDetails) {
    if (confirmDelete.current) {
      confirmDelete.current.setValue(item);
      confirmDelete.current.show(t("shared.delete"), t("shared.delete"), t("shared.cancel"), t("admin.users.deleteWarning"));
    }
  }
  function confirmDeleteUser(item: User) {
    const form = new FormData();
    form.set("action", "delete-user");
    form.set("user-id", item.id);
    submit(form, {
      action: "/admin/accounts/users",
      method: "post",
    });
  }

  return (
    <div>
      <TableSimple items={items} headers={headers} actions={actions} pagination={pagination} />
      <ConfirmModal ref={confirmDelete} onYes={confirmDeleteUser} destructive />
    </div>
  );
}

function LastActivity({ item, lastLogs, action }: Readonly<{ item: UserWithDetails; lastLogs?: { userId: string; log: Log }[]; action?: string }>) {
  const lastLog = lastLogs?.find((f) => f.userId === item.id && (!action || f.log.action === action));
  if (lastLog) {
    return (
      <div className="text-muted-foreground text-sm">
        {!action && lastLog.log.action} {DateUtils.dateAgo(lastLog.log.createdAt)}
      </div>
    );
  }
  return null;
}
