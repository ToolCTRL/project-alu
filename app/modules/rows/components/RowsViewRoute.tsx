import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useActionData, useLocation, useNavigation, useSearchParams, useSubmit } from "react-router";
import RowsList from "~/components/entities/rows/RowsList";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import InputFilters, { FilterDto } from "~/components/ui/input/InputFilters";
import TabsWithIcons from "~/components/ui/tabs/TabsWithIcons";
import EntityHelper from "~/utils/helpers/EntityHelper";
import { EntitiesApi } from "~/utils/api/.server/EntitiesApi";
import { EntityViewWithDetails } from "~/utils/db/entities/entityViews.db.server";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";
import { useAppData } from "~/utils/data/useAppData";
import EntityViewForm from "~/components/entities/views/EntityViewForm";
import { UserSimple } from "~/utils/db/users.db.server";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { Rows_List } from "../routes/Rows_List.server";
import { toast } from "sonner";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import TrashIcon from "~/components/ui/icons/TrashIcon";
import clsx from "clsx";

interface Props {
  title?: ReactNode;
  rowsData: RowsApi.GetRowsData;
  items: RowWithDetails[];
  routes?: EntitiesApi.Routes;
  onNewRow?: () => void;
  onEditRow?: (item: RowWithDetails) => void;
  saveCustomViews?: boolean;
  permissions: {
    create: boolean;
  };
  currentSession: {
    user: UserSimple;
    isSuperAdmin: boolean;
  } | null;
}
export default function RowsViewRoute({
  title,
  rowsData,
  items,
  routes,
  onNewRow,
  onEditRow,
  saveCustomViews,
  permissions,
  currentSession,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const actionData = useActionData<Rows_List.ActionData>();
  const appData = useAppData();
  const submit = useSubmit();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const confirmDeleteRows = useRef<RefConfirmModal>(null);

  const [bulkActions, setBulkActions] = useState<string[]>([]);

  const [view, setView] = useState(rowsData.currentView?.layout ?? searchParams.get("view") ?? "table");
  const [filters, setFilters] = useState<FilterDto[]>([]);

  const [showCustomViewModal, setShowCustomViewModal] = useState(false);
  const [editingView, setEditingView] = useState<EntityViewWithDetails | null>(null);

  const [selectedRows, setSelectedRows] = useState<RowWithDetails[]>([]);

  useEffect(() => {
    setFilters(EntityHelper.getFilters({ t, entity: rowsData.entity, pagination: rowsData.pagination }));
    const bulkActions: string[] = [];
    if (rowsData.entity.hasBulkDelete) {
      bulkActions.push("bulk-delete");
    }
    setBulkActions(bulkActions);
  }, [rowsData, t]);

  useEffect(() => {
    const newView = rowsData.currentView?.layout ?? searchParams.get("view") ?? "table";
    setView(newView);
  }, [searchParams, rowsData.entity, rowsData.currentView?.layout]);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success);
      setSelectedRows([]);
    } else if (actionData?.rowsDeleted) {
      setSelectedRows((rows) => rows.filter((row) => !actionData?.rowsDeleted?.includes(row.id)));
    }
    if (actionData?.updatedView) {
      setShowCustomViewModal(false);
      setEditingView(null);
    }
  }, [actionData]);

  useEffect(() => {
    setShowCustomViewModal(false);
    setEditingView(null);
  }, [searchParams]);

  function onCreateView() {
    setShowCustomViewModal(true);
    setEditingView(null);
  }

  function onUpdateView() {
    setShowCustomViewModal(true);
    setEditingView(rowsData.currentView);
  }

  function isCurrenView(view: EntityViewWithDetails) {
    return rowsData.currentView?.id === view.id;
  }

  function canUpdateCurrentView() {
    if (currentSession?.isSuperAdmin) {
      return true;
    }
    if (!rowsData.currentView) {
      return false;
    }
    if (rowsData.currentView.userId === currentSession?.user.id) {
      return true;
    }
    if (appData?.currentTenant?.id && rowsData.currentView.tenantId === appData?.currentTenant.id && appData?.isSuperUser) {
      return true;
    }
    return false;
  }

  function onDeleteSelectedRows() {
    confirmDeleteRows.current?.show(t("shared.confirmDelete"), t("shared.delete"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }
  function onDeleteSelectedRowsConfirmed() {
    const form = new FormData();
    form.set("action", "bulk-delete");
    selectedRows.forEach((item) => {
      form.append("rowIds[]", item.id);
    });
    submit(form, {
      method: "post",
    });
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-4 px-4 pb-8 sm:px-6 lg:px-8 pt-8">
      {rowsData.currentView?.layout === "board" && rowsData.entity.name === "opportunity" && (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220]/85 p-7 text-white shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-8 pr-28">
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">Deal-Pipeline</div>
              <div className="text-2xl font-bold">Deals und Phasen im Überblick</div>
              <div className="text-sm text-white/70">Ziehe Karten in die nächste Phase oder blende leere Phasen aus.</div>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-white/70">
                <span className="rounded-full bg-white/10 px-2 py-1">Projekt ALU</span>
                <span className="rounded-full bg-white/10 px-2 py-1">Kanban</span>
                <span className="rounded-full bg-white/10 px-2 py-1">Status: Aktiv</span>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.7)]" />
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.7)]" />
          <div className="pointer-events-none absolute right-[-90px] bottom-[-150px] h-160 w-160 rounded-full bg-yellow-300/14 blur-3xl" />
          <div className="pointer-events-none absolute right-[-70px] bottom-[-120px] h-130 w-130 rounded-full bg-yellow-200/10 blur-2xl" />
          <div className="pointer-events-none absolute right-[-50px] bottom-[-100px] h-110 w-110 rounded-full bg-yellow-100/8 blur-xl" />
          <div className="pointer-events-none absolute right-[-40px] bottom-[-80px] h-48 w-48 rounded-full border border-yellow-200/25 blur-[1px]" />
          <div className="pointer-events-none absolute right-[-50px] bottom-[-60px] h-48 w-48 rounded-full border border-yellow-100/35" />
          <div className="pointer-events-none absolute right-[-60px] bottom-[-70px] flex h-[260px] w-[260px] items-center justify-center">
            <div className="absolute inset-0 animate-pulse rounded-full bg-yellow-300/12 blur-2xl" />
            <div className="absolute inset-12 rounded-full border border-yellow-200/25 blur-[0.5px]" />
            <div className="absolute inset-20 rounded-full border border-yellow-100/20 blur-[0.5px]" />
            <svg className="relative h-96 w-96 text-yellow-200 drop-shadow-[0_0_28px_rgba(234,179,8,1)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M9 18h6m-5 3h4m2-9a5 5 0 1 0-8 0c.5.7 1 1.5 1 3h6c0-1.5.5-2.3 1-3Z" />
              <line x1="12" y1="-1" x2="12" y2="2.2" strokeLinecap="round" />
              <line x1="12" y1="21" x2="12" y2="23" strokeLinecap="round" />
              <line x1="1" y1="12" x2="3" y2="12" strokeLinecap="round" />
              <line x1="21" y1="12" x2="23" y2="12" strokeLinecap="round" />
              <line x1="1.5" y1="5.5" x2="4.5" y2="8" strokeLinecap="round" />
              <line x1="19.8" y1="16.2" x2="23" y2="19.2" strokeLinecap="round" />
              <line x1="4" y1="20" x2="5.5" y2="18.5" strokeLinecap="round" />
              <line x1="18.5" y1="5.5" x2="20" y2="4" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}
      {rowsData.currentView?.layout === "board" && rowsData.entity.name === "ticket" && (
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b1220]/85 p-7 text-white shadow-2xl backdrop-blur">
          <div className="flex items-start justify-between gap-8 pr-28">
            <div className="space-y-2">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">Ticket-Pipeline</div>
              <div className="text-2xl font-bold">Tickets und Phasen im Überblick</div>
              <div className="text-sm text-white/70">Bearbeite Tickets, ziehe sie durch die Phasen oder blende leere Spalten aus.</div>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold text-white/70">
                <span className="rounded-full bg-white/10 px-2 py-1">Projekt ALU</span>
                <span className="rounded-full bg-white/10 px-2 py-1">Kanban</span>
                <span className="rounded-full bg-white/10 px-2 py-1">Status: Aktiv</span>
              </div>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/5 shadow-[0_15px_40px_-25px_rgba(0,0,0,0.7)]" />
          <div className="pointer-events-none absolute right-[-50px] bottom-[-40px] flex h-[240px] w-[240px] items-center justify-center">
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-cyan-400/12 blur-2xl" />
            <svg className="relative h-72 w-72 text-cyan-200 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M5 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2.1a1 1 0 0 1-.29.7l-.52.52a1 1 0 0 0 0 1.41l.52.52a1 1 0 0 1 .29.7V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-2.1a1 1 0 0 1 .29-.7l.52-.52a1 1 0 0 0 0-1.41l-.52-.52A1 1 0 0 1 5 8.1V6Zm3 2v1h8V8H8Zm0 4v1h8v-1H8Z" />
            </svg>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between space-x-2 md:py-2">
        {selectedRows.length > 0 ? (
          <div className="flex space-x-1">{bulkActions.includes("bulk-delete") && <DeleteIconButton onClick={onDeleteSelectedRows} />}</div>
        ) : (
          <Fragment>
            {rowsData.views.length > 1 ? (
              <TabsWithIcons
                className="grow xl:flex"
                tabs={rowsData.views.map((item) => {
                  searchParams.set("v", item.name);
                  searchParams.delete("page");
                  return {
                    name: t(item.title),
                    href: location.pathname + "?" + searchParams.toString(),
                    current: isCurrenView(item),
                  };
                })}
              />
            ) : rowsData.currentView?.layout === "board" && ["opportunity", "ticket"].includes(rowsData.entity.name) ? null : (
              title || <h3 className="flex flex-1 items-center truncate font-bold">{t(rowsData.currentView?.title ?? rowsData.entity.titlePlural)}</h3>
            )}
          </Fragment>
        )}
        <div className="flex items-center space-x-1">
          {filters.length > 0 && <InputFilters filters={filters} />}
          {/* <RunPromptFlowButtons type="list" promptFlows={rowsData.promptFlows} className="p-0.5" /> */}
          {permissions.create && (
            <ButtonPrimary disabled={!permissions.create} to={!onNewRow ? "new" : undefined} onClick={onNewRow}>
              <span className="sm:text-sm">+</span>
            </ButtonPrimary>
          )}
        </div>
      </div>

      <div>
        <RowsList
          view={view as "table" | "board" | "grid" | "card"}
          entity={rowsData.entity}
          items={items}
          routes={routes}
          pagination={rowsData.pagination}
          onEditRow={onEditRow}
          currentView={rowsData.currentView}
          selectedRows={selectedRows}
          onSelected={bulkActions.length ? (rows) => setSelectedRows(rows) : undefined}
        />
        <div className="mt-2 flex items-center justify-between space-x-2">
          <div>
            <div className="hidden sm:block">
              {rowsData.pagination && rowsData.pagination.totalItems > 0 && routes && (
                <Link
                  className="text-muted-foreground text-xs font-medium hover:underline"
                  to={EntityHelper.getRoutes({ routes, entity: rowsData.entity })?.export + "?" + searchParams}
                  reloadDocument
                >
                  <div>
                    {rowsData.pagination.totalItems === 1 ? t("shared.exportResult") : t("shared.exportResults", { 0: rowsData.pagination.totalItems })}
                  </div>
                </Link>
              )}
            </div>
          </div>

          {saveCustomViews && rowsData.entity.hasViews && (
            <Fragment>
              {!canUpdateCurrentView() ? (
                <button type="button" className="text-muted-foreground text-xs font-medium hover:underline" onClick={onCreateView}>
                  {t("models.view.actions.create")}
                </button>
              ) : (
                <div className="text-muted-foreground flex items-center space-x-2">
                  <button type="button" className="text-xs font-medium hover:underline" disabled={!canUpdateCurrentView()} onClick={onUpdateView}>
                    {t("models.view.actions.update")}
                  </button>
                  <div>•</div>
                  <button type="button" className="text-xs font-medium hover:underline" onClick={onCreateView}>
                    {t("models.view.actions.create")}
                  </button>
                </div>
              )}
            </Fragment>
          )}
        </div>
      </div>
      <Outlet />

      <ConfirmModal ref={confirmDeleteRows} onYes={onDeleteSelectedRowsConfirmed} />

      <div className="z-50">
        <SlideOverWideEmpty
          title={editingView ? "Edit view" : `New ${t(rowsData.entity.title)} view`}
          className="sm:max-w-2xl"
          open={showCustomViewModal}
          onClose={() => setShowCustomViewModal(false)}
        >
          {showCustomViewModal && (
            <EntityViewForm
              entity={rowsData.entity}
              tenantId={appData.currentTenant?.id ?? null}
              userId={currentSession?.user.id ?? null}
              item={editingView}
              canDelete={true}
              onClose={() => setShowCustomViewModal(false)}
              actionNames={{
                create: "view-create",
                update: "view-edit",
                delete: "view-delete",
              }}
              isSystem={false}
              showViewType={currentSession?.isSuperAdmin ?? false}
            />
          )}
        </SlideOverWideEmpty>
      </div>
    </div>
  );
}

function DeleteIconButton({ onClick }: Readonly<{ onClick: () => void }>) {
  const navigation = useNavigation();
  return (
    <button
      type="button"
      className={clsx(
        "hover:bg-secondary/90 focus:bg-secondary/90 group flex items-center rounded-md border border-transparent px-4 py-2 focus:outline-hidden focus:ring-2 focus:ring-gray-400 focus:ring-offset-1",
        navigation.state === "submitting" && navigation.formData?.get("action") === "bulk-delete" && "base-spinner"
      )}
      disabled={navigation.state !== "idle"}
      onClick={onClick}
    >
      <TrashIcon className="group-hover:text-muted-foreground h-4 w-4 text-gray-300" />
    </button>
  );
}
