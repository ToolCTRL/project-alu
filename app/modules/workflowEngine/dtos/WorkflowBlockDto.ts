import { WorkflowConditionsGroupDto } from "./WorkflowConditionDtos";
import { WorkflowBlockType } from "./WorkflowBlockTypes";

export type WorkflowBlockDto = {
  id: string;
  index: number;
  type: WorkflowBlockType;
  variableName: string;
  description: string;
  input: { [key: string]: any };
  isTrigger: boolean;
  isBlock: boolean;
  conditionGroups: WorkflowConditionsGroupDto[];
  toBlocks: {
    id: string;
    toBlockId: string;
    condition: string | null;
  }[];
};
