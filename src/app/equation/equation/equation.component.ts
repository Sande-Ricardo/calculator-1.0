import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiManagementService } from 'src/app/core/services/api-management.service';
import { EquationRequestDTO, EquationResponseDTO, EquationStep } from 'src/app/interfaces/Equation';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EquationComponent implements OnInit {

  expression: string = '';
  operation: 'solve' | 'factorize' | 'expand' | 'simplify' = 'solve';
  targetVariable: string = 'x';
  method: 'factorization' | 'general_formula' | 'quadratic_formula' | 'default' = 'factorization';

  mathJaxExpression: string = '';
  results: string[] = [];
  steps: EquationStep[] = [];
  
  private _responseSource = new BehaviorSubject<EquationResponseDTO | null>(null);
  response$ = this._responseSource.asObservable();

  functionButtons: string[] = ['sin(', 'cos(', 'tan(', 'ln(', 'log(', 'e^(', 'e', 'π', '^', 'sqrt('];
  functionVisible: string[] = ['sin', 'cos', 'tan', 'ln', 'log', 'e^', 'e', 'π', '^', '√'];
  
  basicButtons: string[] = ['(', ')', '+', '-', '*', '/', '=', ','];
  basicVisible: string[] = ['(', ')', '+', '-', '×', '÷', '=', ','];

  variableButtons: string[] = ['x', 'y', 'z', 't'];

  constructor(private apiManagementSv: ApiManagementService) { }

  ngOnInit(): void {
  }

  appendToInput(value: string): void {
    this.expression += value;
    this.updateMathJaxExpression();
  }

  clearInput(): void {
    this.expression = '';
    this.results = [];
    this.steps = [];
    this.mathJaxExpression = '';
    this._responseSource.next(null);
  }

  updateMathJaxExpression(): void {
    if (!this.expression) {
      this.mathJaxExpression = '';
      return;
    }
    const latex = this.apiManagementSv.convertToLatex(this.expression);
    this.mathJaxExpression = latex ? `\\( ${latex} \\)` : `\\( ${this.expression} \\)`;
  }

  calculate(): void {
    if (!this.expression) return;

    const request: EquationRequestDTO = {
      expression: this.expression,
      operation: this.operation,
      target_variable: this.operation === 'solve' ? this.targetVariable : undefined,
      method: this.operation === 'solve' ? this.method : undefined
    };

    this.apiManagementSv.solveEquation(request).subscribe({
      next: (response) => {
        this._responseSource.next(response);
        this.results = response.final_result;
        this.steps = response.steps;
      },
      error: (err) => {
        console.error('API Error', err);
      }
    });
  }

}
