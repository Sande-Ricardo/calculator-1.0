import { Component, OnInit } from '@angular/core';
import { ApiManagementService } from 'src/app/core/services/api-management.service';
import { MatrixRequestDTO, MatrixResponseDTO } from 'src/app/interfaces/Matrix';
import { EquationStep } from 'src/app/interfaces/Equation';

@Component({
  selector: 'app-matrix',
  templateUrl: './matrix.component.html',
  styleUrls: ['./matrix.component.scss']
})
export class MatrixComponent implements OnInit {

  rows: number = 3;
  cols: number = 3;
  operation: 'inverse' | 'determinant' | 'rref' = 'inverse';
  mode: 'symbolic' | 'numeric' = 'symbolic';

  matrixInput: string[][] = [];
  resultMatrix: string[][] = [];
  resultLatex: string = '';
  steps: EquationStep[] = [];
  loading: boolean = false;
  errorMessage: string = '';

  rowOptions: number[] = [1, 2, 3, 4, 5];
  colOptions: number[] = [1, 2, 3, 4, 5];

  constructor(private apiService: ApiManagementService) { }

  ngOnInit(): void {
    this.updateGridSize();
  }

  updateGridSize(): void {
    const newGrid: string[][] = [];
    for (let r = 0; r < this.rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < this.cols; c++) {
        // Preserving existing value if it is within boundaries, otherwise initialize to '0'
        if (this.matrixInput[r] && this.matrixInput[r][c] !== undefined) {
          row.push(this.matrixInput[r][c]);
        } else {
          row.push('0');
        }
      }
      newGrid.push(row);
    }
    this.matrixInput = newGrid;
  }

  clear(): void {
    this.resultMatrix = [];
    this.resultLatex = '';
    this.steps = [];
    this.errorMessage = '';
    // Reset inputs to '0'
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.matrixInput[r][c] = '0';
      }
    }
  }

  calculate(): void {
    this.loading = true;
    this.errorMessage = '';
    this.resultMatrix = [];
    this.resultLatex = '';
    this.steps = [];

    // Sanitize matrix input (replace commas with dots, remove whitespace, sanitize math expression logic)
    const sanitizedMatrix = this.matrixInput.map(row => 
      row.map(val => this.apiService.sanitizeExpression(val || '0'))
    );

    const request: MatrixRequestDTO = {
      matrix: sanitizedMatrix,
      operation: this.operation,
      mode: this.mode
    };

    this.apiService.solveMatrix(request).subscribe({
      next: (response: MatrixResponseDTO) => {
        this.loading = false;
        if (response.status === 'success') {
          this.resultMatrix = response.result;
          this.steps = response.steps;
          this.formatResultLatex();
        } else {
          this.errorMessage = 'Failed to calculate. Verify your matrix values.';
        }
      },
      error: (err) => {
        this.loading = false;
        console.error('Matrix calculation error:', err);
        this.errorMessage = 'An error occurred while calculating. Make sure the matrix is valid (e.g. square and invertible for inverse).';
      }
    });
  }

  formatResultLatex(): void {
    if (!this.resultMatrix || this.resultMatrix.length === 0) {
      this.resultLatex = '';
      return;
    }

    if (this.operation === 'determinant') {
      // Determinant result is a scalar. It is returned inside a 1x1 array.
      const scalarValue = this.resultMatrix[0] && this.resultMatrix[0][0] ? this.resultMatrix[0][0] : '0';
      this.resultLatex = `\\text{det}(A) = ${scalarValue}`;
    } else {
      // Format as bmatrix LaTeX
      const rowsStr = this.resultMatrix.map(row => row.join(' & ')).join(' \\\\ ');
      this.resultLatex = `\\begin{bmatrix} ${rowsStr} \\end{bmatrix}`;
    }
  }

  // Quick helper to fill identity matrix for testing
  fillIdentity(): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        this.matrixInput[r][c] = r === c ? '1' : '0';
      }
    }
  }
}
