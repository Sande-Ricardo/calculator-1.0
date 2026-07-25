import { Injectable } from '@angular/core';
import { MagnitudeDefinition, PhysicalConstant } from '../models/converter.model';

@Injectable({
  providedIn: 'root'
})
export class ConverterDataService {

  readonly MAGNITUDES: { [key: string]: MagnitudeDefinition } = {
    // 1. Mechanics & Fluids
    force: {
      name: 'Force',
      category: 'Mechanics & Fluids',
      base: 'N',
      dimensionalFormula: '[M · L · T^-2]',
      units: {
        'N': { symbol: 'N', name: 'Newton', factor: 1, offset: 0 },
        'kN': { symbol: 'kN', name: 'Kilonewton', factor: 1000, offset: 0 },
        'dyn': { symbol: 'dyn', name: 'Dyne', factor: 1e-5, offset: 0 },
        'lbf': { symbol: 'lbf', name: 'Pound-force', factor: 4.448222, offset: 0 },
        'kgf': { symbol: 'kgf', name: 'Kilogram-force', factor: 9.80665, offset: 0 }
      }
    },
    pressure: {
      name: 'Pressure & Stress',
      category: 'Mechanics & Fluids',
      base: 'Pa',
      dimensionalFormula: '[M · L^-1 · T^-2]',
      units: {
        'Pa': { symbol: 'Pa', name: 'Pascal', factor: 1, offset: 0 },
        'kPa': { symbol: 'kPa', name: 'Kilopascal', factor: 1000, offset: 0 },
        'MPa': { symbol: 'MPa', name: 'Megapascal', factor: 1e6, offset: 0 },
        'bar': { symbol: 'bar', name: 'Bar', factor: 1e5, offset: 0 },
        'mbar': { symbol: 'mbar', name: 'Millibar', factor: 100, offset: 0 },
        'psi': { symbol: 'psi', name: 'Pounds per sq inch', factor: 6894.757, offset: 0 },
        'atm': { symbol: 'atm', name: 'Standard Atmosphere', factor: 101325, offset: 0 },
        'mmHg': { symbol: 'mmHg', name: 'Millimeter of Mercury', factor: 133.322, offset: 0 },
        'torr': { symbol: 'Torr', name: 'Torr', factor: 133.322, offset: 0 }
      }
    },
    torque: {
      name: 'Torque & Moment',
      category: 'Mechanics & Fluids',
      base: 'N·m',
      dimensionalFormula: '[M · L^2 · T^-2]',
      units: {
        'N·m': { symbol: 'N·m', name: 'Newton-meter', factor: 1, offset: 0 },
        'kN·m': { symbol: 'kN·m', name: 'Kilonewton-meter', factor: 1000, offset: 0 },
        'lb·ft': { symbol: 'lb·ft', name: 'Pound-foot', factor: 1.355818, offset: 0 },
        'lb·in': { symbol: 'lb·in', name: 'Pound-inch', factor: 0.1129848, offset: 0 },
        'kgf·m': { symbol: 'kgf·m', name: 'Kilogram-force meter', factor: 9.80665, offset: 0 }
      }
    },
    dynamic_viscosity: {
      name: 'Dynamic Viscosity',
      category: 'Mechanics & Fluids',
      base: 'Pa·s',
      dimensionalFormula: '[M · L^-1 · T^-1]',
      units: {
        'Pa·s': { symbol: 'Pa·s', name: 'Pascal-second', factor: 1, offset: 0 },
        'P': { symbol: 'P', name: 'Poise', factor: 0.1, offset: 0 },
        'cP': { symbol: 'cP', name: 'Centipoise', factor: 0.001, offset: 0 },
        'lbf·s/ft²': { symbol: 'lbf·s/ft²', name: 'Pound-second per sq ft', factor: 47.88026, offset: 0 }
      }
    },
    flow_rate: {
      name: 'Volumetric Flow Rate',
      category: 'Mechanics & Fluids',
      base: 'm³/s',
      dimensionalFormula: '[L^3 · T^-1]',
      units: {
        'm³/s': { symbol: 'm³/s', name: 'Cubic meter per second', factor: 1, offset: 0 },
        'm³/h': { symbol: 'm³/h', name: 'Cubic meter per hour', factor: 1 / 3600, offset: 0 },
        'L/s': { symbol: 'L/s', name: 'Liter per second', factor: 0.001, offset: 0 },
        'L/min': { symbol: 'L/min', name: 'Liter per minute', factor: 0.001 / 60, offset: 0 },
        'GPM': { symbol: 'GPM', name: 'US Gallons per minute', factor: 0.0000630902, offset: 0 },
        'CFM': { symbol: 'CFM', name: 'Cubic feet per minute', factor: 0.0004719474, offset: 0 }
      }
    },

    // 2. Thermodynamics
    energy: {
      name: 'Energy & Work',
      category: 'Thermodynamics',
      base: 'J',
      dimensionalFormula: '[M · L^2 · T^-2]',
      units: {
        'J': { symbol: 'J', name: 'Joule', factor: 1, offset: 0 },
        'kJ': { symbol: 'kJ', name: 'Kilojoule', factor: 1000, offset: 0 },
        'MJ': { symbol: 'MJ', name: 'Megajoule', factor: 1e6, offset: 0 },
        'cal': { symbol: 'cal', name: 'Calorie', factor: 4.184, offset: 0 },
        'kcal': { symbol: 'kcal', name: 'Kilocalorie', factor: 4184, offset: 0 },
        'BTU': { symbol: 'BTU', name: 'British Thermal Unit', factor: 1055.06, offset: 0 },
        'kWh': { symbol: 'kWh', name: 'Kilowatt-hour', factor: 3.6e6, offset: 0 },
        'eV': { symbol: 'eV', name: 'Electronvolt', factor: 1.602176634e-19, offset: 0 },
        'ft·lbf': { symbol: 'ft·lbf', name: 'Foot-pound force', factor: 1.355818, offset: 0 }
      }
    },
    power: {
      name: 'Power',
      category: 'Thermodynamics',
      base: 'W',
      dimensionalFormula: '[M · L^2 · T^-3]',
      units: {
        'W': { symbol: 'W', name: 'Watt', factor: 1, offset: 0 },
        'kW': { symbol: 'kW', name: 'Kilowatt', factor: 1000, offset: 0 },
        'MW': { symbol: 'MW', name: 'Megawatt', factor: 1e6, offset: 0 },
        'HP': { symbol: 'HP', name: 'Mechanical Horsepower', factor: 745.69987, offset: 0 },
        'CV': { symbol: 'CV', name: 'Metric Horsepower', factor: 735.49875, offset: 0 },
        'BTU/h': { symbol: 'BTU/h', name: 'BTU per hour', factor: 0.293071, offset: 0 }
      }
    },
    thermal_conductivity: {
      name: 'Thermal Conductivity',
      category: 'Thermodynamics',
      base: 'W/(m·K)',
      dimensionalFormula: '[M · L · T^-3 · Θ^-1]',
      units: {
        'W/(m·K)': { symbol: 'W/(m·K)', name: 'Watt per meter-kelvin', factor: 1, offset: 0 },
        'W/(m·°C)': { symbol: 'W/(m·°C)', name: 'Watt per meter-celsius', factor: 1, offset: 0 },
        'cal/(s·cm·°C)': { symbol: 'cal/(s·cm·°C)', name: 'Calorie per second-cm-°C', factor: 418.4, offset: 0 },
        'BTU/(h·ft·°F)': { symbol: 'BTU/(h·ft·°F)', name: 'BTU per hour-foot-°F', factor: 1.730735, offset: 0 }
      }
    },

    // 3. Electromagnetism
    electric_charge: {
      name: 'Electric Charge',
      category: 'Electromagnetism',
      base: 'C',
      dimensionalFormula: '[I · T]',
      units: {
        'C': { symbol: 'C', name: 'Coulomb', factor: 1, offset: 0 },
        'mC': { symbol: 'mC', name: 'Millicoulomb', factor: 0.001, offset: 0 },
        'µC': { symbol: 'µC', name: 'Microcoulomb', factor: 1e-6, offset: 0 },
        'nC': { symbol: 'nC', name: 'Nanocoulomb', factor: 1e-9, offset: 0 },
        'Ah': { symbol: 'Ah', name: 'Ampere-hour', factor: 3600, offset: 0 },
        'mAh': { symbol: 'mAh', name: 'Milliampere-hour', factor: 3.6, offset: 0 }
      }
    },
    capacitance: {
      name: 'Capacitance',
      category: 'Electromagnetism',
      base: 'F',
      dimensionalFormula: '[M^-1 · L^-2 · T^4 · I^2]',
      units: {
        'F': { symbol: 'F', name: 'Farad', factor: 1, offset: 0 },
        'mF': { symbol: 'mF', name: 'Millifarad', factor: 0.001, offset: 0 },
        'µF': { symbol: 'µF', name: 'Microfarad', factor: 1e-6, offset: 0 },
        'nF': { symbol: 'nF', name: 'Nanofarad', factor: 1e-9, offset: 0 },
        'pF': { symbol: 'pF', name: 'Picofarad', factor: 1e-12, offset: 0 }
      }
    },
    inductance: {
      name: 'Inductance',
      category: 'Electromagnetism',
      base: 'H',
      dimensionalFormula: '[M · L^2 · T^-2 · I^-2]',
      units: {
        'H': { symbol: 'H', name: 'Henry', factor: 1, offset: 0 },
        'mH': { symbol: 'mH', name: 'Millihenry', factor: 0.001, offset: 0 },
        'µH': { symbol: 'µH', name: 'Microhenry', factor: 1e-6, offset: 0 },
        'nH': { symbol: 'nH', name: 'Nanohenry', factor: 1e-9, offset: 0 }
      }
    },
    magnetic_flux: {
      name: 'Magnetic Flux',
      category: 'Electromagnetism',
      base: 'Wb',
      dimensionalFormula: '[M · L^2 · T^-2 · I^-1]',
      units: {
        'Wb': { symbol: 'Wb', name: 'Weber', factor: 1, offset: 0 },
        'mWb': { symbol: 'mWb', name: 'Milliweber', factor: 0.001, offset: 0 },
        'Mx': { symbol: 'Mx', name: 'Maxwell', factor: 1e-8, offset: 0 }
      }
    },

    // 4. Acoustics & Optics
    frequency: {
      name: 'Frequency',
      category: 'Acoustics & Optics',
      base: 'Hz',
      dimensionalFormula: '[T^-1]',
      units: {
        'Hz': { symbol: 'Hz', name: 'Hertz', factor: 1, offset: 0 },
        'kHz': { symbol: 'kHz', name: 'Kilohertz', factor: 1000, offset: 0 },
        'MHz': { symbol: 'MHz', name: 'Megahertz', factor: 1e6, offset: 0 },
        'GHz': { symbol: 'GHz', name: 'Gigahertz', factor: 1e9, offset: 0 },
        'RPM': { symbol: 'RPM', name: 'Revolutions per minute', factor: 1 / 60, offset: 0 },
        'rad/s': { symbol: 'rad/s', name: 'Radian per second', factor: 1 / (2 * Math.PI), offset: 0 }
      }
    },
    illuminance: {
      name: 'Illuminance',
      category: 'Acoustics & Optics',
      base: 'lx',
      dimensionalFormula: '[J · L^-2]',
      units: {
        'lx': { symbol: 'lx', name: 'Lux', factor: 1, offset: 0 },
        'fc': { symbol: 'fc', name: 'Foot-candle', factor: 10.76391, offset: 0 },
        'ph': { symbol: 'ph', name: 'Phot', factor: 10000, offset: 0 }
      }
    },

    // 5. Base SI & Imperial
    length: {
      name: 'Length',
      category: 'Base SI & Imperial',
      base: 'm',
      dimensionalFormula: '[L]',
      units: {
        'm': { symbol: 'm', name: 'Meter', factor: 1, offset: 0 },
        'km': { symbol: 'km', name: 'Kilometer', factor: 1000, offset: 0 },
        'cm': { symbol: 'cm', name: 'Centimeter', factor: 0.01, offset: 0 },
        'mm': { symbol: 'mm', name: 'Millimeter', factor: 0.001, offset: 0 },
        'µm': { symbol: 'µm', name: 'Micrometer (Micron)', factor: 1e-6, offset: 0 },
        'nm': { symbol: 'nm', name: 'Nanometer', factor: 1e-9, offset: 0 },
        'in': { symbol: 'in', name: 'Inch', factor: 0.0254, offset: 0 },
        'ft': { symbol: 'ft', name: 'Foot', factor: 0.3048, offset: 0 },
        'yd': { symbol: 'yd', name: 'Yard', factor: 0.9144, offset: 0 },
        'mi': { symbol: 'mi', name: 'Mile', factor: 1609.344, offset: 0 },
        'nmi': { symbol: 'nmi', name: 'Nautical Mile', factor: 1852, offset: 0 },
        'Å': { symbol: 'Å', name: 'Angstrom', factor: 1e-10, offset: 0 }
      }
    },
    mass: {
      name: 'Mass',
      category: 'Base SI & Imperial',
      base: 'kg',
      dimensionalFormula: '[M]',
      units: {
        'kg': { symbol: 'kg', name: 'Kilogram', factor: 1, offset: 0 },
        'g': { symbol: 'g', name: 'Gram', factor: 0.001, offset: 0 },
        'mg': { symbol: 'mg', name: 'Milligram', factor: 1e-6, offset: 0 },
        'µg': { symbol: 'µg', name: 'Microgram', factor: 1e-9, offset: 0 },
        't': { symbol: 't', name: 'Metric Tonne', factor: 1000, offset: 0 },
        'lb': { symbol: 'lb', name: 'Pound', factor: 0.45359237, offset: 0 },
        'oz': { symbol: 'oz', name: 'Ounce', factor: 0.028349523125, offset: 0 },
        'slug': { symbol: 'slug', name: 'Slug', factor: 14.593903, offset: 0 }
      }
    },
    time: {
      name: 'Time',
      category: 'Base SI & Imperial',
      base: 's',
      dimensionalFormula: '[T]',
      units: {
        's': { symbol: 's', name: 'Second', factor: 1, offset: 0 },
        'ms': { symbol: 'ms', name: 'Millisecond', factor: 0.001, offset: 0 },
        'µs': { symbol: 'µs', name: 'Microsecond', factor: 1e-6, offset: 0 },
        'ns': { symbol: 'ns', name: 'Nanosecond', factor: 1e-9, offset: 0 },
        'min': { symbol: 'min', name: 'Minute', factor: 60, offset: 0 },
        'h': { symbol: 'h', name: 'Hour', factor: 3600, offset: 0 },
        'd': { symbol: 'd', name: 'Day', factor: 86400, offset: 0 },
        'yr': { symbol: 'yr', name: 'Year (365 days)', factor: 31536000, offset: 0 }
      }
    },
    temperature: {
      name: 'Temperature',
      category: 'Base SI & Imperial',
      base: 'K',
      dimensionalFormula: '[Θ]',
      units: {
        'K': { symbol: 'K', name: 'Kelvin', factor: 1, offset: 0 },
        'C': { symbol: '°C', name: 'Celsius', factor: 1, offset: 273.15 }, // K = °C * 1 + 273.15
        'F': { symbol: '°F', name: 'Fahrenheit', factor: 5 / 9, offset: 255.372222 }, // K = (°F - 32)*5/9 + 273.15
        'R': { symbol: '°R', name: 'Rankine', factor: 5 / 9, offset: 0 }
      }
    },
    area: {
      name: 'Area',
      category: 'Base SI & Imperial',
      base: 'm²',
      dimensionalFormula: '[L^2]',
      units: {
        'm²': { symbol: 'm²', name: 'Square meter', factor: 1, offset: 0 },
        'km²': { symbol: 'km²', name: 'Square kilometer', factor: 1e6, offset: 0 },
        'cm²': { symbol: 'cm²', name: 'Square centimeter', factor: 0.0001, offset: 0 },
        'mm²': { symbol: 'mm²', name: 'Square millimeter', factor: 1e-6, offset: 0 },
        'ha': { symbol: 'ha', name: 'Hectare', factor: 10000, offset: 0 },
        'acre': { symbol: 'acre', name: 'Acre', factor: 4046.85642, offset: 0 },
        'ft²': { symbol: 'ft²', name: 'Square foot', factor: 0.09290304, offset: 0 },
        'in²': { symbol: 'in²', name: 'Square inch', factor: 0.00064516, offset: 0 }
      }
    },
    volume: {
      name: 'Volume',
      category: 'Base SI & Imperial',
      base: 'm³',
      dimensionalFormula: '[L^3]',
      units: {
        'm³': { symbol: 'm³', name: 'Cubic meter', factor: 1, offset: 0 },
        'L': { symbol: 'L', name: 'Liter', factor: 0.001, offset: 0 },
        'mL': { symbol: 'mL', name: 'Milliliter', factor: 1e-6, offset: 0 },
        'gal': { symbol: 'gal', name: 'US Gallon', factor: 0.003785411784, offset: 0 },
        'qt': { symbol: 'qt', name: 'US Quart', factor: 0.000946352946, offset: 0 },
        'pt': { symbol: 'pt', name: 'US Pint', factor: 0.000473176473, offset: 0 },
        'fl_oz': { symbol: 'fl oz', name: 'US Fluid Ounce', factor: 0.0000295735296875, offset: 0 },
        'ft³': { symbol: 'ft³', name: 'Cubic foot', factor: 0.028316846592, offset: 0 },
        'in³': { symbol: 'in³', name: 'Cubic inch', factor: 0.000016387064, offset: 0 }
      }
    }
  };

