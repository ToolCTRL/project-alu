import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import TableSimple from "~/components/ui/tables/TableSimple";
import { PermissionWithRoles } from "~/utils/db/permissions/permissions.db.server";
import RoleBadge from "./RoleBadge";
import OrderListButtons from "~/components/ui/sort/OrderListButtons";

interface Props {
  items: PermissionWithRoles[];
  className?: string;
  canCreate: boolean;
  canUpdate: boolean;
  tenantId?: string | null;
  canReorder?: boolean;
}

function PermissionNameCell({ item }: { readonly item: PermissionWithRoles }) {
  return <RoleBadge item={item} />;
}

function PermissionRolesCell({ item }: { readonly item: PermissionWithRoles }) {
  return (
    <div className="w-64 truncate">
      <span className="max-w-sm truncate text-sm italic">
        {item.inRoles
          .sort((a, b) => a.role.order - b.role.order)
          .map((f) => f.role.name)
          .join(", ")}
      </span>
    </div>
  );
}

function PermissionOrderCell({ item, idx, items }: { readonly item: PermissionWithRoles; readonly idx: number; readonly items: PermissionWithRoles[] }) {
  return (
    <div>
      {item.order}
      <OrderListButtons index={idx} items={items.map((f) => ({ ...f, order: f.order ?? 0 }))} editable={true} />
    </div>
  );
}

function PermissionNameCellFormatted(item: PermissionWithRoles) {
  return <PermissionNameCell item={item} />;
}

function PermissionRolesCellFormatted(item: PermissionWithRoles) {
  return <PermissionRolesCell item={item} />;
}

function PermissionOrderCellFormatted(item: PermissionWithRoles, idx: number, items: PermissionWithRoles[]) {
  return <PermissionOrderCell item={item} idx={idx} items={items} />;
}

export default function PermissionsTable({ items, className, canCreate, canUpdate = true, tenantId, canReorder }: Readonly<Props>): JSX.Element {
  const { t } = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [actions, setActions] = useState<any[]>([]);
  const [headers, setHeaders] = useState<RowHeaderDisplayDto<PermissionWithRoles>[]>([]);

  useEffect(() => {
    if (canUpdate) {
      setActions([
        {
          title: t("shared.edit"),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClickRoute: (_: any, item: any) => item.id,
        },
      ]);
    }

    const headers: RowHeaderDisplayDto<PermissionWithRoles>[] = [
      {
        name: "name",
        title: t("models.permission.name"),
        value: (i) => i.name,
        formattedValue: PermissionNameCellFormatted,
        className: "max-w-xs truncate",
      },
      {
        name: "description",
        title: t("models.permission.description"),
        value: (i) => i.description,
        className: "max-w-xs truncate",
      },
      {
        name: "roles",
        title: t("models.permission.inRoles"),
        value: (i) => i.inRoles.length,
        formattedValue: PermissionRolesCellFormatted,
        className: canUpdate ? "max-w-xs truncate" : "",
      },
    ];

    if (canReorder) {
      headers.unshift({
        name: "order",
        title: t("shared.order"),
        formattedValue: PermissionOrderCellFormatted,
      });
    }

    setHeaders(headers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUpdate]);

  return (
    <div>
      <TableSimple actions={actions} headers={headers} items={items} />
    </div>
  );
}
