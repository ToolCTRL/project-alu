import clsx from "clsx";
import { Fragment, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { Colors } from "~/application/enums/shared/Colors";
import ColorBadge from "../badges/ColorBadge";
import PlusIcon from "../icons/PlusIcon";

export type KanbanColumn<T> = {
  name: string;
  title: string | ReactNode;
  color?: Colors;
  value: (item: T) => any;
  onClick?: (item: T) => void;
  onClickRoute?: (item: T) => string;
  onNewRoute?: (columnValue: string) => string;
};

interface Props<T> {
  readonly columns: readonly KanbanColumn<T>[];
  readonly column: string;
  readonly items: readonly T[];
  readonly filterValue: (item: T, column: KanbanColumn<T> | null) => boolean;
  readonly undefinedColumn?: KanbanColumn<T>;
  readonly className?: string;
  readonly renderEmpty?: ReactNode;
  readonly classNameWidth?: string;
}

export default function KanbanSimple<T>({ columns, items, column, filterValue, undefinedColumn, className, renderEmpty, classNameWidth }: Readonly<Props<T>>) {
  function getItems(column: KanbanColumn<T> | null) {
    return items.filter((f: T) => filterValue(f, column));
  }
  return (
    <div>
      <div className={clsx(className, "flex overflow-hidden overflow-x-auto")}>
        {undefinedColumn && getItems(null).length > 0 && (
          <KanbanColumnCard idx={0} key={column.length} items={getItems(null)} columns={columns} column={undefinedColumn} classNameWidth={classNameWidth} />
        )}
        {columns.map((column, idx) => {
          return <KanbanColumnCard idx={idx + 1} key={column.name} items={getItems(column)} columns={columns} column={column} classNameWidth={classNameWidth} />;
        })}
      </div>

      {items.length === 0 && renderEmpty && <Fragment>{renderEmpty}</Fragment>}
    </div>
  );
}

interface KanbanColumnCardProps<T> {
  readonly idx: number;
  readonly columns: readonly KanbanColumn<T>[];
  readonly column: KanbanColumn<T>;
  readonly items: readonly T[];
  readonly classNameWidth?: string;
}
function KanbanColumnCard<T>({ idx, columns, column, items, classNameWidth }: Readonly<KanbanColumnCardProps<T>>) {
  const { t } = useTranslation();
  return (
    <div
      className={clsx(
        "shrink-0 space-y-2 divide-y divide-gray-300 text-sm",
        classNameWidth ||
          clsx(
            columns.length === 1 && "w-64 lg:w-full",
            columns.length === 2 && "w-64 lg:w-1/2",
            columns.length === 3 && "w-64 lg:w-1/3",
            columns.length === 4 && "w-64 lg:w-1/4",
            columns.length === 5 && "w-64 lg:w-1/5",
            columns.length > 5 && "w-64"
          )
      )}
    >
      <div className="flex justify-between space-x-2">
        <div className="flex items-center space-x-2">
          {column?.color !== undefined && (
            <div>
              <ColorBadge color={column.color} />
            </div>
          )}
          <div>{column?.title ?? t("shared.undefined")}</div>
        </div>
      </div>

      <div
        className={clsx(
          "border-border bg-secondary h-full overflow-x-hidden border-0 border-dashed px-2 py-3",
          idx === 0 && "border-r-0",
          idx === columns.length && "border-l-0"
        )}
      >
        <div className="space-y-3">
          {items.map((item) => {
            const itemKey = typeof item === 'object' && item !== null && 'id' in item
              ? String((item as any).id)
              : JSON.stringify(item);
            return (
              <div key={itemKey} className="hover:bg-secondary group w-full text-left shadow-2xs">
                {column?.onClickRoute ? (
                  <Link to={column.onClickRoute(item)}>{column.value(item)}</Link>
                ) : (
                  <button type="button" onClick={() => column?.onClick?.(item)}>
                    {column.value(item)}
                  </button>
                )}
              </div>
            );
          })}

          {column?.onNewRoute && (
            <Link
              className="border-border text-muted-foreground hover:bg-background hover:text-foreground/80 flex w-full items-center justify-center space-x-2 rounded-md border p-2 text-center text-xs font-medium"
              to={column.onNewRoute(column.name)}
            >
              <div>Add</div>
              <PlusIcon className="h-3 w-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
