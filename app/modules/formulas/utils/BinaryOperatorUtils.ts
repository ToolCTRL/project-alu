import { FormulaEndResult, FormulaOperatorType, FormulaValueType } from "../dtos/FormulaDto";

type BinaryOperatorFn = (leftOperand: FormulaValueType, rightOperand: FormulaValueType) => FormulaEndResult;

// Helper function to create comparison operators
function createComparison(compareFn: (a: number | string, b: number | string) => boolean): BinaryOperatorFn {
  return (a: FormulaValueType, b: FormulaValueType) => {
    if (a === null || b === null) return false;
    if (typeof a === "number" && typeof b === "number") return compareFn(a, b);
    if (typeof a === "string" && typeof b === "string") return compareFn(a, b);
    if (a instanceof Date && b instanceof Date) return compareFn(a.getTime(), b.getTime());
    return false;
  };
}

const binaryOperators: Record<FormulaOperatorType, BinaryOperatorFn> = {
  ADD: (a: FormulaValueType, b: FormulaValueType) => {
    if (a === null && b === null) return 0;
    if (a === null) return 0;
    if (b === null) return a as number;

    if (typeof a === "number" && typeof b === "number") return a + b;
    if (typeof a === "string" || typeof b === "string") return Number(a) + Number(b);
    if (typeof a === "boolean" && typeof b === "boolean") return a || b;
    if (a instanceof Date && typeof b === "number") {
      const newDate = new Date(a);
      newDate.setDate(newDate.getDate() + b);
      return newDate;
    }
    return 0;
  },
  SUBTRACT: (a: FormulaValueType, b: FormulaValueType) => {
    if (a === null || b === null) return a !== null ? (a as number) : 0;
    if (typeof a === "number" && typeof b === "number") return a - b;
    if (typeof a === "string" && typeof b === "string") return a.replace(b, "");
    if (typeof a === "boolean" && typeof b === "boolean") return a && !b;
    if (a instanceof Date && typeof b === "number") {
      const newDate = new Date(a);
      newDate.setDate(newDate.getDate() - b);
      return newDate;
    }
    return 0;
  },
  MULTIPLY: (a: FormulaValueType, b: FormulaValueType) => (a !== null && b !== null ? Number(a) * Number(b) : false),
  DIVIDE: (a: FormulaValueType, b: FormulaValueType) => (a !== null && b !== null && b !== 0 ? Number(a) / Number(b) : false),
  CONCAT: (a: FormulaValueType, b: FormulaValueType) => (a?.toString() ?? "") + (b?.toString() ?? ""),
  EQUALS: (a: FormulaValueType, b: FormulaValueType) => {
    if (a === null || b === null) return false;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (typeof a === typeof b) return a === b;
    return false;
  },
  NOT_EQUALS: (a: FormulaValueType, b: FormulaValueType) => {
    if (a === null || b === null) return false;
    if (a instanceof Date && b instanceof Date) return a.getTime() !== b.getTime();
    if (typeof a === typeof b) return a !== b;
    return false;
  },
  GREATER_THAN: createComparison((a, b) => a > b),
  LESS_THAN: createComparison((a, b) => a < b),
  GREATER_THAN_OR_EQUAL: createComparison((a, b) => a >= b),
  LESS_THAN_OR_EQUAL: createComparison((a, b) => a <= b),
  AND: (a: FormulaValueType, b: FormulaValueType) => {
    if (typeof a === "boolean" && typeof b === "boolean") {
      return a && b;
    } else {
      let aIsTrue = (a || a === "true") && a !== "false";
      let bIsTrue = (b || b === "true") && b !== "false";
      return aIsTrue && bIsTrue;
    }
  },
  OR: (a: FormulaValueType, b: FormulaValueType) => Boolean(a || b),
  NOT: (a: FormulaValueType) => !a,
  DATE_ADD_DAYS: (a: FormulaValueType, b: FormulaValueType) => {
    if (a instanceof Date || typeof a === "string") {
      const newDate = new Date(a);
      newDate.setDate(newDate.getDate() + Number(b ?? 0));
      return newDate;
    } else {
      return null;
    }
  },
};

export default {
  binaryOperators,
};
