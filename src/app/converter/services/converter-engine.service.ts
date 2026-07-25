import { Injectable } from '@angular/core';
import { ConverterDataService } from './converter-data.service';
import { SmartSearchResult, UnitDefinition } from '../models/converter.model';

@Injectable({
  providedIn: 'root'
})
export class ConverterEngineService {

  constructor(private dataService: ConverterDataService) {}

  /**
   * Converts a value from source unit to target unit using the Pivot Unit Pattern.
   */
  convert(value: number, magnitudeKey: string, sourceUnitKey: string, targetUnitKey: string): number {
    if (isNaN(value)) return 0;
    
    const magnitude = this.dataService.MAGNITUDES[magnitudeKey];
    if (!magnitude) return value;

    const sourceUnit = magnitude.units[sourceUnitKey];
    const targetUnit = magnitude.units[targetUnitKey];

    if (!sourceUnit || !targetUnit) return value;

    // 1. Convert Source to Base Unit
    const baseValue = (value * sourceUnit.factor) + sourceUnit.offset;

    // 2. Convert Base Unit to Target Unit
    const targetValue = (baseValue - targetUnit.offset) / targetUnit.factor;

    return targetValue;
  }

  /**
   * Evaluates string numeric inputs including scientific notation (1.5e-3) and fractions (1/3).
   */
  parseNumericInput(input: string): number {
    if (!input || typeof input !== 'string') return 0;

    const cleanInput = input.trim();
    if (!cleanInput) return 0;

    // Check if simple fraction (e.g. 1/3, 5/2)
    if (/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(cleanInput)) {
      const parts = cleanInput.split('/');
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      return den !== 0 ? num / den : 0;
    }

    const val = Number(cleanInput);
    return isNaN(val) ? 0 : val;
  }

  /**
   * Formats a calculated number based on specified decimal precision or scientific notation.
   */
  formatValue(value: number, decimals: number = 4): string {
    if (isNaN(value)) return '0';
    if (value === 0) return '0';

    // Use scientific notation for extremely small or large numbers
    const absVal = Math.abs(value);
    if (absVal < 1e-6 || absVal >= 1e9) {
      return value.toExponential(decimals);
    }

    // Round to specified decimal places
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(value * factor) / factor;
    return rounded.toString();
  }

  /**
   * Universal Smart Search parser (Natural language input e.g. "15 psi to kpa", "100 C in F", "5 km -> m")
   */
  parseSmartSearch(query: string): SmartSearchResult | null {
    if (!query || !query.trim()) return null;

    const cleanQuery = query.trim().toLowerCase();

    // Regex pattern matching: [number] [unit1] (to|in|a|->) [unit2]
    // Example: "15 psi to kpa", "100 °c in °f", "5.5 km -> m"
    const regex = /^([\d\.\/e\-\+]+)\s*([^\s\d]+(?:\s*[^\s\d]+)?)\s*(?:to|in|a|->|=|para)\s*([^\s\d]+(?:\s*[^\s\d]+)?)$/i;
    const match = cleanQuery.match(regex);

    if (!match) return null;

    const rawNum = match[1];
    const rawUnit1 = match[2].trim();
    const rawUnit2 = match[3].trim();

    const val = this.parseNumericInput(rawNum);

    // Search across all magnitudes for unit keys/symbols
    for (const [magKey, magDef] of Object.entries(this.dataService.MAGNITUDES)) {
      const unitKeys = Object.keys(magDef.units);

      const foundSource = unitKeys.find(u => 
        u.toLowerCase() === rawUnit1 || 
        magDef.units[u].symbol.toLowerCase() === rawUnit1 ||
        magDef.units[u].name.toLowerCase() === rawUnit1
      );

      const foundTarget = unitKeys.find(u => 
        u.toLowerCase() === rawUnit2 || 
        magDef.units[u].symbol.toLowerCase() === rawUnit2 ||
        magDef.units[u].name.toLowerCase() === rawUnit2
      );

      if (foundSource && foundTarget) {
        return {
          magnitudeKey: magKey,
          sourceUnitKey: foundSource,
          targetUnitKey: foundTarget,
          value: val
        };
      }
    }

    return null;
  }
}
