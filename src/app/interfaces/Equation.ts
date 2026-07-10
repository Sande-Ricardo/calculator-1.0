export interface EquationRequestDTO {
  expression: string;
  operation: 'solve' | 'factorize' | 'expand' | 'simplify';
  target_variable?: string;
  method?: 'factorization' | 'general_formula' | 'quadratic_formula' | 'default';
}

export interface EquationStep {
  order: number;
  description: string;
  math_state: string;
}

export interface EquationResponseDTO {
  status: string;
  original_expression: string;
  final_result: string[];
  steps: EquationStep[];
}
