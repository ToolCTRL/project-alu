import clsx from "clsx";

export const gridCols = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;
export const gaps = ["none", "xs", "sm", "md", "lg"] as const;
export interface GridBlockDto {
  columns?: (typeof gridCols)[number];
  gap?: (typeof gaps)[number];
}

const gapClassMap: Record<string, string> = {
  none: "gap-0",
  xs: "gap-2",
  sm: "gap-4",
  md: "gap-8",
  lg: "gap-12",
};

const columnClassMap: Record<string, string> = {
  "2": "grid-cols-1 sm:grid-cols-2",
  "3": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  "4": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  "5": "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  "6": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
  "7": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-7",
  "8": "grid-cols-2 sm:grid-cols-3 lg:grid-cols-8",
  "9": "grid-cols-4 sm:grid-cols-4 lg:grid-cols-9",
  "10": "grid-cols-4 sm:grid-cols-5 lg:grid-cols-10",
  "11": "grid-cols-4 sm:grid-cols-5 lg:grid-cols-11",
  "12": "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12",
};

function getClasses(grid?: GridBlockDto) {
  const gapClass = grid?.gap ? gapClassMap[grid.gap] : gapClassMap.sm;
  const columnClass = grid?.columns ? columnClassMap[grid.columns] : columnClassMap["4"];

  return clsx("grid", gapClass, columnClass);
}

export default {
  getClasses,
};
