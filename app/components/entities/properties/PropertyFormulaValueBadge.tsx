import { PropertyWithDetails } from "~/utils/db/entities/entities.db.server";
import { DateFormatType } from "~/utils/shared/DateUtils";
import { NumberFormatType } from "~/utils/shared/NumberUtils";
import RowNumberCell from "../rows/cells/RowNumberCell";
import RowDateCell from "../rows/cells/RowDateCell";
import { PropertyAttributeName } from "~/application/enums/entities/PropertyAttributeName";
import { FormulaValueType } from "~/modules/formulas/dtos/FormulaDto";
import { BooleanFormatType } from "~/utils/shared/BooleanUtils";
import RowBooleanCell from "../rows/cells/RowBooleanCell";

interface Props {
  property: PropertyWithDetails;
  value: FormulaValueType;
}
export default function PropertyFormulaValueBadge({ property, value }: Readonly<Props>) {
  const getNumberFormat = () => {
    return property.attributes.find((f) => f.name === PropertyAttributeName.FormatNumber)?.value as NumberFormatType;
  };
  const getBooleanFormat = () => {
    return property.attributes.find((f) => f.name === PropertyAttributeName.FormatBoolean)?.value as BooleanFormatType;
  };
  const getDateFormat = () => {
    return property.attributes.find((f) => f.name === PropertyAttributeName.FormatDate)?.value as DateFormatType;
  };
  function renderFormulaValue() {
    const resultAs = property.formula?.resultAs;

    if (resultAs === "number") {
      return <RowNumberCell value={Number(value) || undefined} format={getNumberFormat()} />;
    }

    if (resultAs === "boolean") {
      return <RowBooleanCell value={Boolean(value) || undefined} format={getBooleanFormat()} />;
    }

    if (resultAs === "date") {
      return <RowDateCell value={value ? (value as Date) : undefined} format={getDateFormat()} />;
    }

    if (value === null || value === undefined) {
      return <div />;
    }

    const formattedValue = typeof value === "object" ? JSON.stringify(value) : String(value);

    return <div>{formattedValue}</div>;
  }

  return <div className="flex space-x-1">{renderFormulaValue()}</div>;
}
