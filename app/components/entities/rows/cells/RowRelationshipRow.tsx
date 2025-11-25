import { Link } from "react-router";
import { Fragment } from "react";
import { TFunction } from "i18next";
import { RowDto } from "~/modules/rows/repositories/RowDto";
import { EntitiesApi } from "~/utils/api/.server/EntitiesApi";
import { EntityWithDetails } from "~/utils/db/entities/entities.db.server";
import EntityHelper from "~/utils/helpers/EntityHelper";
import RowHelper from "~/utils/helpers/RowHelper";

export default function RowRelationshipRow({
  entity,
  item,
  onRelatedRowClick,
  routes,
  t,
}: Readonly<{
  entity: EntityWithDetails;
  item: RowDto;
  onRelatedRowClick?: () => void;
  routes?: EntitiesApi.Routes;
  t: TFunction;
}>) {
  const textDescription = RowHelper.getTextDescription({ entity: entity, item, t });

  if (onRelatedRowClick !== undefined) {
    return (
      <button type="button" onClick={onRelatedRowClick} className="hover truncate text-left text-sm hover:underline">
        {textDescription}
      </button>
    );
  }

  const routeOverview = EntityHelper.getRoutes({ routes, entity: entity, item })?.overview;
  if (!routes || !routeOverview) {
    return <div className="hover truncate text-left text-sm hover:underline">{textDescription}</div>;
  }

  return (
    <Link onClick={(e) => e.stopPropagation()} to={routeOverview} className="hover truncate text-left text-sm hover:underline">
      {textDescription}
    </Link>
  );
}