  readonly PHYSICAL_CONSTANTS: PhysicalConstant[] = [
    { name: 'Standard Acceleration of Gravity', symbol: 'g', value: 9.80665, unit: 'm/s²', category: 'Physics' },
    { name: 'Universal Gas Constant', symbol: 'R', value: 8.314462618, unit: 'J/(mol·K)', category: 'Thermodynamics' },
    { name: 'Avogadro Constant', symbol: 'N_A', value: 6.02214076e23, unit: 'mol⁻¹', category: 'Chemistry' },
    { name: 'Planck Constant', symbol: 'h', value: 6.62607015e-34, unit: 'J·s', category: 'Physics' },
    { name: 'Elementary Charge', symbol: 'e', value: 1.602176634e-19, unit: 'C', category: 'Electromagnetism' },
    { name: 'Speed of Light in Vacuum', symbol: 'c', value: 299792458, unit: 'm/s', category: 'Physics' },
    { name: 'Boltzmann Constant', symbol: 'k_B', value: 1.380649e-23, unit: 'J/K', category: 'Thermodynamics' },
    { name: 'Vacuum Permittivity', symbol: 'ε₀', value: 8.8541878128e-12, unit: 'F/m', category: 'Electromagnetism' },
    { name: 'Vacuum Permeability', symbol: 'µ₀', value: 1.25663706212e-6, unit: 'H/m', category: 'Electromagnetism' },
    { name: 'Stefan-Boltzmann Constant', symbol: 'σ', value: 5.670374419e-8, unit: 'W/(m²·K⁴)', category: 'Thermodynamics' }
  ];

