import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as math from 'mathjs';

declare var Desmos: any;

export interface FunctionItem {
  id: string;
  latex: string;
  color: string;
  visible: boolean;
}

@Component({
  selector: 'app-graphing',
  templateUrl: './graphing.component.html',
  styleUrls: ['./graphing.component.scss']
})
export class GraphingComponent implements OnInit, AfterViewInit {
  @ViewChild('calculatorContainer') container!: ElementRef;

  calculator: any;
  activeTab: 'graph' | 'table' | 'analysis' = 'graph';
  
  // Expression list
  functions: FunctionItem[] = [
    { id: 'f1', latex: 'x^2', color: '#00FEB6', visible: true }
  ];
  activeFunctionId: string = 'f1';
  hexColors: string[] = ['#00FEB6', '#FF8500', '#d62728', '#9467bd', '#e377c2', '#17becf'];

  // Keyboard
  functionButtons: string[] = ['sin(', 'cos(', 'tan(', 'ln(', 'log(', 'e', 'π', '^', 'sqrt('];
  functionVisible: string[] = ['sin', 'cos', 'tan', 'ln', 'log', 'e', 'π', '^', '√'];
  basicButtons: string[] = ['(', ')', '+', '-', '*', '/', '='];
  basicVisible: string[] = ['(', ')', '+', '-', '×', '÷', '='];
  variableButtons: string[] = ['x', 'y'];

  // Table of Values
  tableRangeMin: number = -5;
  tableRangeMax: number = 5;
  tableStep: number = 1;
  tableData: any[] = []; // [{x: -5, f1: 25, f2: ...}]

  // Analysis
  analysisData: { funcId: string, color: string, roots: number[] }[] = [];

  constructor() { }

  ngOnInit(): void {
    this.loaderDesmosScript();
  }

  ngAfterViewInit() {
    this.checkDesmosAvailability();
  }

  // --- Desmos API ---

  private loaderDesmosScript(): void {
    const scriptId = 'desmos-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://www.desmos.com/api/v1.9/calculator.js?apiKey=${environment.desmosApiKey}`;
    script.async = true;
    document.head.appendChild(script);
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
      expressions: false,
      settingsMenu: false,
      zoomButtons: true,
      invertedColors: true, // Dark mode matching UI
      expressionsCollapsed: true,
      xAxisBounds: { min: -10, max: 10 },
      yAxisBounds: { min: -10, max: 10 }
    });
    this.renderFunctions();
  }

  // --- Functions Management ---

  addFunction() {
    const newId = 'f' + (this.functions.length + 1);
    const newColor = this.hexColors[this.functions.length % this.hexColors.length];
    this.functions.push({ id: newId, latex: '', color: newColor, visible: true });
    this.activeFunctionId = newId;
  }

  removeFunction(id: string) {
    this.functions = this.functions.filter(f => f.id !== id);
    if (this.activeFunctionId === id && this.functions.length > 0) {
      this.activeFunctionId = this.functions[0].id;
    }
    if (this.calculator) {
      this.calculator.removeExpression({ id: id });
    }
    this.renderFunctions();
  }

  toggleVisibility(item: FunctionItem) {
    item.visible = !item.visible;
    this.renderFunctions();
  }

  setActiveFunction(id: string) {
    this.activeFunctionId = id;
  }

  onExpressionChange() {
    this.renderFunctions();
  }

  renderFunctions() {
    if (!this.calculator) return;
    this.functions.forEach(f => {
      this.calculator.setExpression({
        id: f.id,
        latex: f.latex,
        color: f.color,
        hidden: !f.visible
      });
    });
  }

  // --- Keyboard ---

  appendToInput(val: string) {
    const activeFunc = this.functions.find(f => f.id === this.activeFunctionId);
    if (activeFunc) {
      activeFunc.latex += val;
      this.onExpressionChange();
    }
  }

  clearInput() {
    const activeFunc = this.functions.find(f => f.id === this.activeFunctionId);
    if (activeFunc) {
      activeFunc.latex = '';
      this.onExpressionChange();
    }
  }

  // --- Table of Values ---

  generateTable() {
    this.tableData = [];
    const eps = 1e-10;
    for (let x = this.tableRangeMin; x <= this.tableRangeMax + eps; x += this.tableRangeStepOr1()) {
      let row: any = { x: parseFloat(x.toFixed(4)) };
      this.functions.forEach(f => {
        if (f.visible && f.latex.trim() !== '') {
          try {
            // Clean latex to evaluate
            const cleaned = f.latex.replace(/y\s*=/g, '').replace(/f\(x\)\s*=/g, '').trim();
            const compiled = math.compile(cleaned);
            let val = compiled.evaluate({ x: row.x, e: Math.E, pi: Math.PI });
            row[f.id] = (typeof val === 'number' && !isNaN(val)) ? parseFloat(val.toFixed(4)) : '-';
          } catch (e) {
            row[f.id] = 'Error';
          }
        }
      });
      this.tableData.push(row);
    }
  }

  private tableRangeStepOr1() {
    return this.tableStep > 0 ? this.tableStep : 1;
  }

  // --- Analysis ---

  analyzeFunctions() {
    this.analysisData = [];
    this.functions.forEach(f => {
      if (f.visible && f.latex.trim() !== '') {
        try {
          const cleaned = f.latex.replace(/y\s*=/g, '').replace(/f\(x\)\s*=/g, '').trim();
          const node = math.parse(cleaned);
          const df = math.derivative(node, 'x');
          const roots: number[] = [];

          // Search roots from -10 to 10
          for (let i = -10; i <= 10; i++) {
            const root = this.newtonRaphson(node, df, i);
            if (root !== null) {
              const fixedValue = parseFloat(root.toFixed(4));
              if (!roots.includes(fixedValue)) roots.push(fixedValue);
            }
          }
          this.analysisData.push({ funcId: f.id, color: f.color, roots: roots.sort((a, b) => a - b) });
        } catch (e) {
          console.error("Error analyzing function", f.id, e);
        }
      }
    });
  }

  private newtonRaphson(f: math.MathNode, df: math.MathNode, guess: number): number | null {
    let x = guess;
    const iters = 20;
    const eps = 1e-5;
    for (let i = 0; i < iters; i++) {
      try {
        const y = f.evaluate({ x: x });
        const dy = df.evaluate({ x: x });
        if (Math.abs(dy) < 1e-10) break;
        const xNext = x - y / dy;
        if (Math.abs(xNext - x) < eps) return xNext;
        x = xNext;
      } catch (e) {
        break;
      }
    }
    return null;
  }
}
