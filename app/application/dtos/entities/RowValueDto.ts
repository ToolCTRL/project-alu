import { RowMedia, RowValueMultiple, RowValueRange } from "@prisma/client";
import { PropertyWithDetails } from "~/utils/db/entities/entities.db.server";

export type RowValueDto = {
  id: string | null | undefined;
  property: PropertyWithDetails;
  propertyId: string;
  textValue?: string;
  numberValue?: number;
  dateValue?: Date;
  booleanValue?: boolean;
  selectedOption?: string;
  media?: RowMedia[];
  multiple?: RowValueMultiple[];
  range?: RowValueRange;
};
