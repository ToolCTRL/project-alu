import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import RowDisplayValueHelper from "~/utils/helpers/RowDisplayValueHelper";
import ButtonTertiary from "../buttons/ButtonTertiary";
import TablePagination from "./TablePagination";
import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { RowHeaderActionDto } from "~/application/dtos/data/RowHeaderActionDto";
import DownArrow from "../icons/DownArrow";
import UpArrow from "../icons/UpArrow";
import ConfirmModal, { RefConfirmModal } from "../modals/ConfirmModal";
import { Checkbox } from "../checkbox";

interface Props<T> {
  readonly headers: ReadonlyArray<RowHeaderDisplayDto<T>>;
  readonly items: ReadonlyArray<T>;
  readonly actions?: ReadonlyArray<RowHeaderActionDto<T>>;
  readonly pagination?: PaginationDto;
  readonly onClickRoute?: (idx: number, item: T) => string | undefined;
  readonly selectedRows?: ReadonlyArray<T>;
  readonly onSelected?: (item: T[]) => void;
  readonly className?: (idx: number, item: T) => string;
  readonly padding?: string;
  readonly noRecords?: ReactNode;
  readonly emptyState?: { title: string; description: string; icon?: ReactNode };
  readonly darkMode?: boolean;
}

export default function TableSimple<T>(props: Readonly<Props<T>>) {
  const [showChild, setShowChild] = useState(false);

  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    // You can show some kind of placeholder UI here
    return null;
  }

  return <Table {...props} />;
}

