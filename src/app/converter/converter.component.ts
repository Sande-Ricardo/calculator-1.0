import { Component, OnInit } from '@angular/core';
import { ConverterDataService } from './services/converter-data.service';
import { ConverterEngineService } from './services/converter-engine.service';
import { ConverterFavoritesService } from './services/converter-favorites.service';

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss']
})
export class ConverterComponent implements OnInit {

  searchQuery: string = '';
  selectedCategory: string = 'Mechanics & Fluids';
  selectedMagnitudeKey: string = 'pressure';

  // Precision controls
  decimalPrecision: number = 4;
  
  // Sidebar visibility state
  isSidebarOpen: boolean = true;
  activeSidebarTab: 'dimensional' | 'constants' | 'prefixes' | 'favorites' = 'dimensional';

  // Current values
  sourceValue: number = 1;
  sourceUnitKey: string = 'psi';
  targetUnitKey: string = 'kPa';
  targetValue: number = 0;

  categories: string[] = [];

  constructor(
    public dataService: ConverterDataService,
    public engineService: ConverterEngineService,
    public favoritesService: ConverterFavoritesService
  ) {}

  ngOnInit(): void {
    this.categories = this.dataService.getCategories();
    this.recalculate();
  }

  onCategoryChange(cat: string): void {
    this.selectedCategory = cat;
    const magList = this.dataService.getMagnitudesByCategory(cat);
    if (magList.length > 0) {
      this.selectMagnitude(magList[0].key);
    }
  }

  selectMagnitude(magKey: string): void {
    this.selectedMagnitudeKey = magKey;
    const magDef = this.dataService.MAGNITUDES[magKey];
    if (magDef) {
      this.selectedCategory = magDef.category;
      const unitKeys = Object.keys(magDef.units);
      this.sourceUnitKey = unitKeys[0] || '';
      this.targetUnitKey = unitKeys[1] || unitKeys[0] || '';
      this.recalculate();
    }
  }

  recalculate(): void {
    this.targetValue = this.engineService.convert(
      this.sourceValue,
      this.selectedMagnitudeKey,
      this.sourceUnitKey,
      this.targetUnitKey
    );
  }

  onSourceValueChange(val: number): void {
    this.sourceValue = val;
    this.recalculate();
  }

  onSourceUnitChange(unitKey: string): void {
    this.sourceUnitKey = unitKey;
    this.recalculate();
  }

  onTargetUnitChange(unitKey: string): void {
    this.targetUnitKey = unitKey;
    this.recalculate();
  }

  swapUnits(): void {
    const tempUnit = this.sourceUnitKey;
    this.sourceUnitKey = this.targetUnitKey;
    this.targetUnitKey = tempUnit;
    this.recalculate();
  }

  onSmartSearch(): void {
    if (!this.searchQuery.trim()) return;

    const result = this.engineService.parseSmartSearch(this.searchQuery);
    if (result) {
      this.selectedMagnitudeKey = result.magnitudeKey;
      const magDef = this.dataService.MAGNITUDES[result.magnitudeKey];
      if (magDef) {
        this.selectedCategory = magDef.category;
      }
      this.sourceUnitKey = result.sourceUnitKey;
      this.targetUnitKey = result.targetUnitKey;
      this.sourceValue = result.value;
      this.recalculate();
    }
  }

  toggleFavorite(): void {
    if (this.isCurrentFavorite()) {
      const id = `${this.selectedMagnitudeKey}_${this.sourceUnitKey}_to_${this.targetUnitKey}`;
      this.favoritesService.removeFavorite(id);
    } else {
      this.favoritesService.addFavorite(this.selectedMagnitudeKey, this.sourceUnitKey, this.targetUnitKey);
    }
  }

  isCurrentFavorite(): boolean {
    return this.favoritesService.isFavorite(this.selectedMagnitudeKey, this.sourceUnitKey, this.targetUnitKey);
  }

  applyFavorite(fav: { magnitudeKey: string, sourceUnitKey: string, targetUnitKey: string }): void {
    this.selectMagnitude(fav.magnitudeKey);
    this.sourceUnitKey = fav.sourceUnitKey;
    this.targetUnitKey = fav.targetUnitKey;
    this.recalculate();
  }

  injectConstant(value: number): void {
    this.sourceValue = value;
    this.recalculate();
  }
}
