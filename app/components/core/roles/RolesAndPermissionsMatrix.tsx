import { Permission } from "@prisma/client";
import clsx from "clsx";
import { useState } from "react";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import XIcon from "~/components/ui/icons/XIcon";
import InputSearch from "~/components/ui/input/InputSearch";
import TableSimple from "~/components/ui/tables/TableSimple";
import { RoleWithPermissions } from "~/utils/db/permissions/roles.db.server";

interface Props {
  roles: RoleWithPermissions[];
  permissions: Permission[];
  className?: string;
}
function createPermissionHeader(): RowHeaderDisplayDto<Permission> {
  return {
    name: "permission",
    title: "Permission",
    className: "w-full",
    value: (item) => (
      <div className="max-w-xs truncate">
        <div>{item.name}</div>
        <div className="text-muted-foreground truncate text-sm">{item.description}</div>
      </div>
    ),
  };
}

function createRoleHeader(role: RoleWithPermissions): RowHeaderDisplayDto<Permission> {
  const existing = (permission: Permission) => role.permissions.find((f) => f.permission.name === permission.name);

  return {
    name: role.name,
    title: `${role.name} (${role.permissions.length})`,
    align: "center",
    value: (permission) => {
      const hasPermission = existing(permission);
      return (
        <div className="flex justify-center">
          <div
            className={clsx("flex h-6 w-6 items-center justify-center rounded-full", hasPermission ? "bg-background text-foreground" : "text-muted-foreground")}
          >
            {hasPermission ? <CheckIcon className="h-4 w-4 text-green-500" /> : <XIcon className="text-muted-foreground h-4 w-4" />}
          </div>
        </div>
      );
    },
  };
}

export default function RolesAndPermissionsMatrix({ roles, permissions, className }: Props) {
  const [searchInput, setSearchInput] = useState("");

  function getHeaders() {
    const headers: RowHeaderDisplayDto<Permission>[] = [createPermissionHeader()];
    roles.forEach((role) => {
      headers.push(createRoleHeader(role));
    });
    return headers;
  }
  function filteredItems() {
    if (!searchInput) return permissions;
    return permissions.filter(
      (f) => f.name.toLowerCase().includes(searchInput.toLowerCase()) || f.description.toLowerCase().includes(searchInput.toLowerCase())
    );
  }
  return (
    <div className="space-y-2">
      <InputSearch value={searchInput} setValue={setSearchInput} />
      <div className={className}>
        <TableSimple items={filteredItems()} headers={getHeaders()} />
      </div>
    </div>
  );
}
