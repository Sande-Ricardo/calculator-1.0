import { Injectable } from '@angular/core';
import * as math from 'mathjs';
import { EvaluationResult, FoundRoot, PlotPoint, RootFindingResult } from '../models/evaluator.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluatorEngineService {

  private readonly BUILTIN_CONSTANTS = new Set([
    'e', 'pi', 'i', 'phi', 'tau', 'LN2', 'LN10', 'LOG2E', 'LOG10E', 'SQRT1_2', 'SQRT2', 'Infinity', 'NaN', 'true', 'false'
  ]);

  constructor() {}

  /**
   * Parses expression into MathNode, extracts LaTeX representation and variables.
   */
  parseExpression(expression: string): { node: math.MathNode | null; latex: string; variables: string[]; error?: string; errorPosition?: number } {
    if (!expression || !expression.trim()) {
      return { node: null, latex: '', variables: [] };
    }

    try {
      const node = math.parse(expression);
      const latex = node.toTex({ parenthesis: 'keep' });
      const variables = this.extractVariables(node);
      return { node, latex, variables };
    } catch (err: any) {
      let position: number | undefined;
      if (err && typeof err.char === 'number') {
        position = err.char;
      }
      return {
        node: null,
        latex: '',
        variables: [],
        error: err.message || 'Syntax error in mathematical expression.',
        errorPosition: position
      };
    }
  }

  /**
   * Extracts free variables from an AST node.
   */
  extractVariables(node: math.MathNode): string[] {
    const variablesSet = new Set<string>();

    node.traverse((childNode: math.MathNode, path: string, parent: math.MathNode | null) => {
      if (childNode.type === 'SymbolNode') {
        const symbolNode = childNode as math.SymbolNode;
        const name = symbolNode.name;

        // Check if parent is a FunctionNode and this symbol is the function name (e.g. sin(x) -> 'sin' is function name)
        const isFunctionName = parent && parent.type === 'FunctionNode' && (parent as math.FunctionNode).fn.name === name;

        if (!isFunctionName && !this.BUILTIN_CONSTANTS.has(name) && !(name in math)) {
          variablesSet.add(name);
        }
      }
    });

    return Array.from(variablesSet).sort();
  }

  /**
   * Safely evaluates a parsed MathNode given a variable scope.
   */
  evaluateAST(node: math.MathNode, scope: Record<string, number>, angleUnit: 'rad' | 'deg' = 'rad'): EvaluationResult {
    try {
      // Clone scope to avoid mutating original
      const evalScope: Record<string, any> = { ...scope };

      // Handle degree mode if specified
      let compiled = node.compile();
      let rawVal = compiled.evaluate(evalScope);

      if (typeof rawVal === 'function') {
        return { success: false, error: 'Expression evaluates to a function, not a scalar value.' };
      }

      if (typeof rawVal === 'object' && rawVal !== null && 'entries' in rawVal) {
        rawVal = rawVal.toArray();
      }

      const numVal = Number(rawVal);
      if (isNaN(numVal)) {
        return {
          success: true,
          value: NaN,
          formattedResult: 'NaN',
          latex: '\\text{NaN}'
        };
      }

      return {
        success: true,
        value: numVal,
        formattedResult: this.formatNumber(numVal),
        latex: node.toTex()
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Evaluation error.'
      };
    }
  }

  /**
   * Solves f(variable) = 0 for single or multi-root discovery using a hybrid sampling & Newton-Raphson approach.
   */
  findRoots(
    expression: string,
    variable: string,
    mode: 'interval' | 'single' = 'interval',
    range: [number, number] = [-10, 10],
    initialGuess: number = 1.0,
    fixedScope: Record<string, number> = {},
    tolerance: number = 1e-7,
    residualTolerance: number = 1e-5
  ): RootFindingResult {
    try {
      const parsedNode = math.parse(expression);
      let derivativeNode: math.MathNode | null = null;
      try {
        derivativeNode = math.derivative(parsedNode, variable);
      } catch {
        // Symbolic derivative not supported for all expressions
      }

      const fCompiled = parsedNode.compile();
      const dfCompiled = derivativeNode ? derivativeNode.compile() : null;

      const evalF = (val: number): number => {
        try {
          const res = Number(fCompiled.evaluate({ ...fixedScope, [variable]: val }));
          return isNaN(res) ? NaN : res;
        } catch {
          return NaN;
        }
      };

      const evalDF = (val: number): number => {
        if (dfCompiled) {
          try {
            const res = Number(dfCompiled.evaluate({ ...fixedScope, [variable]: val }));
            if (!isNaN(res) && isFinite(res)) return res;
          } catch {}
        }
        // Central finite difference numerical approximation
        const h = 1e-6;
        const yPlus = evalF(val + h);
        const yMinus = evalF(val - h);
        return (yPlus - yMinus) / (2 * h);
      };

      const tryRefineRoot = (seed: number, maxIter: number = 30): FoundRoot | null => {
        let x = seed;
        for (let i = 0; i < maxIter; i++) {
          const y = evalF(x);
          if (isNaN(y) || !isFinite(y)) return null;

          if (Math.abs(y) < residualTolerance) {
            return {
              value: Number(x.toFixed(6)),
              residual: Math.abs(y),
              iterations: i + 1
            };
          }

          const dy = evalDF(x);
          if (isNaN(dy) || Math.abs(dy) < 1e-12) return null;

          const xNext = x - y / dy;
          if (isNaN(xNext) || !isFinite(xNext)) return null;

          if (Math.abs(xNext - x) < tolerance) {
            const yNext = evalF(xNext);
            if (!isNaN(yNext) && isFinite(yNext) && Math.abs(yNext) < residualTolerance) {
              return {
                value: Number(xNext.toFixed(6)),
                residual: Math.abs(yNext),
                iterations: i + 1
              };
            }
          }
          x = xNext;
        }

        const yFinal = evalF(x);
        if (!isNaN(yFinal) && isFinite(yFinal) && Math.abs(yFinal) < residualTolerance) {
          return {
            value: Number(x.toFixed(6)),
            residual: Math.abs(yFinal),
            iterations: maxIter
          };
        }
        return null;
      };

      if (mode === 'single') {
        const root = tryRefineRoot(initialGuess, 40);
        if (root) {
          return {
            roots: [root],
            mode: 'single',
            converged: true,
            message: `Root converged at ${variable} = ${root.value} in ${root.iterations} iterations.`,
            targetVariable: variable
          };
        } else {
          return {
            roots: [],
            mode: 'single',
            converged: false,
            message: `No root converged starting from initial guess ${variable}₀ = ${initialGuess}.`,
            targetVariable: variable
          };
        }
      }

      // Interval Mode: Multi-root sampling across [min, max]
      const [start, end] = range[0] < range[1] ? range : [range[1], range[0]];
      const steps = 200;
      const stepSize = (end - start) / steps;
      const seeds: number[] = [];

      let prevX = start;
      let prevY = evalF(prevX);

      for (let i = 1; i <= steps; i++) {
        const currX = start + i * stepSize;
        const currY = evalF(currX);

        if (!isNaN(prevY) && !isNaN(currY) && isFinite(prevY) && isFinite(currY)) {
          // Check for sign change
          if (prevY * currY <= 0) {
            seeds.push((prevX + currX) / 2);
          } else {
            // Check for local minimum near zero
            const midX = (prevX + currX) / 2;
            const midY = evalF(midX);
            if (!isNaN(midY) && Math.abs(midY) < Math.abs(prevY) && Math.abs(midY) < Math.abs(currY) && Math.abs(midY) < 0.5) {
              seeds.push(midX);
            }
          }
        }
        prevX = currX;
        prevY = currY;
      }

      // Refine roots from all discovered seeds
      const candidates: FoundRoot[] = [];
      for (const seed of seeds) {
        const r = tryRefineRoot(seed, 25);
        if (r && r.value >= start - 1e-4 && r.value <= end + 1e-4) {
          const isDuplicate = candidates.some(c => Math.abs(c.value - r.value) < 1e-3);
          if (!isDuplicate) {
            candidates.push(r);
          }
        }
      }

      candidates.sort((a, b) => a.value - b.value);

      if (candidates.length > 0) {
        return {
          roots: candidates,
          searchedRange: [start, end],
          mode: 'interval',
          converged: true,
          message: `Found ${candidates.length} real root(s) in range [${start}, ${end}].`,
          targetVariable: variable
        };
      } else {
        return {
          roots: [],
          searchedRange: [start, end],
          mode: 'interval',
          converged: false,
          message: `No real roots found in range [${start}, ${end}].`,
          targetVariable: variable
        };
      }
    } catch (err: any) {
      return {
        roots: [],
        mode,
        searchedRange: range,
        converged: false,
        message: err.message || 'Error during numerical root finding.',
        targetVariable: variable
      };
    }
  }

  /**
   * Generates plot data points for 1D single-variable functions.
   */
  generatePlotPoints(
    expression: string,
    variable: string,
    fixedScope: Record<string, number> = {},
    domain: [number, number] = [-10, 10],
    steps: number = 100
  ): PlotPoint[] {
    const points: PlotPoint[] = [];
    try {
      const compiled = math.compile(expression);
      const [start, end] = domain;
      const stepSize = (end - start) / steps;

      for (let i = 0; i <= steps; i++) {
        const xVal = start + i * stepSize;
        const currentScope = { ...fixedScope, [variable]: xVal };
        try {
          const yVal = Number(compiled.evaluate(currentScope));
          if (!isNaN(yVal) && isFinite(yVal)) {
            points.push({ x: Number(xVal.toFixed(3)), y: Number(yVal.toFixed(4)) });
          }
        } catch {
          // Skip invalid points
        }
      }
    } catch {
      // Fail gracefully on invalid math
    }

    return points;
  }

  private formatNumber(val: number): string {
    if (Math.abs(val) < 1e-6 && val !== 0) {
      return val.toExponential(6);
    }
    return Number(val.toFixed(8)).toString();
  }
}
