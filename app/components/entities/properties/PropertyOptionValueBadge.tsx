import { EntityWithDetails } from "~/utils/db/entities/entities.db.server";
import RowSelectedOptionCell from "../rows/cells/RowSelectedOptionCell";
import { SelectOptionsDisplay } from "~/utils/shared/SelectOptionsUtils";

interface Props {
  readonly entity: EntityWithDetails;
  readonly property: string;
  readonly value: string;
  readonly display: SelectOptionsDisplay;
}
export default function PropertyOptionValueBadge({ entity, property, value, display }: Props) {
  return <RowSelectedOptionCell value={value} options={entity.properties.find((f) => f.name === property)?.options ?? []} display={display} />;
}
