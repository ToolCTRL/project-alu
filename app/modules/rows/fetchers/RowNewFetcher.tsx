import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CheckPlanFeatureLimit from "~/components/core/settings/subscription/CheckPlanFeatureLimit";
import Loading from "~/components/ui/loaders/Loading";
import { EntitiesApi } from "~/utils/api/.server/EntitiesApi";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import { EntityWithDetails } from "~/utils/db/entities/entities.db.server";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";
import RowForm from "../../../components/entities/rows/RowForm";
import { useFetcher } from "react-router";

interface Props {
  readonly url: string;
  readonly parentEntity?: EntityWithDetails;
  readonly onCreated?: (row: RowWithDetails) => void;
  readonly allEntities: EntityWithDetails[];
  readonly customSearchParams?: URLSearchParams;
}
export default function RowNewFetcher({ url, parentEntity, onCreated, allEntities, customSearchParams }: Props) {
  const { t } = useTranslation();
  const fetcher = useFetcher<{
    newRow?: RowWithDetails;
    entityData?: EntitiesApi.GetEntityData;
    routes?: EntitiesApi.Routes;
    relationshipRows?: RowsApi.GetRelationshipRowsData;
  }>();

  const [data, setData] = useState<{
    newRow?: RowWithDetails;
    entityData?: EntitiesApi.GetEntityData;
    routes?: EntitiesApi.Routes;
    relationshipRows?: RowsApi.GetRelationshipRowsData;
  }>();

  useEffect(() => {
    if (data?.newRow && onCreated) {
      onCreated(data.newRow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    fetcher.load(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    if (fetcher.data) {
      setData(fetcher.data);
    }
  }, [fetcher.data]);

  function onSubmit(formData: FormData) {
    fetcher.submit(formData, {
      action: url,
      method: "post",
    });
  }

  function renderContent() {
    if (!fetcher.data) {
      return <Loading small loading />;
    }

    if (!data?.entityData) {
      return <div>No data</div>;
    }

    if (data) {
      return (
        <CheckPlanFeatureLimit item={data.entityData.featureUsageEntity}>
          {data.routes && (
            <RowForm
              entity={data.entityData.entity}
              routes={data.routes}
              parentEntity={parentEntity}
              onSubmit={onSubmit}
              onCreatedRedirect={undefined}
              allEntities={allEntities}
              relationshipRows={data.relationshipRows}
              state={{
                loading: fetcher.state === "loading",
                submitting: fetcher.state === "submitting",
              }}
              customSearchParams={customSearchParams}
            />
          )}
        </CheckPlanFeatureLimit>
      );
    }

    return <div>{t("shared.unknownError")}</div>;
  }

  return <div>{renderContent()}</div>;
}
