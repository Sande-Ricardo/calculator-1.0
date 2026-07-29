import { Injectable } from '@angular/core';
import * as math from 'mathjs';
import { EvaluationResult, PlotPoint, RootFindingResult } from '../models/evaluator.model';

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
   * Solves f(varName) = 0 using Newton-Raphson method.
   */
  findRootNewtonRaphson(
    expression: string,
    variable: string,
    initialGuess: number = 1.0,
    maxIterations: number = 25,
    tolerance: number = 1e-7
  ): RootFindingResult {
    try {
      const parsedNode = math.parse(expression);
      const derivativeNode = math.derivative(parsedNode, variable);

      const fCompiled = parsedNode.compile();
      const dfCompiled = derivativeNode.compile();

      let x = initialGuess;
      for (let i = 0; i < maxIterations; i++) {
        const y = Number(fCompiled.evaluate({ [variable]: x }));
        const dy = Number(dfCompiled.evaluate({ [variable]: x }));

        if (Math.abs(dy) < 1e-12) {
          return {
            root: null,
            iterations: i,
            converged: false,
            message: `Derivative near zero at x = ${x}. Convergence failed.`
          };
        }

        const xNext = x - y / dy;

        if (Math.abs(xNext - x) < tolerance) {
          return {
            root: Number(xNext.toFixed(6)),
            iterations: i + 1,
            converged: true,
            message: `Converged successfully in ${i + 1} iterations.`
          };
        }

        x = xNext;
      }

      return {
        root: Number(x.toFixed(6)),
        iterations: maxIterations,
        converged: false,
        message: `Maximum iterations (${maxIterations}) reached without full convergence.`
      };
    } catch (err: any) {
      return {
        root: null,
        iterations: 0,
        converged: false,
        message: err.message || 'Error during Newton-Raphson root finding.'
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
