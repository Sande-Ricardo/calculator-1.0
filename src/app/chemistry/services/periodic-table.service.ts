import { Injectable } from '@angular/core';

export interface ElementData {
  symbol: string;
  name: string;
  atomicMass: number;
}

export interface IsotopeData {
  symbol: string;
  name: string;
  atomicMass: number;
}

@Injectable({
  providedIn: 'root'
})
export class PeriodicTableService {
  private readonly elements: { [symbol: string]: ElementData } = {
    "H": { symbol: "H", name: "Hydrogen", atomicMass: 1.008 },
    "He": { symbol: "He", name: "Helium", atomicMass: 4.0026 },
    "Li": { symbol: "Li", name: "Lithium", atomicMass: 6.94 },
    "Be": { symbol: "Be", name: "Beryllium", atomicMass: 9.0122 },
    "B": { symbol: "B", name: "Boron", atomicMass: 10.81 },
    "C": { symbol: "C", name: "Carbon", atomicMass: 12.011 },
    "N": { symbol: "N", name: "Nitrogen", atomicMass: 14.007 },
    "O": { symbol: "O", name: "Oxygen", atomicMass: 15.999 },
    "F": { symbol: "F", name: "Fluorine", atomicMass: 18.998 },
    "Ne": { symbol: "Ne", name: "Neon", atomicMass: 20.180 },
    "Na": { symbol: "Na", name: "Sodium", atomicMass: 22.990 },
    "Mg": { symbol: "Mg", name: "Magnesium", atomicMass: 24.305 },
    "Al": { symbol: "Al", name: "Aluminum", atomicMass: 26.982 },
    "Si": { symbol: "Si", name: "Silicon", atomicMass: 28.085 },
    "P": { symbol: "P", name: "Phosphorus", atomicMass: 30.974 },
    "S": { symbol: "S", name: "Sulfur", atomicMass: 32.06 },
    "Cl": { symbol: "Cl", name: "Chlorine", atomicMass: 35.45 },
    "Ar": { symbol: "Ar", name: "Argon", atomicMass: 39.95 },
    "K": { symbol: "K", name: "Potassium", atomicMass: 39.098 },
    "Ca": { symbol: "Ca", name: "Calcium", atomicMass: 40.078 },
    "Sc": { symbol: "Sc", name: "Scandium", atomicMass: 44.956 },
    "Ti": { symbol: "Ti", name: "Titanium", atomicMass: 47.867 },
    "V": { symbol: "V", name: "Vanadium", atomicMass: 50.942 },
    "Cr": { symbol: "Cr", name: "Chromium", atomicMass: 51.996 },
    "Mn": { symbol: "Mn", name: "Manganese", atomicMass: 54.938 },
    "Fe": { symbol: "Fe", name: "Iron", atomicMass: 55.845 },
    "Co": { symbol: "Co", name: "Cobalt", atomicMass: 58.933 },
    "Ni": { symbol: "Ni", name: "Nickel", atomicMass: 58.693 },
    "Cu": { symbol: "Cu", name: "Copper", atomicMass: 63.546 },
    "Zn": { symbol: "Zn", name: "Zinc", atomicMass: 65.38 },
    "Ga": { symbol: "Ga", name: "Gallium", atomicMass: 69.723 },
    "Ge": { symbol: "Ge", name: "Germanium", atomicMass: 72.630 },
    "As": { symbol: "As", name: "Arsenic", atomicMass: 74.922 },
    "Se": { symbol: "Se", name: "Selenium", atomicMass: 78.971 },
    "Br": { symbol: "Br", name: "Bromine", atomicMass: 79.904 },
    "Kr": { symbol: "Kr", name: "Krypton", atomicMass: 83.798 },
    "Rb": { symbol: "Rb", name: "Rubidium", atomicMass: 85.468 },
    "Sr": { symbol: "Sr", name: "Strontium", atomicMass: 87.62 },
    "Y": { symbol: "Y", name: "Yttrium", atomicMass: 88.906 },
    "Zr": { symbol: "Zr", name: "Zirconium", atomicMass: 91.224 },
    "Nb": { symbol: "Nb", name: "Niobium", atomicMass: 92.906 },
    "Mo": { symbol: "Mo", name: "Molybdenum", atomicMass: 95.95 },
    "Tc": { symbol: "Tc", name: "Technetium", atomicMass: 98 },
    "Ru": { symbol: "Ru", name: "Ruthenium", atomicMass: 101.07 },
    "Rh": { symbol: "Rh", name: "Rhodium", atomicMass: 102.91 },
    "Pd": { symbol: "Pd", name: "Palladium", atomicMass: 106.42 },
    "Ag": { symbol: "Ag", name: "Silver", atomicMass: 107.87 },
    "Cd": { symbol: "Cd", name: "Cadmium", atomicMass: 112.41 },
    "In": { symbol: "In", name: "Indium", atomicMass: 114.82 },
    "Sn": { symbol: "Sn", name: "Tin", atomicMass: 118.71 },
    "Sb": { symbol: "Sb", name: "Antimony", atomicMass: 121.76 },
    "Te": { symbol: "Te", name: "Tellurium", atomicMass: 127.60 },
    "I": { symbol: "I", name: "Iodine", atomicMass: 126.90 },
    "Xe": { symbol: "Xe", name: "Xenon", atomicMass: 131.29 },
    "Cs": { symbol: "Cs", name: "Cesium", atomicMass: 132.91 },
    "Ba": { symbol: "Ba", name: "Barium", atomicMass: 137.33 },
    "La": { symbol: "La", name: "Lanthanum", atomicMass: 138.91 },
    "Ce": { symbol: "Ce", name: "Cerium", atomicMass: 140.12 },
    "Pr": { symbol: "Pr", name: "Praseodymium", atomicMass: 140.91 },
    "Nd": { symbol: "Nd", name: "Neodymium", atomicMass: 144.24 },
    "Pm": { symbol: "Pm", name: "Promethium", atomicMass: 145 },
    "Sm": { symbol: "Sm", name: "Samarium", atomicMass: 150.36 },
    "Eu": { symbol: "Eu", name: "Europium", atomicMass: 151.96 },
    "Gd": { symbol: "Gd", name: "Gadolinium", atomicMass: 157.25 },
    "Tb": { symbol: "Tb", name: "Terbium", atomicMass: 158.93 },
    "Dy": { symbol: "Dy", name: "Dysprosium", atomicMass: 162.50 },
    "Ho": { symbol: "Ho", name: "Holmium", atomicMass: 164.93 },
    "Er": { symbol: "Er", name: "Erbium", atomicMass: 167.26 },
    "Tm": { symbol: "Tm", name: "Thulium", atomicMass: 168.93 },
    "Yb": { symbol: "Yb", name: "Ytterbium", atomicMass: 173.05 },
    "Lu": { symbol: "Lu", name: "Lutetium", atomicMass: 174.97 },
    "Hf": { symbol: "Hf", name: "Hafnium", atomicMass: 178.49 },
    "Ta": { symbol: "Ta", name: "Tantalum", atomicMass: 180.95 },
    "W": { symbol: "W", name: "Tungsten", atomicMass: 183.84 },
    "Re": { symbol: "Re", name: "Rhenium", atomicMass: 186.21 },
    "Os": { symbol: "Os", name: "Osmium", atomicMass: 190.23 },
    "Ir": { symbol: "Ir", name: "Iridium", atomicMass: 192.22 },
    "Pt": { symbol: "Pt", name: "Platinum", atomicMass: 195.08 },
    "Au": { symbol: "Au", name: "Gold", atomicMass: 196.97 },
    "Hg": { symbol: "Hg", name: "Mercury", atomicMass: 200.59 },
    "Tl": { symbol: "Tl", name: "Thallium", atomicMass: 204.38 },
    "Pb": { symbol: "Pb", name: "Lead", atomicMass: 207.2 },
    "Bi": { symbol: "Bi", name: "Bismuth", atomicMass: 208.98 },
    "Th": { symbol: "Th", name: "Thorium", atomicMass: 232.04 },
    "Pa": { symbol: "Pa", name: "Protactinium", atomicMass: 231.04 },
    "U": { symbol: "U", name: "Uranium", atomicMass: 238.03 }
  };

  private readonly isotopes: { [symbol: string]: IsotopeData } = {
    "D": { symbol: "D", name: "Deuterium (H-2)", atomicMass: 2.014 },
    "T": { symbol: "T", name: "Tritium (H-3)", atomicMass: 3.016 },
    "C13": { symbol: "C13", name: "Carbon-13", atomicMass: 13.003355 },
    "C14": { symbol: "C14", name: "Carbon-14", atomicMass: 14.003241 },
    "U235": { symbol: "U235", name: "Uranium-235", atomicMass: 235.043930 },
    "U238": { symbol: "U238", name: "Uranium-238", atomicMass: 238.050788 }
  };

  constructor() { }

  /**
   * Retrieves element data by symbol.
   * Checks isotopes first, then standard elements.
   */
  getElement(symbol: string): ElementData | undefined {
    return this.isotopes[symbol] || this.elements[symbol];
  }

  isValidSymbol(symbol: string): boolean {
    return !!this.getElement(symbol);
  }
}
