export interface BlockVariableDto {
  type: "manual" | "param" | "query";
  param?: string;
  query?: string;
  value?: string;
  required?: boolean;
}
