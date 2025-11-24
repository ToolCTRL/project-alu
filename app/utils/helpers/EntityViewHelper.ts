import { EntityView } from "@prisma/client";
import { ViewFilterCondition } from "~/application/enums/entities/ViewFilterCondition";
import { GridLayoutDto } from "~/application/dtos/layout/GridLayoutDto";

const CONDITION_MAP: Record<string, ViewFilterCondition> = {
  equals: ViewFilterCondition.equals,
  contains: ViewFilterCondition.contains,
  lt: ViewFilterCondition.lt,
  lte: ViewFilterCondition.lte,
  gt: ViewFilterCondition.gt,
  gte: ViewFilterCondition.gte,
  startsWith: ViewFilterCondition.startsWith,
  endsWith: ViewFilterCondition.endsWith,
  in: ViewFilterCondition.in,
  notIn: ViewFilterCondition.notIn,
};

function getCondition(condition: string) {
  return CONDITION_MAP[condition] ?? ViewFilterCondition.equals;
}

function getGridLayout(view: EntityView | null): GridLayoutDto {
  const layout: GridLayoutDto = {
    columns: view?.gridColumns ?? 5,
    sm: view?.gridColumnsSm ?? 2,
    md: view?.gridColumnsMd ?? 3,
    lg: view?.gridColumnsLg ?? 4,
    xl: view?.gridColumnsXl ?? 5,
    xl2: view?.gridColumns2xl ?? 6,
    gap: (view?.gridGap ?? "sm") as "xs" | "sm" | "md" | "lg" | "xl",
  };
  return layout;
}

function getType(view: EntityView): "default" | "tenant" | "user" | "system" {
  if (view.isSystem) {
    return "system";
  } else if (view.tenantId && !view.userId) {
    return "tenant";
  } else if (view.tenantId && view.userId) {
    return "user";
  } else if (!view.tenantId && !view.userId) {
    return "default";
  }
  return "default";
}

export default {
  getCondition,
  getGridLayout,
  getType,
};
