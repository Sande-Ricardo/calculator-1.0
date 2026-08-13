import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MagnitudeDefinition } from '../../models/converter.model';
import { ConverterEngineService } from '../../services/converter-engine.service';

@Component({
  selector: 'app-converter-panels',
  templateUrl: './converter-panels.component.html',
  styleUrls: ['./converter-panels.component.scss']
})
export class ConverterPanelsComponent implements OnChanges {
  @Input() magnitude!: MagnitudeDefinition;
  @Input() magnitudeKey: string = '';
  @Input() sourceValue: number = 1;
  @Input() sourceUnitKey: string = '';
  @Input() targetUnitKey: string = '';
  @Input() targetValue: number = 0;
  @Input() decimalPrecision: number = 4;
  @Input() isFavorite: boolean = false;

  @Output() sourceValueChange = new EventEmitter<number>();
  @Output() sourceUnitChange = new EventEmitter<string>();
  @Output() targetUnitChange = new EventEmitter<string>();
  @Output() swap = new EventEmitter<void>();
  @Output() favoriteToggle = new EventEmitter<void>();

  // Text representation for fraction/expression typing
  sourceInputText: string = '1';
  sourceUnitSearch: string = '';
  targetUnitSearch: string = '';

  copiedTarget: boolean = false;

  constructor(private engineService: ConverterEngineService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sourceValue'] && !changes['sourceValue'].firstChange) {
      this.sourceInputText = this.sourceValue.toString();
    }
  }

  onSourceInput(text: string): void {
    this.sourceInputText = text;
    const parsed = this.engineService.parseNumericInput(text);
    this.sourceValueChange.emit(parsed);
  }

  onSourceSelect(unitKey: string): void {
    this.sourceUnitChange.emit(unitKey);
  }

  onTargetSelect(unitKey: string): void {
    this.targetUnitChange.emit(unitKey);
  }

  onSwap(): void {
    this.swap.emit();
  }

  onFavoriteClick(): void {
    this.favoriteToggle.emit();
  }

  copyTargetResult(): void {
    const formatted = this.getFormattedTargetValue();
    navigator.clipboard.writeText(formatted).then(() => {
      this.copiedTarget = true;
      setTimeout(() => this.copiedTarget = false, 2000);
    });
  }

  getFormattedTargetValue(): string {
    return this.engineService.formatValue(this.targetValue, this.decimalPrecision);
  }

  getTargetSymbol(): string {
    return this.magnitude?.units[this.targetUnitKey] ? this.magnitude.units[this.targetUnitKey].symbol : '';
  }

  getFilteredUnits(search: string): { key: string, symbol: string, name: string }[] {
    if (!this.magnitude || !this.magnitude.units) return [];
    const entries = Object.entries(this.magnitude.units).map(([key, u]) => ({
      key,
      symbol: u.symbol,
      name: u.name
    }));

    if (!search || !search.trim()) return entries;
    const s = search.toLowerCase();
    return entries.filter(e => e.symbol.toLowerCase().includes(s) || e.name.toLowerCase().includes(s));
  }
}
