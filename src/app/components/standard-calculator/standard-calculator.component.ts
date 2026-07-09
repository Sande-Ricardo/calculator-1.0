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
    { label: 'ln', value: 'ln(' },
    { label: 'exp', value: 'exp(' },
    { label: '√', value: '√(' },
    { label: 'ⁿ√', value: 'ⁿ√' },
    { label: '^', value: '^' },
    { label: 'n!', value: '!' },
    { label: 'π', value: 'π' },
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
    if (char === 'ⁿ√') {
      const match = this.expression.match(/(\d+)$/);
      if (match) {
        const num = match[1];
        const superscriptMap: any = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
        let superNum = '';
        for (let c of num) superNum += superscriptMap[c];
        
        this.expression = this.expression.slice(0, -num.length) + superNum + '√(';
        this.writing = true;
      } else {
        this.expression = (this.expression === '0') ? '√(' : this.expression + '√(';
        this.writing = true;
      }
      return;
    }

    if (!this.writing) {
      if (['+', '-', '*', '/', '^'].includes(char)) {
        this.writing = true;
      } else {
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

  onInputChange(event: string): void {
    // Optional: filter out invalid characters, for now just ensure writing is true
    this.writing = true;
    this.expression = event;
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

      // Pre-parse the expression for mathjs
      let parsedExpr = this.expression
        .replace(/ln\(/g, 'log(')
        .replace(/π/g, 'pi');

      // Parse nth-root: ³√(27) -> nthRoot(27, 3)
      const superscriptMap: any = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9' };
      const rootRegex = /([⁰¹²³⁴⁵⁶⁷⁸⁹]+)√\(/g;
      let match;
      while ((match = rootRegex.exec(parsedExpr)) !== null) {
        const fullMatch = match[0];
        const superscripts = match[1];
        let indexStr = '';
        for (let char of superscripts) indexStr += superscriptMap[char];
        
        const startIndex = match.index;
        const contentStartIndex = startIndex + fullMatch.length;
        let openCount = 1;
        let i = contentStartIndex;
        while (i < parsedExpr.length && openCount > 0) {
          if (parsedExpr[i] === '(') openCount++;
          if (parsedExpr[i] === ')') openCount--;
          i++;
        }
        
        if (openCount === 0) {
          const content = parsedExpr.substring(contentStartIndex, i - 1);
          const replaced = `nthRoot(${content}, ${indexStr})`;
          parsedExpr = parsedExpr.substring(0, startIndex) + replaced + parsedExpr.substring(i);
          rootRegex.lastIndex = 0; // reset
        } else {
          break;
        }
      }

      // Replace standalone √ after extracting nthRoots
      parsedExpr = parsedExpr.replace(/√\(/g, 'sqrt(');

      // Evaluate the expression using mathjs with the custom scope
      const result = math.evaluate(parsedExpr, scope);

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
