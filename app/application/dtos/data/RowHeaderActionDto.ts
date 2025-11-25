import { ReactNode } from "react";

export interface RowHeaderActionDto<T> {
  title?: string | ReactNode;
  onClick?: (idx: number, item: T) => void;
  onClickRoute?: (idx: number, item: T) => string | undefined;
  onClickRouteTarget?: "_blank";
  disabled?: boolean | ((item: T) => boolean);
  hidden?: (item: T) => boolean;
  destructive?: boolean;
  firstColumn?: boolean;
  renderTitle?: (item: T) => ReactNode;
  renderIsDestructive?: (item: T) => boolean;
  prefetch?: "intent" | "render" | "none";
  confirmation?: (item: T) => {
    readonly title: string;
    readonly description: string;
  };
}
