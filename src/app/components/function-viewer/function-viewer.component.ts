import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import * as math from 'mathjs';
import { environment } from 'src/environments/environment';

declare var Desmos: any;

@Component({
  selector: 'app-function-viewer',
  templateUrl: './function-viewer.component.html',
  styleUrls: ['./function-viewer.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class FunctionViewerComponent implements AfterViewInit, OnChanges {
  @ViewChild('calculatorContainer') container!: ElementRef;

  constructor() { }

  calculator: any;
  data: any = null;

  @Input() functions: string[] = [];

  hexColors: string[] = ['#FF8500', '#00FEB6', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  ngAfterViewInit() {
    this.checkDesmosAvailability();
  }

  private checkDesmosAvailability() {
    if (typeof Desmos !== 'undefined') {
      this.initCalculator();
    } else {
      setTimeout(() => this.checkDesmosAvailability(), 100);
    }
  }

  private initCalculator() {
    this.calculator = Desmos.GraphingCalculator(this.container.nativeElement, {
      keypad: false,

      invertedColors: true,
      expressionsCollapsed: true,
      xAxisBounds: { min: -5, max: 5 },
      yAxisBounds: { min: -5, max: 5 }
    });

    this.renderFunctions();
  }

  renderFunctions(): void {
    this.functions.forEach((funcLatex: string, index: number) => {
      this.calculator.setExpression({ latex: funcLatex, color: this.hexColors[index] });
    });
    console.log("render functions: "+ this.functions);
  }

  analyzeFunction(func:string) {
    try {
      const exp = this.cleanerLatex(func);
      const f = math.parse(exp);
      console.log(f);
      const fDerivative = math.derivative(f, 'x'); // symbolic derivative

      const roots: number[] = [];

      // roots of -10 to 10
      for (let i = -10; i <= 10; i++) {
        const root = this.newtonRaphson(f, fDerivative, i);
        if (root !== null) {
          // Avoid duplicates and round up to clean up UI
          const fixedValue = parseFloat(root.toFixed(4));
          if (!roots.includes(fixedValue)) roots.push(fixedValue);
        }
      }

      this.data = {
        roots: roots.sort((a, b) => a - b),

        // critical: this.searchCriticalPoints(fDerivative)
      };

    } catch (error) {
      console.error("Error to analyze:", error);
    }
  }

  // Newton-Raphson's algorithm: x^{n+1} = x^n - f(x^n) / f'(x^n)
  private newtonRaphson(f: math.MathNode, df: math.MathNode, guess: number): number | null {
    let x = guess;
    const iters = 20; // iteration limit
    const eps = 1e-5;  // Accuracy

    for (let i = 0; i < iters; i++) {
      const y = f.evaluate({ x: x });
      const dy = df.evaluate({ x: x });

      if (Math.abs(dy) < 1e-10) break; // Avoid division by zero

      const xNext = x - y / dy;

      if (Math.abs(xNext - x) < eps) {
        return xNext;
      }
      x = xNext;
    }
    return null;
  }

  private cleanerLatex(latex: string): string {
    return latex.replace(/f\(x\)\s*=/g, '').trim();
  }




  loaderDesmosScript(): void {
    const scriptId = 'desmos-script';
    if (document.getElementById(scriptId)) return

    const script = document.createElement('script');
    script.id = scriptId;
    // script.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${environment.desmosApiKey}`;
    script.src = `https://www.desmos.com/api/v1.9/calculator.js?apiKey=${environment.desmosApiKey}`;
    script.async = true;

    document.head.appendChild(script);
  }

  actualizeFunctions(): void {
    if (this.calculator) {
      this.clearExpressions();
      this.renderFunctions();
    }
  }

  clearExpressions(): void {
    if (this.calculator) {
      const expressions = this.calculator.getExpressions();
      console.log(expressions);
      
      this.calculator.removeExpressions(expressions);
    }
  }

  ngOnInit(): void {
    this.loaderDesmosScript();
  }

  ngOnChanges(changes:SimpleChanges) {
      if (changes['functions'] && !changes['functions'].firstChange) {
        this.actualizeFunctions();
        console.log("ngOnChanges");
        
      }
  }
}
