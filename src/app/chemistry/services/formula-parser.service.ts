import { Injectable } from '@angular/core';
import { PeriodicTableService } from './periodic-table.service';

export interface ParsedElement {
  symbol: string;
  name: string;
  count: number;
  atomicMass: number;
  totalMass: number;
  massPercentage: number;
}

export interface ParseResult {
  elements: ParsedElement[];
  totalMolarMass: number;
  isValid: boolean;
  error?: string;
  formattedFormula?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FormulaParserService {

  constructor(private periodicTable: PeriodicTableService) { }

  /**
   * Main entry point to parse a formula and calculate composition.
   */
  parseFormula(formula: string, useIsotopes: boolean = false): ParseResult {
    try {
      const elementCounts = this.tokenizeAndCount(formula, useIsotopes);
      return this.calculateComposition(elementCounts, formula);
    } catch (e: any) {
      return {
        elements: [],
        totalMolarMass: 0,
        isValid: false,
        error: e.message
      };
    }
  }

  /**
   * Stack-based Lexical Scanner
   */
  private tokenizeAndCount(formula: string, useIsotopes: boolean): Map<string, number> {
    formula = formula.trim().replace(/\s+/g, '');
    if (!formula) throw new Error("Empty formula");

    const stack: Map<string, number>[] = [new Map()];
    let i = 0;
    
    // For hydrates, we'll recursively parse the hydrate part and add it to our main map
    const hydrateMatch = formula.match(/[\.\*]([0-9]*)(.+)/);
    if (hydrateMatch) {
      const multiplierStr = hydrateMatch[1];
      const hydrateFormula = hydrateMatch[2];
      const multiplier = multiplierStr ? parseInt(multiplierStr, 10) : 1;
      
      const baseFormula = formula.substring(0, hydrateMatch.index);
      
      const baseCounts = this.tokenizeAndCount(baseFormula, useIsotopes);
      const hydrateCounts = this.tokenizeAndCount(hydrateFormula, useIsotopes);
      
      // Merge hydrate into base
      hydrateCounts.forEach((count, symbol) => {
        baseCounts.set(symbol, (baseCounts.get(symbol) || 0) + (count * multiplier));
      });
      return baseCounts;
    }

    while (i < formula.length) {
      const char = formula[i];

      if (char === '(' || char === '[') {
        stack.push(new Map());
        i++;
      } else if (char === ')' || char === ']') {
        if (stack.length <= 1) {
          throw new Error(`Unmatched closing parenthesis at position ${i}`);
        }
        const currentContext = stack.pop()!;
        i++;
        
        let numStr = '';
        while (i < formula.length && /[0-9]/.test(formula[i])) {
          numStr += formula[i];
          i++;
        }
        const multiplier = numStr ? parseInt(numStr, 10) : 1;

        const previousContext = stack[stack.length - 1];
        currentContext.forEach((count, symbol) => {
          previousContext.set(symbol, (previousContext.get(symbol) || 0) + (count * multiplier));
        });
      } else if (/[A-Z]/.test(char) || (useIsotopes && (char === 'D' || char === 'T'))) {
        let symbol = char;
        i++;
        while (i < formula.length && /[a-z]/.test(formula[i])) {
          symbol += formula[i];
          i++;
        }
        
        // Custom logic for explicit isotopes like C13 or U235
        if (useIsotopes) {
           let isoNum = '';
           let tempI = i;
           while (tempI < formula.length && /[0-9]/.test(formula[tempI])) {
             isoNum += formula[tempI];
             tempI++;
           }
           if (isoNum && this.periodicTable.isValidSymbol(symbol + isoNum)) {
             symbol += isoNum;
             i = tempI;
           }
        }

        if (!this.periodicTable.isValidSymbol(symbol)) {
          throw new Error(`Invalid element symbol: ${symbol}`);
        }

        let numStr = '';
        while (i < formula.length && /[0-9]/.test(formula[i])) {
          numStr += formula[i];
          i++;
        }
        const multiplier = numStr ? parseInt(numStr, 10) : 1;

        const currentContext = stack[stack.length - 1];
        currentContext.set(symbol, (currentContext.get(symbol) || 0) + multiplier);
      } else {
         throw new Error(`Unexpected character '${char}' at position ${i}`);
      }
    }

    if (stack.length > 1) {
      throw new Error("Unmatched opening parenthesis");
    }

    return stack[0];
  }

  private calculateComposition(elementCounts: Map<string, number>, rawFormula: string): ParseResult {
    let totalMolarMass = 0;
    const elements: ParsedElement[] = [];

    elementCounts.forEach((count, symbol) => {
      const data = this.periodicTable.getElement(symbol)!;
      const totalMass = data.atomicMass * count;
      totalMolarMass += totalMass;

      elements.push({
        symbol: data.symbol,
        name: data.name,
        count: count,
        atomicMass: data.atomicMass,
        totalMass: totalMass,
        massPercentage: 0 // Will calculate in next pass
      });
    });

    elements.forEach(el => {
      el.massPercentage = (el.totalMass / totalMolarMass) * 100;
    });

    // Formatting formula WYSIWYG
    const formattedFormula = this.formatFormulaHtml(rawFormula);

    return {
      elements: elements.sort((a, b) => b.massPercentage - a.massPercentage),
      totalMolarMass: totalMolarMass,
      isValid: true,
      formattedFormula
    };
  }
  
  public formatFormulaHtml(formula: string): string {
    // Basic WYSIWYG formatter for preview (adds <sub> for numbers)
    return formula.replace(/([A-Za-z\)\]])([0-9]+)/g, '$1<sub>$2</sub>')
                  .replace(/[\.\*]/g, ' &middot; ');
  }
}
