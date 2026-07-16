export interface InitialConditionsDTO {
  x0: number;
  y0: number;
  y0_prime?: number;
}

export interface OdeSolveRequestDTO {
  equation: string;
  independent_var?: string;
  dependent_var?: string;
  initial_conditions?: InitialConditionsDTO;
}

export interface OdeStepDTO {
  order: number;
  description: string;
  math_state: string;
}

export interface OdeSolveResponseDTO {
  status: string;
  classification_id: string;
  classification_name: string;
  general_solution: string;
  particular_solution?: string;
  steps: OdeStepDTO[];
}
