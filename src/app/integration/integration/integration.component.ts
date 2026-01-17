import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiManagementService } from 'src/app/core/services/api-management.service';
import { IntegrationResponseDTO, StepNodeIntegrateNormalized } from 'src/app/interfaces/Integration';
import { Step } from 'src/app/interfaces/step';
import { IntegrationResponseMock } from 'src/app/mocks/flask.mock';
import { normalizeSteps } from './steps-normalizer';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationComponent implements OnInit {
  constructor(
    private apiManagementSv: ApiManagementService,
  ) {
  }
  ngOnInit(): void {
  }



  result: string = '';
  selectedVariable: string = 'x';
  steps: string[] = [];
  stepsArray: Step[] = [];

  //integral function checkout

  expression = 'x*exp(x)'; // ejemplo
  variable = 'x';

  loading = false;
  error: string | null = null;

  private _responseSource = new BehaviorSubject<IntegrationResponseDTO | null>(null);
  response$ = this._responseSource.asObservable();
  rootSteps: StepNodeIntegrateNormalized[] = []; // StepNodeNormalized[]

  functionsToView: string[] = [];

  antiderivativeLatex = '';

  functionButtons: string[] = [
    'sin(',
    'cos(',
    'tan(',
    'ln(',
    'log(',
    'e^(',
    '**',
    'sqrt(',
  ]
  basicButtons: string[] = [
    '(',
    ')',
    '+',
    '-',
    '*',
    '/',
  ]
  functionVisible: string[] = [
    'sin',
    'cos',
    'tan',
    'ln',
    'log',
    'e^',
    '^',
    '√',
  ];
  basicVisible: string[] = [
    '(',
    ')',
    '+',
    '-',
    '×',
    '÷',
  ];


  appendToInput(value: string): void {
    this.expression += value;
  }

  clearInput(): void {
    this.expression = '';
    this.result = '';
    this.steps = [];
  }


  convertToArray(step: Step): Step[] {
    const processStep = (s: Step): Step => {
      const result: Step = {
        rule: s.rule,
        integrand: s.integrand,
      };
      if (s.constant) result.constant = s.constant;
      if (s.base) result.base = s.base;
      if (s.exp) result.exp = s.exp;
      if (s.substeps && s.substeps.length > 0) {
        result.substeps = s.substeps.map(processStep);
      }
      return result;
    };
    return [processStep(step)];
  }

  implementMock() {
    console.log('Implementing mock data...');
    const mock = IntegrationResponseMock;
    this.rootSteps = normalizeSteps(mock.steps);
    this.functionsToView = [this.expression, this.result];

    console.log(mock);
    this.response$ = new Observable<IntegrationResponseDTO>(subscriber => {
      subscriber.next(mock);
      subscriber.complete();
    });
    this.result = mock.result;

  }



  onCompute(): void {
    this.loading = true;
    this.error = null;
    this._responseSource.next(null);
    this.rootSteps = [];
    this.antiderivativeLatex = '';

    this.apiManagementSv.integrate({ expression: this.expression, variable: this.variable })
      .subscribe({

        next: (res) => {
          console.log("next");

          this._responseSource.next(res);
          console.log("res: ", res);

          this.antiderivativeLatex = res.latex;
          this.rootSteps = normalizeSteps(res.steps);
          this.loading = false;
          this.result = res.result;

          this.functionsToView = ['y='+this.apiManagementSv.convertToLatex(this.expression), 'y='+this.antiderivativeLatex];
          
        },
        error: (err) => {
          this.error = err?.error?.error ?? 'Error al integrar.';
          this.loading = false;
        }
      });
  }

  trackByIdx = (_: number, __: any) => _;

  statusTest() {
    console.log('Var status:', this.expression, this.loading, this.error, this.antiderivativeLatex, this.steps);
  }
}



