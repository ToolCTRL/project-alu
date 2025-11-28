import RowsListAndTable from "./RowsListAndTable";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";
import { EntityWithDetails, PropertyWithDetails } from "~/utils/db/entities/entities.db.server";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { ColumnDto } from "~/application/dtos/data/ColumnDto";
import { useTranslation } from "react-i18next";
import { Colors } from "~/application/enums/shared/Colors";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Link, useParams, useFetcher } from "react-router";
import { EntitiesApi } from "~/utils/api/.server/EntitiesApi";
import GridContainer from "~/components/ui/lists/GridContainer";
import { EntityViewWithDetails } from "~/utils/db/entities/entityViews.db.server";
import EntityHelper from "~/utils/helpers/EntityHelper";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import clsx from "clsx";
import EntityViewHelper from "~/utils/helpers/EntityViewHelper";
import RowColumnsHelper from "~/utils/helpers/RowColumnsHelper";
import { PropertyType } from "~/application/enums/entities/PropertyType";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import EmptyState from "~/components/ui/emptyState/EmptyState";
import RenderCard from "./RenderCard";
import RowsLoadMoreCard from "~/components/ui/tables/RowsLoadMoreCard";
import { DragDropContext, Draggable, Droppable, DropResult } from "@hello-pangea/dnd";
import RowHelper from "~/utils/helpers/RowHelper";
import NumberUtils from "~/utils/shared/NumberUtils";
import ColorBadge from "~/components/ui/badges/ColorBadge";
import { createPortal } from "react-dom";

interface Props {
  view: "table" | "board" | "grid" | "card";
  items: RowWithDetails[];
  routes?: EntitiesApi.Routes;
  pagination?: PaginationDto;
  onEditRow?: (row: RowWithDetails) => void;
  currentView?: EntityViewWithDetails | null;
  selectedRows?: RowWithDetails[];
  onSelected?: (item: RowWithDetails[]) => void;
  readOnly?: boolean;
  onClickRoute?: (row: RowWithDetails) => string;
  onRemove?: (row: RowWithDetails) => void;
  ignoreColumns?: string[];
  columns?: ColumnDto[];
  actions?: (row: RowWithDetails) => {
    title?: string;
    href?: string;
    onClick?: () => void;
    isLoading?: boolean;
    render?: React.ReactNode;
  }[];
  leftHeaders?: RowHeaderDisplayDto<RowWithDetails>[];
  rightHeaders?: RowHeaderDisplayDto<RowWithDetails>[];
}
export default function RowsList(props: Props & { entity: EntityWithDetails | string }) {
  const appOrAdminData = useAppOrAdminData();

  const [entity, setEntity] = useState<EntityWithDetails>();
  const [columns, setColumns] = useState<ColumnDto[]>([]);
  const [groupBy, setGroupBy] = useState<{ property?: PropertyWithDetails } | undefined>();

  const resolveEntity = (): EntityWithDetails | undefined => {
    if (typeof props.entity === "string") {
      return appOrAdminData.entities.find((e) => e.name === props.entity);
    }
    return props.entity;
  };

  const filterColumnsByIgnoreList = (columns: ColumnDto[]): ColumnDto[] => {
    if (props.ignoreColumns) {
      return columns.filter((f) => !props.ignoreColumns?.includes(f.name));
    }
    return columns;
  };

  const getDefaultBoardGroupBy = (entity: EntityWithDetails): { property?: PropertyWithDetails } | undefined => {
    const property = entity.properties.find((f) => f.type === PropertyType.SELECT && !f.isHidden);
    return property ? { property } : undefined;
  };

  const processDefaultView = (entity: EntityWithDetails, groupBy: { property?: PropertyWithDetails } | undefined) => {
    let columns = RowColumnsHelper.getDefaultEntityColumns(entity);

    if (props.view === "board") {
      columns = columns.filter((f) => f.name !== groupBy?.property?.name);
    }

    columns = filterColumnsByIgnoreList(columns);

    if (props.view === "board") {
      groupBy = getDefaultBoardGroupBy(entity);
    }

    return { columns, groupBy };
  };

  const processViewWithLayout = (entity: EntityWithDetails, view: any, groupBy: { property?: PropertyWithDetails } | undefined) => {
    let columns = view.properties
      .sort((a: any, b: any) => a.order - b.order)
      .map((f: any) => ({ name: f.name ?? "", title: "", visible: true }));

    columns = filterColumnsByIgnoreList(columns);

    if (view.layout === "board") {
      columns = columns.filter((f) => f.name !== groupBy?.property?.name);
    }

    if (view.groupByPropertyId) {
      const property = entity.properties.find((f) => f.id === view?.groupByPropertyId);
      if (property) {
        groupBy = { property };
      }
    }

    return { columns, groupBy };
  };

  useEffect(() => {
    const entity = resolveEntity();
    if (!entity) {
      setEntity(undefined);
      setColumns([]);
      setGroupBy(undefined);
      return;
    }

    const systemView = entity.views.find((f) => f.isSystem);
    const view = props.currentView ?? systemView;

    let result;
    if (view) {
      result = processViewWithLayout(entity, view, undefined);
    } else {
      result = processDefaultView(entity, undefined);
    }

    let finalColumns = props.columns ?? result.columns;

    setEntity(entity);
    setColumns(finalColumns);
    setGroupBy(result.groupBy);
  }, [appOrAdminData.entities, props]);

  if (entity == null || columns.length === 0) {
    return null;
  }

  return <RowsListWrapped {...props} entity={entity} columns={columns} groupBy={groupBy} />;
}

