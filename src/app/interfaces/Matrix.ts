import { EquationStep } from './Equation';

export interface MatrixRequestDTO {
  matrix: string[][];
  operation: 'inverse' | 'determinant' | 'rref';
  mode?: 'symbolic' | 'numeric';
}

export interface MatrixResponseDTO {
  status: string;
  operation: string;
  result: string[][];
  steps: EquationStep[];
}
