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
  expression: string = '0';
  writing: boolean = true;

  basicButtons: string[] = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+'];
  scientificButtons: string[] = ['sin(', 'cos(', 'tan(', 'log(', 'exp(', 'sqrt(', '^', 'pi', 'e', '(', ')'];

  constructor() { }

  ngOnInit(): void {
  }

  toggleScientificMode(): void {
    this.isScientificMode = !this.isScientificMode;
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
      // Evaluate the expression using mathjs
      const result = math.evaluate(this.expression);
      
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
