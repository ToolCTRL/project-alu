import { WorkflowDto } from "../dtos/WorkflowDto";
import { WorkflowBlockType, WorkflowBlockTypes } from "../dtos/WorkflowBlockTypes";
import { WorkflowBlockDto } from "../dtos/WorkflowBlockDto";
import WorkflowConditionUtils from "./WorkflowConditionUtils";
import { WorkflowBlockWithDetails } from "../db/workflowBlocks.db.server";
import { WorkflowConditionOperator } from "../dtos/WorkflowConditionDtos";

function rowToDto(block: WorkflowBlockWithDetails, index: number = 0) {
  let input: any = {};
  try {
    input = JSON.parse(block.input);
  } catch {
    input = {};
  }
  const workflowBlock: WorkflowBlockDto = {
    id: block.id,
    index,
    type: block.type as WorkflowBlockType,
    variableName: "",
    description: block.description,
    input,
    isTrigger: block.isTrigger,
    isBlock: block.isBlock,
    toBlocks: block.toBlocks.map((toBlock) => {
      return {
        id: toBlock.id,
        fromBlockId: block.id,
        toBlockId: toBlock.toBlockId,
        condition: toBlock.condition,
      };
    }),
    conditionGroups: block.conditionsGroups
      .sort((a, b) => a.index - b.index)
      .map((group) => {
        return {
          index: group.index,
          type: group.type as "AND" | "OR",
          conditions: group.conditions
            .sort((a, b) => a.index - b.index)
            .map((condition) => {
              return {
                index: condition.index,
                variable: condition.variable,
                operator: condition.operator as WorkflowConditionOperator,
                value: condition.value,
              };
            }),
        };
      }),
  };
  return workflowBlock;
}

function validateBlockConnections(workflow: WorkflowDto, block: WorkflowBlockDto): string[] {
  const errors: string[] = [];

  if (block.isTrigger && block.toBlocks.length === 0) {
    errors.push("Add a next block for this trigger");
    return errors;
  }

  if (!block.isBlock) {
    return errors;
  }

  const nodesConnectingToThisBlock = workflow.blocks.filter((f) =>
    f.toBlocks.find((t) => t.toBlockId === block.id)
  );
  if (nodesConnectingToThisBlock.length === 0) {
    errors.push("Nothing is connecting to this block");
  }

  return errors;
}

function validateIfBlock(block: WorkflowBlockDto): string[] {
  const errors: string[] = [];
  const hasTrue = block.toBlocks.find((f) => f.condition === "true");
  const hasFalse = block.toBlocks.find((f) => f.condition === "false");

  if (!hasTrue) {
    errors.push("Add a next block for true condition");
  }
  if (!hasFalse) {
    errors.push("Add a next block for false condition");
  }
  return errors;
}

function validateSwitchBlock(block: WorkflowBlockDto): string[] {
  const errors: string[] = [];
  const hasDefault = block.toBlocks.find((f) => f.condition === "default");

  if (!hasDefault) {
    errors.push("Add a next block for default condition");
  }

  block.conditionGroups.forEach((conditionGroup) => {
    const hasCase = block.toBlocks.find((f) => f.condition === `case${conditionGroup.index + 1}`);
    if (!hasCase) {
      errors.push(`Add a next block for case ${conditionGroup.index + 1}`);
    }
  });

  return errors;
}

function validateIteratorBlock(block: WorkflowBlockDto): string[] {
  const errors: string[] = [];
  const hasLoopNext = block.toBlocks.find((f) => f.condition === "loopNext");
  const hasLoopEnd = block.toBlocks.find((f) => f.condition === "loopEnd");

  if (!hasLoopNext) {
    errors.push("Add a next block for loopNext condition");
  }
  if (!hasLoopEnd) {
    errors.push("Add a next block for loopEnd condition");
  }
  return errors;
}

function validateBlockInputs(block: WorkflowBlockDto, workflowBlock: WorkflowBlockType | undefined): string[] {
  const errors: string[] = [];

  if (!workflowBlock) {
    errors.push("Invalid workflow block type: " + block.type);
    return errors;
  }

  workflowBlock.inputs?.forEach((input) => {
    if (input.required && !block.input[input.name]) {
      errors.push("Missing required input: " + input.name);
    }
  });

  return errors;
}

function validateConditionGroups(block: WorkflowBlockDto, workflowBlock: WorkflowBlockType | undefined): string[] {
  const errors: string[] = [];

  if (workflowBlock?.value === "if") {
    const conditionGroups = block.conditionGroups;
    if (conditionGroups.length !== 1) {
      errors.push("At least one condition group is required");
    } else if (conditionGroups[0].conditions.length === 0) {
      errors.push("At least one condition is required");
    } else {
      const groupErrors = WorkflowConditionUtils.getConditionsErrors(conditionGroups[0].conditions);
      if (groupErrors.length > 0) {
        errors.push("Invalid conditions: " + groupErrors.flatMap((f) => f.errors).join(", "));
      }
    }
  } else if (workflowBlock?.value === "switch") {
    const conditionGroups = block.conditionGroups;
    if (conditionGroups.length < 2) {
      errors.push("At least two condition groups are required");
    } else {
      conditionGroups.forEach((group) => {
        if (group.conditions.length === 0) {
          errors.push("At least one condition is required");
        } else {
          const groupErrors = WorkflowConditionUtils.getConditionsErrors(group.conditions);
          if (groupErrors.length > 0) {
            errors.push("Invalid conditions: " + groupErrors.flatMap((f) => f.errors).join(", "));
          }
        }
      });
    }
  }

  return errors;
}

function getBlockErrors({ workflow, block }: { workflow: WorkflowDto; block: WorkflowBlockDto }) {
  const errors: string[] = [];

  errors.push(...validateBlockConnections(workflow, block));

  if (block.type === "if") {
    errors.push(...validateIfBlock(block));
  } else if (block.type === "switch") {
    errors.push(...validateSwitchBlock(block));
  } else if (block.type === "iterator") {
    errors.push(...validateIteratorBlock(block));
  }

  const workflowBlock = WorkflowBlockTypes.find((f) => f.value === block.type);
  errors.push(...validateBlockInputs(block, workflowBlock));
  errors.push(...validateConditionGroups(block, workflowBlock));

  return errors;
}

export default {
  rowToDto,
  getBlockErrors,
};