function Table<T>({
  headers,
  items,
  actions = [],
  pagination,
  onClickRoute,
  selectedRows,
  onSelected,
  className,
  padding = "px-2 py-2",
  noRecords,
  emptyState,
  darkMode,
}: Readonly<Props<T>>) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState<{ by: string; order: "asc" | "desc" }[]>();

  useEffect(() => {
    let sort = searchParams.get("sort");
    const sortArray = sort?.split(",") ?? [];
    const sortObject = sortArray.map((s) => {
      let order: "asc" | "desc" = "asc";
      if (s.startsWith("-")) {
        order = "desc";
      }
      return { by: s.replace("-", ""), order };
    });
    setSortBy(sortObject);
  }, [searchParams]);

  function toggleSelected(_: number, item: T) {
    if (selectedRows && onSelected) {
      if (selectedRows.includes(item)) {
        onSelected(selectedRows.filter((i) => i !== item));
      } else {
        onSelected([...selectedRows, item]);
      }
    }
  }

  const checkbox = useRef(null);
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useLayoutEffect(() => {
    if (selectedRows && onSelected) {
      const isIndeterminate = selectedRows.length > 0 && selectedRows.length < items.length;
      setChecked(selectedRows.length === items.length && items.length > 0);
      setIndeterminate(isIndeterminate);
      // @ts-ignore
      checkbox.current.indeterminate = isIndeterminate;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onSelected, selectedRows]);

  function toggleAll() {
    if (selectedRows && onSelected) {
      onSelected(checked || indeterminate ? [] : items);
      setChecked(!checked && !indeterminate);
      setIndeterminate(false);
    }
  }

  function onHeaderClick(header: RowHeaderDisplayDto<T>) {
    if (!header.sortBy) {
      return;
    }
    let currentSort = sortBy?.find((s) => s.by === header.sortBy);
    let newSort = header.sortBy;
    if (currentSort?.order === "asc") {
      newSort = `-${header.sortBy}`;
    }
    searchParams.set("sort", newSort);
    setSearchParams(searchParams);
  }

  function getSortDirection(header: RowHeaderDisplayDto<T>) {
    if (!header.sortBy) {
      return;
    }
    let currentSort = sortBy?.find((s) => s.by === header.sortBy);
    if (!currentSort) {
      return;
    }
    return currentSort.order;
  }

  return (
    <div className={clsx("shadow-2xs border-border w-full overflow-hidden rounded-lg border", darkMode && "")}>
      <div className="bg-background w-full overflow-x-auto">
        <table className="whitespace-no-wrap w-full">
          <thead className={clsx("", darkMode && "")}>
            <tr className={clsx("border-border text-muted-foreground border-b text-left text-xs font-semibold tracking-wide", darkMode && "")}>
              {actions.some((f) => f.firstColumn) && <th scope="col" className="px-2 py-1"></th>}
              {onSelected && (
                <th scope="col" className="relative w-10 px-6 py-5 sm:w-12 sm:px-6">
                  <Checkbox
                    title="Select all"
                    ref={checkbox}
                    className="text-primary-foreground focus:ring-ring border-border absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded sm:left-6"
                    checked={checked}
                    onCheckedChange={toggleAll}
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
              )}
              {headers
                .filter((f) => !f.hidden)
                .map((header) => {
                  const alignment = getAlignment(header.align);
                  return (
                    <th
                      key={header.name ?? header.title}
                      scope="col"
                      onClick={() => onHeaderClick(header)}
                      className={clsx(
                        actions.some((f) => f.firstColumn) ? "" : "pl-3",
                        "whitespace-nowrap px-2 py-2 tracking-wider",
                        header.breakpoint === "sm" && "hidden sm:table-cell",
                        header.breakpoint === "md" && "mg:table-cell hidden",
                        header.breakpoint === "lg" && "hidden lg:table-cell",
                        header.breakpoint === "xl" && "hidden xl:table-cell",
                        header.breakpoint === "2xl" && "hidden 2xl:table-cell",
                        header.sortBy && "cursor-pointer"
                      )}
                    >
                      <div
                        className={clsx("group flex space-x-2", alignment)}
                      >
                        <div className={clsx(header.className, "select-none truncate")}>{t(header.title)}</div>
                        {header.sortBy && (
                          <div className="text text-muted-foreground group-hover:text-foreground">
                            {getSortDirection(header) === "desc" ? (
                              <DownArrow className="h-4 w-4" />
                            ) : (
                              getSortDirection(header) === "asc" && <UpArrow className="h-4 w-4" />
                            )}
                          </div>
                        )}
                      </div>
                    </th>
                  );
                })}
              {actions.some((f) => !f.firstColumn) && <th scope="col" className="px-2 py-1"></th>}
            </tr>
          </thead>
          <tbody className={clsx("divide-divide divide-y", darkMode && "")}>
            {items.length === 0 ? (
              <tr className={clsx("", darkMode && "")}>
                <td colSpan={headers.filter((f) => !f.hidden).length + actions.length + (onSelected ? 1 : 0)} className="text-center">
                  {noRecords ??
                    (emptyState ? (
                      <div className="space-y-1">
                        <div className="font-medium">{emptyState.title}</div>
                        <div>{emptyState.description}</div>
                      </div>
                    ) : (
                      <div className="text-muted-foreground p-3 text-sm">
                        <span>{t("shared.noRecords")}</span>
                      </div>
                    ))}
                </td>
              </tr>
            ) : (
              items.map((item, idxRow) => {
                const href = onClickRoute?.(idxRow, item);
                return (
                  <tr
                    key={
                      (item as { id?: string | number; key?: string | number })?.id ??
                      (item as { key?: string | number })?.key ??
                      JSON.stringify(item)
                    }
                    onClick={href ? (e) => handleRowClick(e, href, navigate) : undefined}
                    className={clsx("group", href && "hover:bg-secondary cursor-pointer", darkMode && "")}
                  >
                    <ActionsCells actions={actions.filter((f) => f.firstColumn)} className={className} item={item} idxRow={idxRow} />
                    {onSelected && (
                      <td className={clsx("relative w-10 px-6 sm:w-12 sm:px-6", darkMode && "")}>
                        {selectedRows?.includes(item) && <div className="bg-primary absolute inset-y-0 left-0 w-0.5" />}
                        <div className="flex items-center space-x-1">
                          <Checkbox
                            title="Select"
                            className="text-primary-foreground focus:ring-ring border-border absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded sm:left-6"
                            checked={selectedRows?.includes(item)}
                            onCheckedChange={(e) => {
                              toggleSelected(idxRow, item);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </td>
                    )}
                    {headers
                      .filter((f) => !f.hidden)
                      .map((header) => {
                        return (
                          <td
                            key={`${header.name ?? header.title}-value`}
                            className={clsx(
                              actions.some((f) => f.firstColumn) ? "" : "pl-4",
                              "whitespace-nowrap text-sm",
                              darkMode && "",
                              header.className,
                              padding ?? "px-2 py-2",
                              header.breakpoint === "sm" && "hidden sm:table-cell",
                              header.breakpoint === "md" && "mg:table-cell hidden",
                              header.breakpoint === "lg" && "hidden lg:table-cell",
                              header.breakpoint === "xl" && "hidden xl:table-cell",
                              header.breakpoint === "2xl" && "hidden 2xl:table-cell",
                              className?.(idxRow, item)
                            )}
                          >
                            {RowDisplayValueHelper.displayRowValue(t, header, item, idxRow)}
                          </td>
                        );
                      })}
                    <ActionsCells actions={actions.filter((f) => !f.firstColumn)} className={className} item={item} idxRow={idxRow} />
                  </tr>
                );
              })
            )}

          </tbody>
        </table>
      </div>
      {pagination && (
        <TablePagination totalItems={pagination.totalItems} totalPages={pagination.totalPages} page={pagination.page} pageSize={pagination.pageSize} />
      )}
    </div>
  );
}

function getAlignment(align: string | undefined): string {
  if (align === "right") return "justify-end";
  if (align === "center") return "justify-center";
  if (align === "left") return "justify-start";
  return "justify-between";
}

function handleRowClick(e: React.MouseEvent, href: string, navigate: (path: string) => void) {
  if (e.ctrlKey || e.metaKey) {
    globalThis.open(href, "_blank");
  } else {
    navigate(href);
  }
}

function ActionsCells<T>({
  item,
  actions,
  idxRow,
  className,
}: Readonly<{
  readonly item: T;
  readonly actions: RowHeaderActionDto<T>[];
  readonly idxRow: number;
  readonly className?: (idx: number, item: T) => string;
}>) {
  const { t } = useTranslation();
  const refConfirm = useRef<RefConfirmModal>(null);
  function onConfirmed({ action, item }: { action: RowHeaderActionDto<T>; item: T }) {
    if (action.onClick) {
      action.onClick(idxRow, item);
    }
  }
  return (
    <>
      {actions && actions.length > 0 && (
        <td className={clsx("whitespace-nowrap px-2 py-1", className?.(idxRow, item))}>
          <div className="flex space-x-2">
            {actions
              .filter((f) => (f.hidden ? !f.hidden(item) : true))
              .map((action) => {
                const actionKey =
                  (action.title && action.title.toString()) ||
                  action.onClick?.name ||
                  action.onClickRouteTarget ||
                  `action-${idxRow}`;
                return (
                  <ButtonTertiary
                    disabled={action.disabled !== undefined ? action.disabled(item) : action.disabled}
                    key={actionKey}
                    destructive={action.renderIsDestructive !== undefined ? action.renderIsDestructive(item) : action.destructive}
                    prefetch={action.prefetch}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (action.onClick) {
                        if (action.confirmation) {
                          const confirmation = action.confirmation(item);
                          refConfirm.current?.setDestructive(action.destructive || false);
                          refConfirm.current?.setValue({
                            action: action,
                            item: item,
                          });
                          refConfirm.current?.show(confirmation.title, t("shared.confirm"), t("shared.cancel"), confirmation.description);
                        } else {
                          action.onClick(idxRow, item);
                        }
                      }
                    }}
                    to={action.onClickRoute?.(idxRow, item)}
                    target={action.onClickRouteTarget}
                  >
                    {action.renderTitle ? action.renderTitle(item) : action.title}
                  </ButtonTertiary>
                );
              })}
          </div>
          <ConfirmModal ref={refConfirm} onYes={onConfirmed} />
        </td>
      )}
    </>
  );
}
