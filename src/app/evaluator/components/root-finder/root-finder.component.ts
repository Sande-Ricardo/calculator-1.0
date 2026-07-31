import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EvaluatorEngineService } from '../../services/evaluator-engine.service';
import { RootFindingResult } from '../../models/evaluator.model';

@Component({
  selector: 'app-root-finder',
  templateUrl: './root-finder.component.html',
  styleUrls: ['./root-finder.component.scss']
})
export class RootFinderComponent implements OnChanges {
  @Input() expression: string = '';
  @Input() variables: string[] = [];

  targetVariable: string = 'x';
  searchMode: 'interval' | 'single' = 'interval';
  rangeMin: number = -10;
  rangeMax: number = 10;
  initialGuess: number = 1.0;

  result: RootFindingResult | null = null;
  isSolving: boolean = false;

  constructor(private engineService: EvaluatorEngineService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.variables && this.variables.length > 0) {
      if (!this.variables.includes(this.targetVariable)) {
        this.targetVariable = this.variables.includes('x') ? 'x' : this.variables[0];
      }
    }
    this.result = null;
  }

  setSearchMode(mode: 'interval' | 'single'): void {
    if (this.searchMode !== mode) {
      this.searchMode = mode;
      this.result = null;
    }
  }

  solveRoot(): void {
    if (!this.expression || !this.targetVariable) return;

    this.isSolving = true;
    this.result = null;

    setTimeout(() => {
      this.result = this.engineService.findRoots(
        this.expression,
        this.targetVariable,
        this.searchMode,
        [this.rangeMin, this.rangeMax],
        this.initialGuess
      );
      this.isSolving = false;
    }, 80);
  }
}
