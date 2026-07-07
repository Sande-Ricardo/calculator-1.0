import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as math from 'mathjs';

@Component({
  selector: 'app-standard-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './standard-calculator.component.html',
  styleUrls: ['./standard-calculator.component.scss']
})
export class StandardCalculatorComponent implements OnInit {

  isScientificMode: boolean = false;
  isDegrees: boolean = true;
  expression: string = '0';
  writing: boolean = true;

  basicButtons: string[] = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+'];
  scientificButtons = [
    { label: 'sin', value: 'sin(' },
    { label: 'cos', value: 'cos(' },
    { label: 'tan', value: 'tan(' },
    { label: 'ln', value: 'log(' },
    { label: 'exp', value: 'exp(' },
    { label: '√', value: 'sqrt(' },
    { label: 'ⁿ√', value: 'nthRoot(' },
    { label: '^', value: '^' },
    { label: 'n!', value: '!' },
    { label: 'π', value: 'pi' },
    { label: 'e', value: 'e' },
    { label: '(', value: '(' },
    { label: ')', value: ')' }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  toggleScientificMode(): void {
    this.isScientificMode = !this.isScientificMode;
  }

  toggleAngleMode(): void {
    this.isDegrees = !this.isDegrees;
  }

  append(char: string): void {
    if (!this.writing) {
      if (['+', '-', '*', '/', '^'].includes(char)) {
        // Continue operating on the result
        this.writing = true;
      } else {
        // Overwrite the result
        this.expression = char;
        this.writing = true;
        return;
      }
    }

    if (this.expression === '0' && char !== '.') {
      this.expression = char;
    } else {
      this.expression += char;
    }
  }

  clear(): void {
    this.expression = '0';
    this.writing = true;
  }

  delete(): void {
    if (!this.writing) {
      this.clear();
      return;
    }

    if (this.expression.length <= 1) {
      this.expression = '0';
    } else {
      this.expression = this.expression.slice(0, -1);
    }
  }

  evaluateExpression(): void {
    if (!this.writing) return; // Already evaluated

    try {
      // Build a custom scope for trig functions if in degrees
      const scope: any = {};
      if (this.isDegrees) {
        ['sin', 'cos', 'tan', 'sec', 'cot', 'csc'].forEach(name => {
          const fn = (math as any)[name];
          scope[name] = (x: any) => {
            if (typeof x === 'number') return fn(x * Math.PI / 180);
            return fn(x);
          };
        });
        ['asin', 'acos', 'atan', 'asec', 'acot', 'acsc'].forEach(name => {
          const fn = (math as any)[name];
          scope[name] = (x: any) => {
            const result = fn(x);
            if (typeof result === 'number') return result * 180 / Math.PI;
            return result;
          };
        });
      }

      // Evaluate the expression using mathjs with the custom scope
      const result = math.evaluate(this.expression, scope);
      
      // Format to avoid extremely long decimals
      this.expression = math.format(result, { precision: 10 });
      this.writing = false;
    } catch (error) {
      this.expression = 'Error';
      this.writing = false;
    }
  }

  percent(): void {
    if (this.writing) {
      try {
        const val = math.evaluate(this.expression);
        this.expression = math.format(val / 100, { precision: 10 });
      } catch (error) {
        this.expression = 'Error';
        this.writing = false;
      }
    }
  }
}
