import { Injectable } from '@angular/core';
import { HistoryEntry } from '../models/evaluator.model';

@Injectable({
  providedIn: 'root'
})
export class EvaluatorHistoryService {
  private readonly STORAGE_KEY = 'calculato_evaluator_history';
  private readonly MAX_ENTRIES = 10;

  constructor() {}

  getHistory(): HistoryEntry[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  addEntry(expression: string, variables: Record<string, number>, result: number): void {
    if (!expression || isNaN(result)) return;

    const history = this.getHistory();
    
    // Avoid duplicate adjacent entries
    if (history.length > 0 && history[0].expression === expression && JSON.stringify(history[0].variables) === JSON.stringify(variables)) {
      return;
    }

    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      expression,
      variables: { ...variables },
      result,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    const updated = [newEntry, ...history.filter(h => h.expression !== expression)].slice(0, this.MAX_ENTRIES);

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage full or unavailable
    }
  }

  clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {}
  }
}
