import { EntityWithDetails } from "~/utils/db/entities/entities.db.server";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";
import { TenantWithDetails } from "~/utils/db/tenants.db.server";
import { UserWithDetails } from "~/utils/db/users.db.server";

export type FormulaVariableValueDto = {
  plain?: {
    variable: string;
    textValue?: string;
    numberValue?: number;
    dateValue?: Date;
    booleanValue?: boolean;
  };
  row?: {
    entity: EntityWithDetails;
    item: RowWithDetails;
  };
  tenant?: TenantWithDetails;
  user?: UserWithDetails;
};
