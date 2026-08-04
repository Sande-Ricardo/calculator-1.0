import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormulaParserService, ParseResult, ParsedElement } from '../../services/formula-parser.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-molar-mass-calculator',
  templateUrl: './molar-mass-calculator.component.html',
  styleUrls: ['./molar-mass-calculator.component.scss']
})
export class MolarMassCalculatorComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;

  // Input
  formulaInput: string = '';
  useIsotopes: boolean = false;
  
  // Results
  result: ParseResult | null = null;

  // Quick Converter
  gramsInput: number | null = null;
  molesInput: number | null = null;
  moleculesInput: number | null = null;
  private readonly AVOGADRO = 6.022e23;

  // Empirical Evaluator
  empiricalFormula: string = '';
  experimentalMass: number | null = null;
  molecularFormulaResult: string | null = null;
  empiricalError: string | null = null;

  constructor(public parser: FormulaParserService) { }

  ngOnInit(): void {
    // Initial example
    this.formulaInput = 'C6H12O6';
  }

  ngAfterViewInit(): void {
    this.onFormulaChange();
  }

  onFormulaChange(): void {
    if (!this.formulaInput.trim()) {
      this.result = null;
      this.clearChart();
      this.clearConverter();
      return;
    }
    
    this.result = this.parser.parseFormula(this.formulaInput, this.useIsotopes);
    if (this.result.isValid) {
      this.updateChart();
      this.onGramsChange(); // Refresh conversions if they exist
    } else {
      this.clearChart();
    }
  }

  onToggleIsotopes(): void {
    this.onFormulaChange();
  }

  private updateChart(): void {
    if (!this.result || !this.result.isValid || !this.chartCanvas) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.result.elements.map(e => `${e.symbol} (${e.massPercentage.toFixed(2)}%)`),
        datasets: [{
          data: this.result.elements.map(e => e.massPercentage),
          backgroundColor: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f43f5e'],
          borderColor: '#0e0f25',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#e2e8f0'
            }
          }
        }
      }
    });
  }
  
  private clearChart(): void {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  // --- Quick Converter Methods ---

  onGramsChange(): void {
    if (!this.result || !this.result.isValid || this.gramsInput == null) {
      this.clearConverter();
      return;
    }
    this.molesInput = this.gramsInput / this.result.totalMolarMass;
    this.moleculesInput = this.molesInput * this.AVOGADRO;
  }

  onMolesChange(): void {
    if (!this.result || !this.result.isValid || this.molesInput == null) {
      this.clearConverter();
      return;
    }
    this.gramsInput = this.molesInput * this.result.totalMolarMass;
    this.moleculesInput = this.molesInput * this.AVOGADRO;
  }

  onMoleculesChange(): void {
    if (!this.result || !this.result.isValid || this.moleculesInput == null) {
      this.clearConverter();
      return;
    }
    this.molesInput = this.moleculesInput / this.AVOGADRO;
    this.gramsInput = this.molesInput * this.result.totalMolarMass;
  }

  private clearConverter(): void {
    this.gramsInput = null;
    this.molesInput = null;
    this.moleculesInput = null;
  }

  // --- Empirical to Molecular Evaluator ---

  onEmpiricalEvaluate(): void {
    if (!this.empiricalFormula.trim() || !this.experimentalMass) {
      this.molecularFormulaResult = null;
      this.empiricalError = null;
      return;
    }

    const empResult = this.parser.parseFormula(this.empiricalFormula, false);
    if (!empResult.isValid) {
      this.empiricalError = "Invalid empirical formula: " + empResult.error;
      this.molecularFormulaResult = null;
      return;
    }

    const empMass = empResult.totalMolarMass;
    if (empMass <= 0) {
      this.empiricalError = "Empirical mass is zero.";
      return;
    }

    const ratio = Math.round(this.experimentalMass / empMass);
    
    if (ratio < 1) {
      this.empiricalError = "Experimental mass is smaller than empirical mass.";
      this.molecularFormulaResult = null;
      return;
    }

    // Multiply each count by ratio and build formula
    let molFormula = '';
    // Preserve original order conceptually by using elements from parser
    // Actually parser sorts by mass percentage, so we just rebuild it
    empResult.elements.forEach(e => {
      const newCount = e.count * ratio;
      molFormula += e.symbol + (newCount > 1 ? newCount.toString() : '');
    });

    this.molecularFormulaResult = molFormula;
    this.empiricalError = null;
  }
}
