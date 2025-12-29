import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
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
export class FunctionViewerComponent implements AfterViewInit {
  @ViewChild('calculatorContainer') container!: ElementRef;

  constructor() { }

  calculator: any;
  data: any = null;

  @Input() functions: string[] = [];
  // @Input() originalLatex: string = ''; // Ejemplo de función polinómica
  // @Input() secondaryLatex: string = ''; // Función secundaria opcional

  hexColors: string[] = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];

  ngAfterViewInit() {
    // // Inicializar el calculador
    // this.calculator = Desmos.GraphingCalculator(this.container.nativeElement, {
    //   keypad: false, // Ocultar teclado para una estética más limpia
    //   expressions: true,
    //   settingsMenu: false
    // });

    // console.log("desmos: ", this.calculator);


    // this.renderFunctions();
    // this.analyzeFunction();
  
    this.checkDesmosAvailability();
  }

  private checkDesmosAvailability() {
    if (typeof Desmos !== 'undefined') {
      this.initCalculator();
    } else {
      // Si no está listo, reintentamos en 100ms
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
      // const color = index === 0 ? Desmos.Colors.BLUE : Desmos.Colors.GREEN;
      this.calculator.setExpression({ latex: funcLatex, color: this.hexColors[index] });
    });
    // this.calculator.setExpression({ latex: this.originalLatex, color: Desmos.Colors.BLUE });
    // this.calculator.setExpression({ latex: this.secondaryLatex, color: Desmos.Colors.GREEN });
  }

  analyzeFunction(func:string) {    // ¡¡¡ Hace falta pasar como parámetro la variable !!! (ahora se asume que es 'x')
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

        // Los puntos críticos son las raíces de la derivada
        // criticos: this.buscarPuntosCriticos(fDerivada)
      };

    } catch (error) {
      console.error("Error to analyze:", error);
    }
  }

  // Newton-Raphson's algorithm: x_{n+1} = x_n - f(x_n) / f'(x_n)
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



  ngOnInit(): void {
    this.loaderDesmosScript();
  }

}
