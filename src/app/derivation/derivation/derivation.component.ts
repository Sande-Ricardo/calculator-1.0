import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiManagementService } from 'src/app/core/services/api-management.service';
import { DerivativeResponseDTO } from 'src/app/interfaces/Derivation';
import { DerivationResponseMock } from 'src/app/mocks/flask.mock';

@Component({
  selector: 'app-derivation',
  templateUrl: './derivation.component.html',
  styleUrls: ['./derivation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DerivationComponent implements OnInit {
  constructor(
    private apiManagementSv: ApiManagementService
  ) {
  }
  ngOnInit(): void {
  }
  
  
  
  functionInput: string = '';
  mathJaxExpression: string = "f(x) = ?";
  
  result: string = '';
  selectedVariable: string = 'x';
  // steps: string[] = [];
  
  derivativeSteps!:DerivativeResponseDTO;
  private _responseSource = new BehaviorSubject<DerivativeResponseDTO | null>(null);
  response$ = this._responseSource.asObservable();
  
  private _functionsToViewSource = new BehaviorSubject<string[] | null>(null);
  functionsToView$ = this._functionsToViewSource.asObservable();

  functionButtons: string[] = [
    'sin(',
    'cos(',
    'tan(',
    'ln(',
    'log(',
    'e^(',
    'e',
    'π',
    '^',
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
  functionVisible:string[] = [
    'sin',
    'cos',
    'tan',
    'ln',
    'log',
    'e^',
    'e',
    'π',
    '^',
    '√',
  ];
  basicVisible:string[] = [
    '(',
    ')',
    '+',
    '-',
    '×',
    '÷',
  ];



  appendToInput(value: string): void {
    this.mathJaxExpression = "f(x) = " + "$" + this.functionInput + "$"
    this.functionInput += value;
  }

  clearInput(): void {
    this.functionInput = '';
    this.result = '';
    this._responseSource.next(null);
  }

  calculateDerivative(): void {
    // Placeholder for actual derivation logic
    this.result = `d/d${this.selectedVariable}[${this.functionInput}]`;

    this._responseSource.next(
      this.apiManagementSv.derivationRequest(this.functionInput, this.selectedVariable)
    );

  }

  implementMock() {
      console.log('Implementing mock data...');
      const mock = DerivationResponseMock;
      this.response$ = new Observable<DerivativeResponseDTO>(subscriber => {
        this.derivativeSteps = mock;
        subscriber.next(mock);
        subscriber.complete();
        
        this._functionsToViewSource.next(['y='+this.functionInput, 'y='+mock.step_result]);
        console.log("function inp: " + this.functionInput,"step res: "+ mock.step_result);
      });
      this.result = mock.step_result;
    }
}
