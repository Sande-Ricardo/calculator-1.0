import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { EvaluatorHistoryService } from '../../services/evaluator-history.service';
import { HistoryEntry } from '../../models/evaluator.model';

@Component({
  selector: 'app-history-panel',
  templateUrl: './history-panel.component.html',
  styleUrls: ['./history-panel.component.scss']
})
export class HistoryPanelComponent implements OnInit {
  @Output() selectEntry = new EventEmitter<HistoryEntry>();

  history: HistoryEntry[] = [];

  constructor(private historyService: EvaluatorHistoryService) {}

  ngOnInit(): void {
    this.refreshHistory();
  }

  refreshHistory(): void {
    this.history = this.historyService.getHistory();
  }

  onSelect(entry: HistoryEntry): void {
    this.selectEntry.emit(entry);
  }

  onClear(): void {
    this.historyService.clearHistory();
    this.refreshHistory();
  }

  getVariableScopeString(vars: Record<string, number>): string {
    const keys = Object.keys(vars);
    if (keys.length === 0) return 'No variables';
    return keys.map(k => `${k}=${vars[k]}`).join(', ');
  }
}
