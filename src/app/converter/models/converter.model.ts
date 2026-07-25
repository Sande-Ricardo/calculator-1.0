export interface UnitDefinition {
  symbol: string;
  name: string;
  factor: number;
  offset: number;
}

export interface MagnitudeDefinition {
  name: string;
  category: string;
  base: string;
  dimensionalFormula: string; // e.g., "[M · L^-1 · T^-2]"
  units: { [symbol: string]: UnitDefinition };
}

export interface PhysicalConstant {
  name: string;
  symbol: string;
  value: number;
  unit: string;
  category: 'Physics' | 'Thermodynamics' | 'Chemistry' | 'Electromagnetism';
}

export interface SmartSearchResult {
  magnitudeKey: string;
  sourceUnitKey: string;
  targetUnitKey: string;
  value: number;
}

export interface FavoriteConversion {
  id: string;
  magnitudeKey: string;
  sourceUnitKey: string;
  targetUnitKey: string;
}
