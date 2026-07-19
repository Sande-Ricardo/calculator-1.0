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

export interface GridDTO {
  x_min: number;
  x_max: number;
  x_steps: number;
  y_min: number;
  y_max: number;
  y_steps: number;
}

export interface OdeSlopeFieldRequestDTO {
  equation_dy_dx: string;
  independent_var?: string;
  dependent_var?: string;
  grid: GridDTO;
}

export interface VectorFieldDTO {
  x: number[];
  y: number[];
  u: number[];
  v: number[];
}

export interface OdeSlopeFieldResponseDTO {
  status: string;
  vector_field: VectorFieldDTO;
}

