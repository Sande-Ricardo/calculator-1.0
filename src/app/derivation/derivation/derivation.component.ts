import { Component, OnInit } from '@angular/core';
import { ApiManagementService } from 'src/app/core/services/api-management.service';

@Component({
  selector: 'app-derivation',
  templateUrl: './derivation.component.html',
  styleUrls: ['./derivation.component.scss'],
})
export class DerivationComponent implements OnInit {
  constructor(
    private apiManagementSv: ApiManagementService
  ) {}
  ngOnInit(): void {}
  
  
  
  functionInput: string = '';
  result: string = '';
  selectedVariable: string = 'x';
  steps: string[] = [];

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
    this.functionInput += value;
  }

  clearInput(): void {
    this.functionInput = '';
    this.result = '';
    this.steps = [];
  }

  calculateDerivative(): void {
    
    console.log(this.apiManagementSv.sanitizeExpression(this.functionInput));
    

    // Placeholder for actual derivation logic
    this.result = `d/d${this.selectedVariable}[${this.functionInput}]`;

    // Generate sample steps for demonstration
    this.steps = [
      `Apply derivative to function: ${this.functionInput}`,
      `Use appropriate differentiation rules`,
      `Simplify the result`,
      `Final derivative: ${this.result}`,
    ];
  }
}