function RowsListWrapped({
  view,
  entity,
  items,
  routes,
  columns,
  pagination,
  groupBy,
  onEditRow,
  currentView,
  selectedRows,
  onSelected,
  readOnly,
  onClickRoute,
  onRemove,
  actions,
  leftHeaders,
  rightHeaders,
}: Props & {
  entity: EntityWithDetails;
  columns: ColumnDto[];
  groupBy?: { property?: PropertyWithDetails };
}) {
  const { t } = useTranslation();
  const params = useParams();
  const appOrAdminData = useAppOrAdminData();

  return (
    <Fragment>
      {view == "table" && (
        <RowsListAndTable
          columns={columns}
          entity={entity}
          items={items}
          pagination={pagination}
          routes={routes}
          onFolioClick={onEditRow}
          onEditClick={onEditRow}
          onRelatedRowClick={onEditRow}
          allEntities={appOrAdminData.entities}
          editable={!readOnly}
          selectedRows={selectedRows}
          onSelected={onSelected}
          onRemove={onRemove}
          leftHeaders={leftHeaders}
          rightHeaders={rightHeaders}
        />
      )}
      {view === "board" && groupBy && (
        <AdvancedBoard
          entity={entity}
          columnsDef={columns}
          groupBy={groupBy.property}
          items={items}
          routes={routes}
          actions={actions}
          allEntities={appOrAdminData.entities}
          readOnly={readOnly}
          t={t}
        />
      )}
      {view === "grid" && (
        <Fragment>
          {items.length === 0 ? (
            <EmptyState
              className="w-full py-8"
              // to={EntityHelper.getRoutes({ routes, entity })?.new ?? ""}
              captions={{
                // new: "Add",
                thereAreNo: "No " + t(entity.titlePlural),
              }}
            />
          ) : (
            <div className="space-y-2">
              <GridContainer {...(currentView ? EntityViewHelper.getGridLayout(currentView) : { columns: 3, gap: "xs" })}>
                {items.map((item) => {
                  const href = onClickRoute ? onClickRoute(item) : EntityHelper.getRoutes({ routes, entity, item })?.overview;
                  if (onSelected && selectedRows !== undefined) {
                    return (
                      <ButtonSelectWrapper key={item.id} item={item} onSelected={onSelected} selectedRows={selectedRows}>
                        <RenderCard
                          layout={view}
                          item={item}
                          entity={entity}
                          columns={columns}
                          allEntities={appOrAdminData.entities}
                          routes={routes}
                          actions={actions}
                        />
                      </ButtonSelectWrapper>
                    );
                  }
                  const card = (
                    <div className={clsx("bg-background group relative rounded-md text-left", href && "hover:bg-secondary")}>
                      <RemoveButton item={item} readOnly={readOnly} onRemove={onRemove} />
                      <RenderCard
                        layout={view}
                        item={item}
                        entity={entity}
                        columns={columns}
                        allEntities={appOrAdminData.entities}
                        routes={routes}
                        actions={actions}
                        href={href}
                      />
                    </div>
                  );
                  return href ? (
                    <Link key={item.id} to={href}>
                      {card}
                    </Link>
                  ) : (
                    card
                  );
                })}
                {(() => {
                  if (items.length === 0) {
                    return readOnly ? <EmptyCard className="w-full" /> : <AddMoreCard entity={entity} routes={routes} />;
                  }
                  return <RowsLoadMoreCard pagination={pagination} currentView={currentView} />;
                })()}
              </GridContainer>
            </div>
          )}
        </Fragment>
      )}
      {view === "card" && (
        <Fragment>
          {items.length === 0 ? (
            <EmptyState
              className="w-full py-8"
              // to={EntityHelper.getRoutes({ routes, entity })?.new ?? ""}
              captions={{
                // new: "Add",
                thereAreNo: "No " + t(entity.titlePlural),
              }}
            />
          ) : (
            <div className="flex space-x-2 overflow-x-scroll">
              {items.map((item) => {
                let className = clsx("w-64");
                if (onSelected && selectedRows !== undefined) {
                  return (
                    <ButtonSelectWrapper className={clsx("group relative")} key={item.id} item={item} onSelected={onSelected} selectedRows={selectedRows}>
                      <div className={className}>
                        <RemoveButton item={item} readOnly={readOnly} onRemove={onRemove} />
                        <RenderCard
                          layout={view}
                          item={item}
                          entity={entity}
                          columns={columns}
                          allEntities={appOrAdminData.entities}
                          routes={routes}
                          actions={actions}
                        />
                      </div>
                    </ButtonSelectWrapper>
                  );
                }
                const href = onClickRoute ? onClickRoute(item) : EntityHelper.getRoutes({ routes, entity, item })?.overview ?? undefined;
                const card = (
                  <div className={clsx(className, "group relative rounded-md text-left", href && "hover:bg-secondary")}>
                    <div className={className}>
                      <RemoveButton item={item} readOnly={readOnly} onRemove={onRemove} />
                      <RenderCard
                        layout={view}
                        item={item}
                        entity={entity}
                        columns={columns}
                        allEntities={appOrAdminData.entities}
                        routes={routes}
                        actions={actions}
                        href={href}
                      />
                    </div>
                  </div>
                );
                return href ? (
                  <Link to={`${EntityHelper.getEntityRoute({ entity, params, appOrAdminData })}/${item.id}`} key={item.id} className="group relative">
                    {/* <RowLinkButton entityName={entity.name} id={item.id} /> */}
                    {card}
                  </Link>
                ) : (
                  card
                );
              })}
              {items.length === 0 ? (
                <Fragment>{readOnly ? <EmptyCard className="w-full" /> : <AddMoreCard className="w-64" entity={entity} routes={routes} />}</Fragment>
              ) : (
                <Fragment>
                  {!readOnly && <AddMoreCard className="w-64" entity={entity} routes={routes} />}
                  <RowsLoadMoreCard className="w-64" pagination={pagination} currentView={currentView} />
                </Fragment>
              )}
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}

type BoardColumnState = { [key: string]: RowWithDetails[] };

type DraggableRowCardProps = {
  readonly row: RowWithDetails;
  readonly index: number;
  readonly portal: HTMLElement | null;
  readonly pendingMove: string | null;
  readonly errorRow: string | null;
  readonly compactCards: boolean;
  readonly MinimalCard: ({ row }: { row: RowWithDetails }) => JSX.Element;
  readonly entity: EntityWithDetails;
  readonly columnsDef: ColumnDto[];
  readonly allEntities: EntityWithDetails[];
  readonly routes?: EntitiesApi.Routes;
  readonly actions?: (row: RowWithDetails) => any[];
};

const DraggableRowCard = ({
  row,
  index,
  portal,
  pendingMove,
  errorRow,
  compactCards,
  MinimalCard,
  entity,
  columnsDef,
  allEntities,
  routes,
  actions,
}: DraggableRowCardProps) => (
  <Draggable draggableId={row.id} index={index}>
    {(dragProvided, snapshot) => {
      const card = (
        <div
          ref={dragProvided.innerRef}
          {...dragProvided.draggableProps}
          {...dragProvided.dragHandleProps}
          className={clsx(
            "bg-white/10 border-white/20 group relative rounded-md border p-2 shadow-2xs transition text-white",
            snapshot.isDragging && "border-theme-400 shadow-md",
            pendingMove === row.id && "opacity-70",
            errorRow === row.id && "border-red-500"
          )}
        >
          {compactCards ? (
            <MinimalCard row={row} />
          ) : (
            <RenderCard layout="board" item={row} entity={entity} columns={columnsDef} allEntities={allEntities} routes={routes} actions={actions} />
          )}
        </div>
      );
      return snapshot.isDragging && portal ? createPortal(card, portal) : card;
    }}
  </Draggable>
);

function MinimalCardContent({ entity, row }: Readonly<{ entity: EntityWithDetails; row: RowWithDetails }>) {
  const displayProp = entity.properties.find((p) => p.isDisplay);
  const title = displayProp
    ? RowHelper.getPropertyValue({ entity, item: row, property: displayProp }) ??
      RowHelper.getPropertyValue({ entity, item: row, propertyName: displayProp.name })
    : row.id;

  const pick = (propNames: string[]) => {
    for (const name of propNames) {
      const prop = entity.properties.find((p) => p.name === name);
      if (prop) return prop;
    }
    return null;
  };

  const amountProp = pick(["amount", "value"]);
  const lastActivityProp = pick(["lastActivity", "lastActivityAt", "lastActivityDate"]);
  const contactProp = pick(["contact", "primaryContact", "contactName", "owner", "assignedTo"]);

  const renderLine = (prop: PropertyWithDetails | null, label?: string) => {
    if (!prop) return null;
    const val = RowHelper.getPropertyValue({ entity, item: row, property: prop, propertyName: prop.name });
    if (val === null || val === undefined) return null;
    let text: string | number = "";
    if (prop.type === PropertyType.NUMBER) {
      text = NumberUtils.numberFormat(Number(val));
    } else if (prop.type === PropertyType.DATE) {
      text = new Date(val as any).toLocaleDateString();
    } else {
      text = val as any;
    }
    return (
      <div key={prop.id} className="text-[11px] text-white/80">
        {label ?? prop.title}: <span className="text-white">{text}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-1 rounded-md bg-white p-3 text-xs text-slate-900 shadow ring-1 ring-slate-200">
      <div className="truncate text-sm font-semibold text-slate-900">{title as any}</div>
      {renderLine(amountProp, "Amount")}
      {renderLine(lastActivityProp, "Letzte Aktivität")}
      {renderLine(contactProp, "Kontakt")}
    </div>
  );
}

function MinimalCard({ entity, row }: Readonly<{ entity: EntityWithDetails; row: RowWithDetails }>) {
  return <MinimalCardContent entity={entity} row={row} />;
}

function AdvancedBoard({
  entity,
  columnsDef,
  groupBy,
  items,
  routes,
  actions,
  allEntities,
  readOnly,
  t,
}: {
  readonly entity: EntityWithDetails;
  readonly columnsDef: ColumnDto[];
  readonly groupBy?: PropertyWithDetails;
  readonly items: RowWithDetails[];
  readonly routes?: EntitiesApi.Routes;
  readonly actions?: (row: RowWithDetails) => { title?: string; href?: string; onClick?: () => void; isLoading?: boolean; render?: React.ReactNode }[];
  readonly allEntities: EntityWithDetails[];
  readonly readOnly?: boolean;
  readonly t: ReturnType<typeof useTranslation>["t"];
}) {
  const fetcher = useFetcher();
  const columnWidth = 240;
  const portal = document === undefined ? null : document.body;

  function applyOverrides(list: RowWithDetails[], map: Record<string, RowWithDetails>) {
    return list.map((row) => map[row.id] ?? row);
  }

  function patchRowStage(row: RowWithDetails, property?: PropertyWithDetails, value?: string) {
    if (!property) return row;
    const patchedValues = row.values.map((v) => {
      if (v.propertyId === property.id) {
        return { ...v, textValue: value ?? null, numberValue: null, dateValue: null, booleanValue: null };
      }
      return v;
    });
    const hasProp = patchedValues.some((v) => v.propertyId === property.id);
    const finalValues = hasProp
      ? patchedValues
      : [
          ...patchedValues,
          {
            id: `${row.id}-${property.id}`,
            propertyId: property.id,
            textValue: value ?? null,
            numberValue: null,
            dateValue: null,
            booleanValue: null,
            rowId: row.id,
            tenantId: row.tenantId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as any,
        ];
    return { ...row, values: finalValues };
  }

  const columnIds = useMemo(() => {
    const ids = groupBy?.options.map((opt) => opt.value) ?? [];
    const allowUndefined = !(groupBy?.isRequired ?? false);
    return allowUndefined ? [...ids, "__undefined"] : ids;
  }, [groupBy]);

  const resolveAggregateProperty = useMemo(() => {
    const preferred = new Set(["value", "amount"]);
    const numeric = entity.properties.filter((p) => p.type === PropertyType.NUMBER);
    return numeric.find((p) => preferred.has(p.name)) ?? numeric[0] ?? null;
  }, [entity.properties]);

  const buildColumnState = useMemo(
    () =>
      (rows: RowWithDetails[]): BoardColumnState => {
        const initial: BoardColumnState = {};
        columnIds.forEach((id) => (initial[id] = []));
        rows.forEach((row) => {
          const raw = RowHelper.getPropertyValue({ entity, item: row, property: groupBy });
          const key = raw ? raw.toString() : "__undefined";
          if (!initial[key]) {
            initial[key] = [];
          }
          initial[key].push(row);
        });
        return initial;
      },
    [columnIds, entity, groupBy]
  );

  const [overrides, setOverrides] = useState<Record<string, RowWithDetails>>({});
  const [columnItems, setColumnItems] = useState<BoardColumnState>(() => buildColumnState(applyOverrides(items, overrides)));
  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const [errorRow, setErrorRow] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [compactCards, setCompactCards] = useState(true);
  const [hideEmpty, setHideEmpty] = useState(false);

  const itemsSignature = useMemo(() => {
    const stageName = groupBy?.name;
    return items
      .map((row) => {
        const stageVal = stageName ? RowHelper.getPropertyValue({ entity, item: row, propertyName: stageName }) ?? "" : "";
        return `${row.id}:${stageVal}`;
      })
      .join("|");
  }, [entity, groupBy?.name, items]);

  useEffect(() => {
    if (pendingMove) {
      return;
    }
    const merged = applyOverrides(items, overrides);
    setColumnItems(buildColumnState(merged));
    setPendingMove(null);
    setErrorRow(null);
    setErrorMessage(null);
  }, [buildColumnState, items, itemsSignature, overrides]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.error) {
        setColumnItems(buildColumnState(items));
        setErrorRow(pendingMove);
        setErrorMessage(fetcher.data.error);
        if (pendingMove) {
          setOverrides((prev) => {
            const copy = { ...prev };
            delete copy[pendingMove];
            return copy;
          });
        }
      } else {
        if (fetcher.data.updated) {
          setOverrides((prev) => ({ ...prev, [fetcher.data.updated.id]: fetcher.data.updated }));
          setColumnItems(buildColumnState(applyOverrides(items, { ...overrides, [fetcher.data.updated.id]: fetcher.data.updated })));
        }
        setPendingMove(null);
        setErrorRow(null);
        setErrorMessage(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.state, fetcher.data, itemsSignature]);

  function getAggregate(columnId: string) {
    const rows = columnItems[columnId] ?? [];
    const count = rows.length;
    if (!resolveAggregateProperty) {
      return { count, sum: null as number | null };
    }
    const sum = rows.reduce((acc, row) => {
      const val = RowHelper.getPropertyValue({ entity, item: row, property: resolveAggregateProperty });
      const num = typeof val === "number" ? val : Number(val ?? 0);
      return acc + (Number.isNaN(num) ? 0 : num);
    }, 0);
    return { count, sum };
  }

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    const sourceList = Array.from(columnItems[sourceCol] ?? []);
    const [moved] = sourceList.splice(source.index, 1);
    if (!moved) return;
    const movedPatched = patchRowStage(moved, groupBy, destCol === "__undefined" ? "" : destCol);
    const destList = sourceCol === destCol ? sourceList : Array.from(columnItems[destCol] ?? []);
    destList.splice(destination.index, 0, movedPatched);

    const optimisticState = {
      ...columnItems,
      [sourceCol]: sourceCol === destCol ? destList : sourceList,
      [destCol]: destList,
    };
    setColumnItems(optimisticState);
    setOverrides((prev) => ({ ...prev, [movedPatched.id]: movedPatched }));
    setPendingMove(draggableId);
    setErrorRow(null);

    const form = new FormData();
    form.set("action", "board-move");
    form.set("id", draggableId);
    form.set("property", groupBy?.name ?? "");
    form.set("value", destCol === "__undefined" ? "" : destCol);
    fetcher.submit(form, {
      method: "post",
      replace: true,
      encType: "multipart/form-data",
    });
  };

  function getColumnLabel(id: string) {
    if (id === "__undefined") {
      return t("shared.undefined");
    }
    const opt = groupBy?.options.find((o) => o.value === id);
    return opt?.name || id;
  }

  function getColumnColor(id: string) {
    if (id === "__undefined") {
      return Colors.UNDEFINED;
    }
    const opt = groupBy?.options.find((o) => o.value === id);
    return opt?.color as Colors;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3 w-full max-w-7xl mx-auto px-4 sm:px-0">
        <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0b1220]/80 p-5 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={clsx(
                  "rounded-full px-3 py-1 text-xs font-semibold border border-white/15",
                  compactCards ? "bg-white text-slate-900" : "bg-white/10 text-white"
                )}
                onClick={() => setCompactCards((c) => !c)}
              >
                {compactCards ? "Compact" : "Detailed"}
              </button>
              <button
                type="button"
                className={clsx(
                  "rounded-full px-3 py-1 text-xs font-semibold border border-white/15",
                  hideEmpty ? "bg-white text-slate-900" : "bg-white/10 text-white"
                )}
                onClick={() => setHideEmpty((c) => !c)}
              >
                {hideEmpty ? "Show all" : "Hide empty"}
              </button>
            </div>
            {errorMessage && <div className="text-xs font-semibold text-red-400">{errorMessage}</div>}
          </div>

          <div className="w-full min-h-[360px] overflow-x-auto [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-white/50">
            <div className="sticky top-0 z-10 bg-background/80 backdrop-blur">
              <div className="grid auto-cols-[minmax(240px,1fr)] grid-flow-col items-stretch gap-3 py-2">
                {columnIds
                  .filter((colId) => !hideEmpty || (columnItems[colId] ?? []).length > 0)
                  .map((colId) => {
                    const agg = getAggregate(colId);
                    return (
                      <div
                        key={colId}
                        style={{ minWidth: columnWidth, maxWidth: columnWidth }}
                        className="bg-white/5 border-white/10 flex items-center justify-between rounded-md border px-3 py-2 shadow-2xs"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <ColorBadge color={getColumnColor(colId)} />
                          <div className="truncate font-semibold">{getColumnLabel(colId)}</div>
                          <div className="text-muted-foreground shrink-0 text-xs">• {agg.count}</div>
                          {agg.sum !== null && <div className="text-muted-foreground shrink-0 text-xs">• {NumberUtils.numberFormat(agg.sum)}</div>}
                        </div>
                        {readOnly || !routes ? null : (
                          <Link
                            className="text-muted-foreground hover:text-foreground rounded-md px-2 py-1 text-sm font-semibold"
                            to={(EntityHelper.getRoutes({ routes, entity })?.new ?? "") + (colId !== "__undefined" ? `?${groupBy?.name}=${colId}` : "")}
                            title={t("shared.add")}
                          >
                            +
                          </Link>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            <DragDropContext
              onDragEnd={(result) => {
                setErrorMessage(null);
                handleDragEnd(result);
              }}
            >
              <div className="grid auto-cols-[minmax(240px,1fr)] grid-flow-col items-start gap-3 pb-3 w-full">
                {columnIds
                  .filter((colId) => !hideEmpty || (columnItems[colId] ?? []).length > 0)
                  .map((colId) => {
                    const rows = columnItems[colId] ?? [];
                    return (
                      <BoardColumn
                        key={colId}
                        colId={colId}
                        rows={rows}
                        columnWidth={columnWidth}
                        entity={entity}
                        columnsDef={columnsDef}
                        allEntities={allEntities}
                        routes={routes}
                        actions={actions}
                        compactCards={compactCards}
                        pendingMove={pendingMove}
                        errorRow={errorRow}
                        portal={portal}
                        readOnly={readOnly}
                        groupBy={groupBy}
                        t={t}
                        MinimalCard={MinimalCard}
                      />
                    );
                  })}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardColumn({
  colId,
  rows,
  columnWidth,
  entity,
  columnsDef,
  allEntities,
  routes,
  actions,
  compactCards,
  pendingMove,
  errorRow,
  portal,
  readOnly,
  groupBy,
  t,
  MinimalCard,
}: Readonly<{
  colId: string;
  rows: RowWithDetails[];
  columnWidth: number;
  entity: EntityWithDetails;
  columnsDef: ColumnDto[];
  allEntities: EntityWithDetails[];
  routes?: EntitiesApi.Routes;
  actions?: (row: RowWithDetails) => any[];
  compactCards: boolean;
  pendingMove: string | null;
  errorRow: string | null;
  portal: HTMLElement | null;
  readOnly?: boolean;
  groupBy?: PropertyWithDetails;
  t: any;
  MinimalCard: ({ row }: { row: RowWithDetails }) => JSX.Element;
}>) {
  return (
    <Droppable droppableId={colId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{ minWidth: columnWidth, maxWidth: columnWidth }}
          className="bg-white/5 border-white/10 flex flex-col gap-2 rounded-lg border px-2 py-3"
        >
          {rows.length === 0 && (
            <div className="text-muted-foreground border-border rounded-md border border-dashed px-3 py-6 text-center text-xs">
              {t("shared.noRecords")}
            </div>
          )}
          {rows.map((row, idx) => (
            <DraggableRowCard
              key={row.id}
              row={row}
              index={idx}
              portal={portal}
              pendingMove={pendingMove}
              errorRow={errorRow}
              compactCards={compactCards}
              MinimalCard={MinimalCard}
              entity={entity}
              columnsDef={columnsDef}
              allEntities={allEntities}
              routes={routes}
              actions={actions}
            />
          ))}
          {provided.placeholder}
          {readOnly || !routes ? null : (
            <Link
              className="text-muted-foreground hover:text-foreground border-border flex items-center justify-center rounded-md border border-dashed px-2 py-2 text-xs font-medium"
              to={(EntityHelper.getRoutes({ routes, entity })?.new ?? "") + (colId !== "__undefined" ? `?${groupBy?.name}=${colId}` : "")}
            >
              {t("shared.add")}
            </Link>
          )}
        </div>
      )}
    </Droppable>
  );
}

export function AddMoreCard({ entity, routes, className }: Readonly<{ entity: EntityWithDetails; routes?: EntitiesApi.Routes; className?: string }>) {
  const { t } = useTranslation();
  return (
    <div className={className}>
      {routes && (
        <Link
          className={clsx(
            "border-border hover:border-border group flex h-full items-center rounded-md border-2 border-dashed p-2 text-left align-middle shadow-2xs hover:border-dotted hover:bg-slate-100",
            className
          )}
          to={EntityHelper.getRoutes({ routes, entity })?.new ?? ""}
        >
          <div className="text-foreground/80 mx-auto flex justify-center text-center align-middle text-sm font-medium">{t("shared.add")}</div>
        </Link>
      )}
    </div>
  );
}

export function EmptyCard({ className }: Readonly<{ className?: string }>) {
  const { t } = useTranslation();
  return (
    <div className={className}>
      <div className="bg-background border-border group inline-block h-full w-full truncate rounded-md border-2 border-dashed p-12 text-left align-middle shadow-2xs">
        <div className="text-foreground/80 mx-auto flex justify-center text-center align-middle text-sm font-medium">{t("shared.noRecords")}</div>
      </div>
    </div>
  );
}

function ButtonSelectWrapper({
  item,
  onSelected,
  selectedRows,
  children,
  className,
}: Readonly<{
  item: RowWithDetails;
  selectedRows: RowWithDetails[];
  onSelected: (item: RowWithDetails[]) => void;
  children: React.ReactNode;
  className?: string;
}>) {
  const isSelected = selectedRows.find((f) => f.id === item.id);
  return (
    <div className={clsx(className, "group relative rounded-md text-left", isSelected ? "bg-theme-50 hover:bg-theme-50" : "hover:bg-secondary bg-background")}>
      <button
        type="button"
        className="absolute right-0 top-0 mr-2 mt-2 origin-top-right justify-center"
        onClick={() => {
          if (isSelected) {
            onSelected(selectedRows.filter((f) => f.id !== item.id));
          } else {
            onSelected([...(selectedRows ?? []), item]);
          }
        }}
      >
        {isSelected ? (
          <svg
            fill="currentColor"
            className="h-5 w-5 text-teal-700"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0 0 50 50"
          >
            <path d="M 39 4 L 11 4 C 7.140625 4 4 7.140625 4 11 L 4 39 C 4 42.859375 7.140625 46 11 46 L 39 46 C 42.859375 46 46 42.859375 46 39 L 46 11 C 46 7.140625 42.859375 4 39 4 Z M 23.085938 34.445313 L 13.417969 25.433594 L 14.78125 23.96875 L 22.914063 31.554688 L 36.238281 15.832031 L 37.761719 17.125 Z"></path>
          </svg>
        ) : (
          <svg
            fill="currentColor"
            className="h-5 w-5 text-teal-700"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="50"
            height="50"
            viewBox="0 0 50 50"
          >
            <path d="M 39 4 L 11 4 C 7.101563 4 4 7.101563 4 11 L 4 39 C 4 42.898438 7.101563 46 11 46 L 39 46 C 42.898438 46 46 42.898438 46 39 L 46 11 C 46 7.101563 42.898438 4 39 4 Z M 42 39 C 42 40.699219 40.699219 42 39 42 L 11 42 C 9.300781 42 8 40.699219 8 39 L 8 11 C 8 9.300781 9.300781 8 11 8 L 39 8 C 40.699219 8 42 9.300781 42 11 Z"></path>
          </svg>
        )}
      </button>
      {children}
    </div>
  );
}

function RemoveButton({ item, readOnly, onRemove }: Readonly<{ item: RowWithDetails; readOnly?: boolean; onRemove?: (item: RowWithDetails) => void }>) {
  return (
    <Fragment>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove(item);
          }}
          type="button"
          disabled={readOnly}
          className={clsx(
            "text-muted-foreground bg-background absolute right-0 top-0 mr-2 mt-2 hidden origin-top-right justify-center rounded-full",
            readOnly ? "cursor-not-allowed" : "hover:text-red-500 group-hover:flex"
          )}
        >
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}
    </Fragment>
  );
}
