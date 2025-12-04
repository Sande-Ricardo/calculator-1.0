import { Component, Input, OnInit } from '@angular/core';
import { StepNodeNormalized } from 'src/app/interfaces/Integration';
import { RULE_LABELS } from 'src/app/shared/constants/rule-labels';
import { latexIntegral, latexKeyValue } from 'src/app/shared/utils/latex-helpers';

@Component({
  selector: 'app-step-view',
  templateUrl: './step-view.component.html',
  styleUrls: ['./step-view.component.scss']
})
export class StepViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() step!: StepNodeNormalized;

  get title(): string {
    return RULE_LABELS[this.step.rule]?.title ?? this.step.rule;
  }

  get hint(): string | undefined {
    return RULE_LABELS[this.step.rule]?.hint;
  }

  integralLatex(): string {
    return latexIntegral(this.step.integrandLatex, this.step.variable);
  }

  paramEntries(): { key: string; value: string }[] {
    return Object.entries(this.step.params).map(([key, val]) => ({ key, value: val }));
  }

  asKeyValueLatex(k: string, v: string): string {
    return latexKeyValue(k, v);
  }

  trackByIndex = (_: number, __: unknown) => _;
}
