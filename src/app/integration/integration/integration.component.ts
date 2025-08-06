import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {
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

  constructor() {}

  ngOnInit(): void {}

  appendToInput(value: string): void {
    this.functionInput += value;
  }

  clearInput(): void {
    this.functionInput = '';
    this.result = '';
    this.steps = [];
  }

  calculateIntegral(): void {
    if (!this.functionInput.trim()) {
      return;
    }

    // Placeholder for actual integration logic
    this.result = `d/d${this.selectedVariable}[${this.functionInput}]`;

    // Generate sample steps for demonstration
    this.steps = [
      `Apply integral to function: ${this.functionInput}`,
      `Use appropriate differentiation rules`,
      `Simplify the result`,
      `Final integral: ${this.result}`,
    ];
  }
}
