import { useFetcher, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import InputFilters from "~/components/ui/input/InputFilters";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { EntitiesApi } from "~/utils/api/.server/EntitiesApi";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import { EntityWithDetails } from "~/utils/db/entities/entities.db.server";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";
import EntityHelper from "~/utils/helpers/EntityHelper";
import RowNewFetcher from "./RowNewFetcher";
import RowsList from "~/components/entities/rows/RowsList";
import { EntityViewWithDetails } from "~/utils/db/entities/entityViews.db.server";
import { RowDisplayDefaultProperty } from "~/utils/helpers/PropertyHelper";
import Loading from "~/components/ui/loaders/Loading";

interface Props {
  readonly currentView: EntityViewWithDetails | null;
  readonly listUrl: string;
  readonly newUrl: string;
  readonly parentEntity?: EntityWithDetails;
  readonly onSelected: (rows: RowWithDetails[]) => void;
  readonly multipleSelection?: boolean;
  readonly allEntities: EntityWithDetails[];
}
export default function RowListFetcher({ currentView, listUrl, newUrl, parentEntity, onSelected, multipleSelection, allEntities }: Props) {
  const { t } = useTranslation();
  const fetcher = useFetcher<{ rowsData: RowsApi.GetRowsData; routes: EntitiesApi.Routes }>();
  const [data, setData] = useState<{ rowsData: RowsApi.GetRowsData; routes: EntitiesApi.Routes }>();
  const [adding, setAdding] = useState(false);
  const [rows, setRows] = useState<RowWithDetails[]>([]);
  const [selectedRows, setSelectedRows] = useState<RowWithDetails[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetcher.load(listUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listUrl]);

  useEffect(() => {
    if (currentView) {
      searchParams.set("v", currentView.name);
    }
    fetcher.load(listUrl + "?" + searchParams.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, currentView]);

  useEffect(() => {
    if (fetcher.data) {
      const data: { rowsData: RowsApi.GetRowsData } = fetcher.data;
      setData(fetcher.data);
      setRows(data.rowsData.items);
      const selectedRowIds = new Set(selectedRows.map((r) => r.id));
      setSelectedRows(data.rowsData.items.filter((r) => selectedRowIds.has(r.id)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  function onRowsSelected(rows: RowWithDetails[]) {
    setSelectedRows(rows);
  }

  function onCreated(row: RowWithDetails) {
    setRows([row, ...rows]);
    setSelectedRows([row, ...selectedRows]);
    setAdding(false);
  }

  function onConfirm(rows: RowWithDetails[]) {
    onSelected(rows);
  }

  function renderContent() {
    if (!fetcher.data) {
      return <Loading small loading />;
    }

    if (!data?.rowsData?.entity) {
      return <div className="border-border relative block w-full cursor-not-allowed rounded-lg border-2 border-dashed p-4 text-center">{t("shared.loading")}...</div>;
    }

    if (!data?.rowsData) {
      return <div>No data</div>;
    }

    if (data?.rowsData) {
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between space-x-2">
            <ButtonPrimary type="button" onClick={() => onConfirm(selectedRows)} disabled={selectedRows.length > 1 && !multipleSelection}>
              {selectedRows.length === 1 ? (
                <div className="flex space-x-1">
                  <div>{t("shared.select")} 1</div>
                  <div className="lowercase">{t(data.rowsData?.entity.title)}</div>
                </div>
              ) : (
                <div className="flex space-x-1">
                  <div>
                    {t("shared.select")} {selectedRows.length}
                  </div>
                  <div className="lowercase">{t(data.rowsData?.entity.titlePlural)}</div>
                </div>
              )}
            </ButtonPrimary>
            <div className="flex space-x-2">
              <InputFilters filters={EntityHelper.getFilters({ t, entity: data.rowsData.entity })} />
              <ButtonSecondary type="button" onClick={() => setAdding(true)}>
                +
              </ButtonSecondary>
            </div>
          </div>
          <RowsList
            view={(currentView?.layout ?? "table") as "table" | "board" | "grid" | "card"}
            currentView={currentView}
            entity={data.rowsData.entity}
            items={rows}
            pagination={data.rowsData.pagination}
            selectedRows={selectedRows}
            onSelected={onRowsSelected}
            readOnly={true}
            ignoreColumns={[RowDisplayDefaultProperty.FOLIO]}
          />
        </div>
      );
    }

    return <div>{t("shared.unknownError")}</div>;
  }

  return (
    <div>
      {renderContent()}
      <SlideOverWideEmpty
        title={t("shared.create") + " " + t(data?.rowsData?.entity.title ?? "")}
        className="max-w-md"
        open={adding}
        onClose={() => setAdding(false)}
      >
        <RowNewFetcher url={newUrl} parentEntity={parentEntity} onCreated={onCreated} allEntities={allEntities} />
      </SlideOverWideEmpty>
    </div>
  );
}
