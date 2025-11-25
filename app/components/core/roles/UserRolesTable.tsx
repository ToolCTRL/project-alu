import { useTranslation } from "react-i18next";
import EmptyState from "~/components/ui/emptyState/EmptyState";
import { RoleWithPermissions } from "~/utils/db/permissions/roles.db.server";
import { UserWithRoles } from "~/utils/db/users.db.server";
import UserBadge from "../users/UserBadge";
import clsx from "clsx";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import XIcon from "~/components/ui/icons/XIcon";
import { Link } from "react-router";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";

interface Props {
  items: UserWithRoles[];
  roles: RoleWithPermissions[];
  className?: string;
  onChange: (item: UserWithRoles, role: RoleWithPermissions, add: any) => void;
  tenantId?: string | null;
  disabled?: boolean;
  onRoleClick?: (role: RoleWithPermissions) => void;
  actions?: {
    onEditRoute?: (item: UserWithRoles) => string;
    onImpersonate?: (item: UserWithRoles) => void;
  };
}

function renderRoleHeader(role: RoleWithPermissions, onRoleClick?: (role: RoleWithPermissions) => void) {
  if (onRoleClick) {
    return (
      <button type="button" onClick={() => onRoleClick(role)} className="hover:underline">
        {role.name}
      </button>
    );
  }
  return <div>{role.name}</div>;
}

function renderRoleCell(
  item: UserWithRoles,
  role: RoleWithPermissions,
  tenantId: string | null,
  disabled: boolean | undefined,
  onChange: (item: UserWithRoles, role: RoleWithPermissions, add: any) => void
) {
  const existing = item.roles.find((f) => f.roleId === role.id && f.tenantId === tenantId) !== undefined;

  return (
    <td key={role.name} className="text-muted-foreground whitespace-nowrap px-1 py-1 text-center text-sm">
      <div className="flex justify-center">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(item, role, !existing)}
          className={clsx(
            "flex h-6 w-6 items-center justify-center rounded-full",
            existing ? "bg-background text-foreground" : "text-muted-foreground",
            !disabled && existing && "hover:bg-green-200 hover:text-green-600 dark:hover:bg-green-900 dark:hover:text-green-50",
            !disabled && !existing && "hover:text-muted-foreground dark:hover:bg-secondary hover:bg-gray-200"
          )}
        >
          {existing ? <CheckIcon className="h-4 w-4 text-green-500" /> : <XIcon className="text-muted-foreground h-4 w-4" />}
        </button>
      </div>
    </td>
  );
}

export default function UserRolesTable({ items, roles, className, onChange, tenantId = null, disabled, onRoleClick, actions }: Props) {
  const { t } = useTranslation();
  const appOrAdminData = useAppOrAdminData();

  function renderContent() {
    if (items.length === 0) {
      return (
        <div>
          <EmptyState
            className="bg-background"
            captions={{
              thereAreNo: t("app.users.empty"),
            }}
          />
        </div>
      );
    }

    return (
      <div>
        <div>
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="border-border overflow-hidden border shadow-xs sm:rounded-lg">
                  <table className="divide-border min-w-full divide-y">
                          <thead className="bg-secondary">
                            <tr>
                              <th
                                scope="col"
                                className="text-muted-foreground w-64 select-none truncate px-1 py-1 pl-4 text-left text-xs font-medium tracking-wider"
                              >
                                <div className="text-muted-foreground flex items-center space-x-1">
                                  <div>{t("models.user.plural")}</div>
                                </div>
                              </th>

                              {roles.map((role) => {
                                return (
                                  <th
                                    key={role.id}
                                    scope="col"
                                    className="text-muted-foreground select-none truncate px-1 py-1 text-center text-xs font-medium tracking-wider"
                                  >
                                    <div className="text-muted-foreground flex items-center justify-center space-x-1">
                                      {renderRoleHeader(role, onRoleClick)}
                                    </div>
                                  </th>
                                );
                              })}

                              {actions && (
                                <td className="text-muted-foreground select-none truncate px-1 py-1 text-center text-xs font-medium tracking-wider"></td>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-border bg-background divide-y">
                            {items.map((item) => {
                              return (
                                <tr key={item.id}>
                                  <td className="text-muted-foreground whitespace-nowrap px-1 py-1 pl-4 text-sm">
                                    <UserBadge
                                      item={item}
                                      withAvatar={true}
                                      admin={item.admin}
                                      href={!actions?.onEditRoute ? undefined : actions.onEditRoute(item)}
                                      roles={item.roles}
                                    />
                                  </td>
                                  {roles.map((role) => renderRoleCell(item, role, tenantId, disabled, onChange))}
                                  {actions && (
                                    <td className="text-muted-foreground whitespace-nowrap px-1 py-1 text-center text-sm">
                                      <div className="flex items-center space-x-2">
                                        {actions.onImpersonate && (
                                          <button
                                            type="button"
                                            disabled={item.id === appOrAdminData.user.id}
                                            onClick={() => (actions?.onImpersonate ? actions?.onImpersonate(item) : {})}
                                            className={clsx(
                                              "text-muted-foreground",
                                              item.id !== appOrAdminData.user.id ? "hover:underline" : "cursor-not-allowed"
                                            )}
                                          >
                                            {t("models.user.impersonate")}
                                          </button>
                                        )}
                                        {actions.onEditRoute && (
                                          <Link to={actions?.onEditRoute(item)} className="text-muted-foreground hover:underline">
                                            {t("shared.edit")}
                                          </Link>
                                        )}
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>{renderContent()}</div>;
}
