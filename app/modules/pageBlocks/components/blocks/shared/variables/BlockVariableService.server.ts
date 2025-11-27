import { Params } from "react-router";
import { BlockVariableDto } from "./BlockVariableDto";

export namespace BlockVariableService {
  export function getValue({ request, params, variable }: { request: Request; params: Params; variable?: BlockVariableDto }): string | null {
    if (!variable) {
      throw new Error("[BlockVariableService.getValue()] Unknown variable");
    }
    let value: string | null = null;
    if (variable.type === "manual") {
      value = variable?.value ?? null;
    } else if (variable.type === "param" && variable.param) {
      value = params[variable.param] ?? null;
    } else if (variable.type === "query") {
      const searchParams = new URL(request.url).searchParams;
      value = searchParams.get(variable.query || "")?.toString() ?? null;
    }
    if (variable?.required && !value) {
      throw new Error(`Variable is required`);
    }
    return value;
  }
}
