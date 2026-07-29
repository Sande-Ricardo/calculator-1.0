export interface EvaluationResult {
  success: boolean;
  value?: number;
  formattedResult?: string;
  latex?: string;
  error?: string;
  errorPosition?: number;
  variablesUsed?: string[];
}

export interface DetectedVariable {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export interface HistoryEntry {
  id: string;
  expression: string;
  variables: Record<string, number>;
  result: number;
  timestamp: string;
}

export interface RootFindingResult {
  root: number | null;
  iterations: number;
  converged: boolean;
  message: string;
}

export interface PlotPoint {
  x: number;
  y: number;
}
