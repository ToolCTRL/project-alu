import clsx from "clsx";

export const gridCols = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"] as const;
export const gaps = ["none", "xs", "sm", "md", "lg"] as const;
export interface GridBlockDto {
  columns?: (typeof gridCols)[number];
  gap?: (typeof gaps)[number];
}

function getGapClass(gap?: string) {
  if (gap === "none") return "gap-0";
  if (gap === "xs") return "gap-2";
  if (gap === "md") return "gap-8";
  if (gap === "lg") return "gap-12";
  return "gap-4";
}

function getColumnsClass(columns?: string) {
  const columnMap: Record<string, string> = {
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
  return columnMap[columns || "4"] || columnMap["4"];
}

function getClasses(grid?: GridBlockDto) {
  return clsx("grid", getGapClass(grid?.gap), getColumnsClass(grid?.columns));
}

export default {
  getClasses,
};
