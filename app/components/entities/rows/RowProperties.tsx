import { EntityWithDetails, PropertyWithDetails } from "~/utils/db/entities/entities.db.server";
import RowValueInput from "./RowValueInput";
import clsx from "clsx";
import PropertyAttributeHelper from "~/utils/helpers/PropertyAttributeHelper";
import { PropertyAttributeName } from "~/application/enums/entities/PropertyAttributeName";
import { useState } from "react";
import { updateItemByIdx } from "~/utils/shared/ObjectUtils";
import RowHelper from "~/utils/helpers/RowHelper";
import { RowValueDto } from "~/application/dtos/entities/RowValueDto";
import { getFormProperties } from "~/utils/helpers/PropertyHelper";
import { RowDto } from "~/modules/rows/repositories/RowDto";

export default function RowProperties({
  entity,
  item,
  readOnly,
  properties,
  gridColumns,
}: {
  entity: EntityWithDetails;
  item: RowDto | null;
  readOnly?: boolean;
  properties?: string[];
  gridColumns?: "grid-cols-4" | "grid-cols-3" | "grid-cols-2";
}) {
  const [values, setValues] = useState<RowValueDto[]>(
    getFormProperties({ mode: item ? "edit" : "create", entity, properties }).map((property) => {
      const existing = item?.values.find((f) => f.propertyId === property.id);
      return {
        propertyId: property.id,
        property,
        ...existing,
        textValue: existing?.textValue ?? undefined,
        numberValue: existing?.numberValue ? Number(existing?.numberValue) : undefined,
        dateValue: existing?.dateValue ?? undefined,
        booleanValue: existing ? Boolean(existing?.booleanValue) : undefined,
        selectedOption: existing?.textValue ?? undefined,
        media: existing?.media ?? [],
        multiple: existing?.multiple.sort((a: { order: number }, b: { order: number }) => a.order - b.order) ?? [],
        range: existing?.range ?? undefined,
      };
    })
  );

  function getPropertyColumnSpan(property: PropertyWithDetails) {
    const columns = PropertyAttributeHelper.getPropertyAttributeValue_Number(property, PropertyAttributeName.Columns);
    if (!columns || columns === undefined) {
      return "col-span-12";
    }
    return `col-span-${columns}`;
  }

  return (
    <div className={clsx("grid gap-2", gridColumns)}>
      {values.map((detailValue, idxDetailValue) => {
        return (
          <div key={detailValue.propertyId} className={clsx("w-full", !gridColumns && getPropertyColumnSpan(detailValue.property))}>
            <RowValueInput
              entity={entity}
              textValue={detailValue.textValue}
              numberValue={detailValue.numberValue}
              dateValue={detailValue.dateValue}
              booleanValue={detailValue.booleanValue}
              multiple={detailValue.multiple}
              range={detailValue.range}
              initialOption={detailValue.selectedOption}
              selected={detailValue.property}
              initialMedia={detailValue.media}
              onChange={(e) => {
                updateItemByIdx(values, setValues, idxDetailValue, RowHelper.updateFieldValueTypeArray(detailValue, e));
              }}
              onChangeOption={(e) => {
                updateItemByIdx(values, setValues, idxDetailValue, {
                  textValue: e,
                  selectedOption: e,
                });
              }}
              onChangeMedia={(media) => {
                updateItemByIdx(values, setValues, idxDetailValue, {
                  media,
                });
              }}
              onChangeMultiple={(e) => {
                updateItemByIdx(values, setValues, idxDetailValue, {
                  multiple: e,
                });
              }}
              onChangeRange={(e) => {
                updateItemByIdx(values, setValues, idxDetailValue, {
                  range: e,
                });
              }}
              readOnly={readOnly || detailValue.property.isReadOnly}
              autoFocus={idxDetailValue === 0}
            />
          </div>
        );
      })}
    </div>
  );
}
