import { FormulaOperatorType, FormulaDto, FormulaValueType, FormulaResultAsType, FormulaEndResult } from "../dtos/FormulaDto";
import BinaryOperatorUtils from "./BinaryOperatorUtils";
import FormulaHelpers from "./FormulaHelpers";

interface CalculationState {
  result: FormulaValueType;
  currentOperand: FormulaValueType;
  currentOperator: FormulaOperatorType | null;
  lastComponent: string | null;
  insideParentheses: FormulaDto | null;
  openParenthesesCount: number;
  closeParenthesesCount: number;
}

function createState(): CalculationState {
  return {
    result: null,
    currentOperand: null,
    currentOperator: null,
    lastComponent: null,
    insideParentheses: null,
    openParenthesesCount: 0,
    closeParenthesesCount: 0,
  };
}

function calculateFormula(formula: FormulaDto, values: Record<string, FormulaValueType>): FormulaEndResult {
  const state = createState();
  const resultAs: FormulaResultAsType = FormulaHelpers.getResultAs(formula.resultAs);

  processComponents(formula, state, values);
  return convertResult(finalizeCalculation(state), resultAs);
}

function processComponents(formula: FormulaDto, state: CalculationState, values: Record<string, FormulaValueType>) {
  for (const component of formula.components) {
    switch (component.type) {
      case "variable":
        state.lastComponent = "variable: " + component.value;
        handleVariable(component, state, values);
        break;
      case "operator":
        state.lastComponent = "operator: " + component.value;
        handleOperator(component, state);
        break;
      case "parenthesis":
        state.lastComponent = "parenthesis: " + component.value;
        handleParenthesis(component, state, formula);
        break;
      case "value":
        state.lastComponent = "value: " + component.value;
        handleValue(component, state);
        break;
    }
  }
}

function handleVariable(component: any, state: CalculationState, values: Record<string, FormulaValueType>) {
  if (state.insideParentheses) {
    state.insideParentheses.components.push(component);
  } else {
    state.currentOperand = values[component.value];
  }
}

function handleOperator(component: any, state: CalculationState) {
  if (state.currentOperator) {
    if (state.insideParentheses) {
      state.insideParentheses.components.push(component);
    } else {
      state.result = BinaryOperatorUtils.binaryOperators[state.currentOperator](state.result, state.currentOperand);
    }
  } else if (state.insideParentheses) {
    throw new Error("Invalid formula: parentheses must be used in pairs");
  } else {
    state.result = state.currentOperand;
  }
  state.currentOperand = null;
  state.currentOperator = FormulaHelpers.getOperatorType(component.value);
}

function handleParenthesis(component: any, state: CalculationState, formula: FormulaDto) {
  const parenthesis = FormulaHelpers.getParenthesisType(component.value);
  if (parenthesis === "OPEN") {
    state.openParenthesesCount++;
    if (state.insideParentheses) {
      throw new Error("Invalid formula: parentheses must be used in pairs");
    }
    state.insideParentheses = { name: "", description: "", resultAs: "number", calculationTrigger: formula.calculationTrigger, components: [] };
  } else {
    handleCloseParenthesis(state);
  }
}

function handleCloseParenthesis(state: CalculationState) {
  if (!state.insideParentheses) {
    throw new Error("Invalid formula: parentheses must be used in pairs");
  }
  state.closeParenthesesCount++;
  if (state.closeParenthesesCount > state.openParenthesesCount) {
    throw new Error("Invalid formula: parentheses must be used in pairs");
  } else if (state.closeParenthesesCount === state.openParenthesesCount) {
    state.currentOperand = calculateFormula(state.insideParentheses, {});
    state.insideParentheses = null;
  } else {
    state.insideParentheses.components.push({ type: "parenthesis", value: "CLOSE" });
  }
}

function handleValue(component: any, state: CalculationState) {
  if (state.insideParentheses) {
    state.insideParentheses.components.push(component);
  } else {
    state.currentOperand = component.value;
  }
}

function finalizeCalculation(state: CalculationState): FormulaValueType {
  if (state.currentOperand !== null && state.currentOperator) {
    return BinaryOperatorUtils.binaryOperators[state.currentOperator](state.result, state.currentOperand);
  }
  if (state.result === null) {
    throw new Error(state.lastComponent ? `Invalid formula component ${state.lastComponent}` : "Invalid formula");
  }
  return state.result;
}

function convertResult(result: FormulaValueType, resultAs: FormulaResultAsType): FormulaEndResult {
  switch (resultAs) {
    case "number":
      return result === null ? null : Number(result);
    case "boolean":
      return result === null ? null : Boolean(result);
    case "date":
      return result instanceof Date ? result : null;
    case "string":
      if (result === null) {
        return null;
      }
      return typeof result === 'object' ? JSON.stringify(result) : String(result);
    default:
      throw new Error("Invalid resultAs value in formula");
  }
}

export default {
  calculateFormula,
};
