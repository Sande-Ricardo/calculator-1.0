import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiManagementService } from 'src/app/core/services/api-management.service';
import { IntegrationResponseDTO, StepNodeNormalized } from 'src/app/interfaces/Integration';
import { Step } from 'src/app/interfaces/step';
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
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void { }



  // functionInput: string = '';
  result: string = '';
  selectedVariable: string = 'x';
  steps: string[] = [];
  stepsArray: Step[] = [];

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

  // calculateIntegral(): void {
  //   if (!this.functionInput.trim()) {
  //     return;
  //   }

  //   // Placeholder for actual integration logic
  //   this.result = `d/d${this.selectedVariable}[${this.functionInput}]`;

  //   // Generate sample steps for demonstration
  //   this.steps = [
  //     `Apply integral to function: ${this.functionInput}`,
  //     `Use appropriate differentiation rules`,
  //     `Simplify the result`,
  //     `Final integral: ${this.result}`,
  //   ];
  // }

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
    
    // console.log(
    //   this.convertToArray(this.mock.steps)
    // );
    // this.stepsArray = this.convertToArray(this.mock.steps);
    this.rootSteps = normalizeSteps(this.mock.steps);
    // this.rootSteps$ = new Observable<StepNodeNormalized[]>(subscriber => {
    //   subscriber.next(normalizeSteps(this.mock.steps));
    //   subscriber.complete();
    // })
    console.log(this.mock);
    // this.response = this.mock;
    this.response$ = new Observable<IntegrationResponseDTO>(subscriber => {
      subscriber.next(this.mock);
      subscriber.complete();
    });
    this.result = this.mock.result;
    // this.antiderivativeLatex = this.mock.latex;]

  }
  mock = {
    "expression": "5*x**(3*2)*3 + e**3*x",
    "latex": "\\frac{e^{3} x^{2}}{2} + \\frac{15 x^{7}}{7}",
    "result": "e**3*x**2/2 + 15*x**7/7",
    "variable": "x",
    "steps": {
      "integrand": "e^{3} x + 15 x^{6}",
      "rule": "AddRule",
      "substeps": [
        {
          "constant": "e^{3}",
          "integrand": "e^{3} x",
          "other": "x",
          "rule": "ConstantTimesRule",
          "substep": {
            "base": "x",
            "exp": "1",
            "integrand": "x",
            "rule": "PowerRule",
            "variable": "x"
          },
          "variable": "x"
        },
        {
          "constant": "15",
          "integrand": "15 x^{6}",
          "other": "x^{6}",
          "rule": "ConstantTimesRule",
          "substep": {
            "base": "x",
            "exp": "6",
            "integrand": "x^{6}",
            "rule": "PowerRule",
            "variable": "x"
          },
          "variable": "x"
        }
      ],
      "variable": "x"
    }
  }


  //integral function checkout

  expression = 'x*exp(x)'; // ejemplo
  variable = 'x';

  loading = false;
  error: string | null = null;

  // response?: IntegrationResponseDTO;
  // response$: Observable<IntegrationResponseDTO> = new Observable<IntegrationResponseDTO>();
  private _responseSource = new BehaviorSubject<IntegrationResponseDTO | null>(null);
  response$ = this._responseSource.asObservable();
  rootSteps: StepNodeNormalized[] = []; // StepNodeNormalized[]
  // rootSteps$: Observable<StepNodeNormalized[]> = new Observable<StepNodeNormalized[]>();
  antiderivativeLatex = '\\frac{e^{3} x^{2}}{2} + \\frac{15 x^{7}}{7}'; // LaTeX final, directo a MathJax


  onCompute(): void {
    this.loading = true;
    this.error = null;
    this._responseSource.next(null);
    this.rootSteps = [];
    // this.rootSteps$ = new Observable<StepNodeNormalized[]>();
    this.antiderivativeLatex = '';

    this.apiManagementSv.integrate({ expression: this.expression, variable: this.variable })
      .subscribe({
        
        next: (res) => {
          console.log("next");
          
          this._responseSource.next(res);
          // this.response = res;
          console.log("res: ",res);

          this.antiderivativeLatex = res.latex; // LaTeX final, directo a MathJax
          this.rootSteps = normalizeSteps(res.steps);
          // this.rootSteps$ = new Observable<StepNodeNormalized[]>(subscriber => {
          //   subscriber.next(normalizeSteps(res.steps));
          //   // this.cdr.detectChanges();
          //   console.log(res.steps);
          //   subscriber.complete();
          // });
          this.loading = false;
          this.result = res.result;
        },
        error: (err) => {
          this.error = err?.error?.error ?? 'Error al integrar.';
          this.loading = false;
        }
      });
  }

  trackByIdx = (_: number, __: any) => _;


  statusTest(){
    console.log('Var status:', this.expression, this.loading, this.error, this.antiderivativeLatex, this.steps);
  }
}



