export type BlockExecutionResultDto = {
  output: { [key: string]: any } | null;
  toBlockIds: string[];
  error?: string | null;
  throwsError?: boolean;
};
