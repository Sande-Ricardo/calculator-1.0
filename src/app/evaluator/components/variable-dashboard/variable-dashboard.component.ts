import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as math from 'mathjs';
import { EvaluatorEngineService } from '../../services/evaluator-engine.service';
import { EvaluationResult } from '../../models/evaluator.model';

export interface VariableControl {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

@Component({
  selector: 'app-variable-dashboard',
  templateUrl: './variable-dashboard.component.html',
  styleUrls: ['./variable-dashboard.component.scss']
})
export class VariableDashboardComponent implements OnChanges {
  @Input() set variablesList(vars: string[]) {
    this.updateVariablesList(vars || []);
  }
  @Input() parsedNode: math.MathNode | null = null;
  @Input() precision: number = 4;
  @Input() angleUnit: 'rad' | 'deg' = 'rad';
  @Input() currentExpression: string = '';

  @Output() evaluated = new EventEmitter<{ result: EvaluationResult; scope: Record<string, number> }>();

  variableControls: VariableControl[] = [];
  evaluationResult: EvaluationResult | null = null;

  constructor(private engineService: EvaluatorEngineService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parsedNode'] || changes['precision'] || changes['angleUnit']) {
      this.reevaluate();
    }
  }

  private updateVariablesList(newVars: string[]): void {
    const existingMap = new Map<string, VariableControl>();
    this.variableControls.forEach(ctrl => existingMap.set(ctrl.name, ctrl));

    this.variableControls = newVars.map(varName => {
      if (existingMap.has(varName)) {
        return existingMap.get(varName)!;
      }
      return {
        name: varName,
        value: 1,
        min: -10,
        max: 10,
        step: 0.1
      };
    });

    this.reevaluate();
  }

  onVariableValueChange(ctrl: VariableControl, val: number): void {
    ctrl.value = Number(val) || 0;
    this.reevaluate();
  }

  onSliderInput(ctrl: VariableControl, event: Event): void {
    const target = event.target as HTMLInputElement;
    ctrl.value = parseFloat(target.value);
    this.reevaluate();
  }

  resetVariable(ctrl: VariableControl): void {
    ctrl.value = 1;
    ctrl.min = -10;
    ctrl.max = 10;
    ctrl.step = 0.1;
    this.reevaluate();
  }

  getScope(): Record<string, number> {
    const scope: Record<string, number> = {};
    this.variableControls.forEach(ctrl => {
      scope[ctrl.name] = ctrl.value;
    });
    return scope;
  }

  reevaluate(): void {
    if (!this.parsedNode) {
      this.evaluationResult = null;
      return;
    }

    const scope = this.getScope();
    const result = this.engineService.evaluateAST(this.parsedNode, scope, this.angleUnit);

    if (result.success && result.value !== undefined && !isNaN(result.value)) {
      result.formattedResult = Number(result.value.toFixed(this.precision)).toString();
    }

    this.evaluationResult = result;
    this.evaluated.emit({ result, scope });
  }
}
