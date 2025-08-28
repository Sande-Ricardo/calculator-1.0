import { Component, OnInit } from '@angular/core';
import { Step } from 'src/app/interfaces/step';

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
  stepsArray: Step[] = [];

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


  implementMock(){
    console.log(
      this.convertToArray(this.mock.steps)
    );
    this.stepsArray = this.convertToArray(this.mock.steps);
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
}


