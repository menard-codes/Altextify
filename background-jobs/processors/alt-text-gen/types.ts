import { StepStatus } from "../types/shared";

export type BulkUpdateImageAltTextsProgress = Record<
  number,
  {
    stepName: string;
    status: StepStatus;
  }
>;
