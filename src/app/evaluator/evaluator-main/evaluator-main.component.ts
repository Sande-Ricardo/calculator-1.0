import { Component, OnInit, ViewChild } from '@angular/core';
import * as math from 'mathjs';
import { ExpressionInputComponent, ParseEvent } from '../components/expression-input/expression-input.component';
import { EvaluationResult, HistoryEntry } from '../models/evaluator.model';
import { EvaluatorHistoryService } from '../services/evaluator-history.service';
import { HistoryPanelComponent } from '../components/history-panel/history-panel.component';

@Component({
  selector: 'app-evaluator-main',
  templateUrl: './evaluator-main.component.html',
  styleUrls: ['./evaluator-main.component.scss']
})
export class EvaluatorMainComponent implements OnInit {
  @ViewChild(ExpressionInputComponent) expressionInputComp!: ExpressionInputComponent;
  @ViewChild(HistoryPanelComponent) historyPanelComp!: HistoryPanelComponent;

  currentExpression: string = '';
  parsedNode: math.MathNode | null = null;
  detectedVariables: string[] = [];
  decimalPrecision: number = 4;
  angleUnit: 'rad' | 'deg' = 'rad';
  lastEvaluation: EvaluationResult | null = null;
  lastScope: Record<string, number> = {};

  constructor(private historyService: EvaluatorHistoryService) { }

  ngOnInit(): void {
  }

  onExpressionParsed(event: ParseEvent): void {
    this.currentExpression = event.expression;
    this.parsedNode = event.node;
    this.detectedVariables = event.variables;
    this.decimalPrecision = event.precision;
    this.angleUnit = event.angleUnit;
  }

  onEvaluated(event: { result: EvaluationResult; scope: Record<string, number> }): void {
    this.lastEvaluation = event.result;
    this.lastScope = event.scope;

    if (event.result.success && event.result.value !== undefined && !isNaN(event.result.value) && this.currentExpression) {
      this.historyService.addEntry(this.currentExpression, event.scope, event.result.value);
      if (this.historyPanelComp) {
        this.historyPanelComp.refreshHistory();
      }
    }
  }

  onHistorySelect(entry: HistoryEntry): void {
    if (this.expressionInputComp) {
      this.expressionInputComp.setPresetExpression(entry.expression);
    }
  }
}
