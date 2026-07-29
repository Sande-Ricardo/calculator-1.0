import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import * as math from 'mathjs';
import { EvaluatorEngineService } from '../../services/evaluator-engine.service';

export interface ParseEvent {
  expression: string;
  node: math.MathNode | null;
  latex: string;
  variables: string[];
  precision: number;
  angleUnit: 'rad' | 'deg';
  error?: string;
  errorPosition?: number;
}

@Component({
  selector: 'app-expression-input',
  templateUrl: './expression-input.component.html',
  styleUrls: ['./expression-input.component.scss']
})
export class ExpressionInputComponent implements OnInit, OnDestroy {
  @Output() parsed = new EventEmitter<ParseEvent>();

  expressionControl = new FormControl('3 * sin(x) + log(y) / 2');
  decimalPrecision: number = 4;
  angleUnit: 'rad' | 'deg' = 'rad';

  latexOutput: string = '';
  errorMessage: string | null = null;
  errorPosition: number | null = null;
  detectedVariables: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(private engineService: EvaluatorEngineService) {}

  ngOnInit(): void {
    // Initial evaluation
    this.processExpression(this.expressionControl.value || '');

    // React to input changes with debounce
    this.expressionControl.valueChanges
      .pipe(
        debounceTime(150),
        takeUntil(this.destroy$)
      )
      .subscribe((val) => {
        this.processExpression(val || '');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  processExpression(expr: string): void {
    const parseResult = this.engineService.parseExpression(expr);

    if (parseResult.error) {
      this.errorMessage = parseResult.error;
      this.errorPosition = parseResult.errorPosition ?? null;
      this.latexOutput = '';
      this.detectedVariables = [];

      this.parsed.emit({
        expression: expr,
        node: null,
        latex: '',
        variables: [],
        precision: this.decimalPrecision,
        angleUnit: this.angleUnit,
        error: parseResult.error,
        errorPosition: parseResult.errorPosition
      });
    } else {
      this.errorMessage = null;
      this.errorPosition = null;
      this.latexOutput = parseResult.latex ? `$$${parseResult.latex}$$` : '';
      this.detectedVariables = parseResult.variables;

      this.parsed.emit({
        expression: expr,
        node: parseResult.node,
        latex: parseResult.latex,
        variables: parseResult.variables,
        precision: this.decimalPrecision,
        angleUnit: this.angleUnit
      });
    }
  }

  onPrecisionChange(): void {
    this.processExpression(this.expressionControl.value || '');
  }

  onAngleUnitToggle(unit: 'rad' | 'deg'): void {
    this.angleUnit = unit;
    this.processExpression(this.expressionControl.value || '');
  }

  setPresetExpression(expr: string): void {
    this.expressionControl.setValue(expr);
  }
}