  readonly SI_PREFIXES = [
    { name: 'Yotta', symbol: 'Y', factor: '10^24', multiplier: 1e24 },
    { name: 'Giga', symbol: 'G', factor: '10^9', multiplier: 1e9 },
    { name: 'Mega', symbol: 'M', factor: '10^6', multiplier: 1e6 },
    { name: 'Kilo', symbol: 'k', factor: '10^3', multiplier: 1e3 },
    { name: 'Hecto', symbol: 'h', factor: '10^2', multiplier: 1e2 },
    { name: 'Deka', symbol: 'da', factor: '10^1', multiplier: 1e1 },
    { name: 'Base', symbol: '-', factor: '10^0', multiplier: 1 },
    { name: 'Deci', symbol: 'd', factor: '10^-1', multiplier: 1e-1 },
    { name: 'Centi', symbol: 'c', factor: '10^-2', multiplier: 1e-2 },
    { name: 'Milli', symbol: 'm', factor: '10^-3', multiplier: 1e-3 },
    { name: 'Micro', symbol: 'µ', factor: '10^-6', multiplier: 1e-6 },
    { name: 'Nano', symbol: 'n', factor: '10^-9', multiplier: 1e-9 },
    { name: 'Pico', symbol: 'p', factor: '10^-12', multiplier: 1e-12 },
    { name: 'Femto', symbol: 'f', factor: '10^-15', multiplier: 1e-15 }
  ];

  getCategories(): string[] {
    const categories = new Set<string>();
    Object.values(this.MAGNITUDES).forEach(m => categories.add(m.category));
    return Array.from(categories);
  }

  getMagnitudesByCategory(category: string): { key: string, definition: MagnitudeDefinition }[] {
    return Object.entries(this.MAGNITUDES)
      .filter(([_, m]) => m.category === category)
      .map(([key, definition]) => ({ key, definition }));
  }
}
