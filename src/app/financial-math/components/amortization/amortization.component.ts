import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { FinancialEngineService, AmortizationRow } from '../../services/financial-engine.service';
import { FinancialExportService } from '../../services/financial-export.service';

Chart.register(...registerables);

@Component({
  selector: 'app-amortization',
  templateUrl: './amortization.component.html',
  styleUrls: ['./amortization.component.scss']
})
export class AmortizationComponent implements OnInit, OnDestroy, AfterViewInit {

  form: FormGroup;
  tableData: AmortizationRow[] = [];
  
  totalInterest = 0;
  totalPrincipal = 0;

  pieChart: Chart | null = null;
  lineChart: Chart | null = null;

  constructor(
    private fb: FormBuilder,
    private engine: FinancialEngineService,
    private exportService: FinancialExportService
  ) {
    this.form = this.fb.group({
      system: ['french', Validators.required],
      principal: [10000, [Validators.required, Validators.min(1)]],
      rate: [5, [Validators.required, Validators.min(0)]], // % per period
      periods: [12, [Validators.required, Validators.min(1), Validators.max(360)]]
    });
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      this.generateTable();
    });
  }

  ngAfterViewInit(): void {
    // Generate initial table after view is initialized to guarantee canvas exists (though *ngIf/ngStyle might delay it)
    setTimeout(() => {
      this.generateTable();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.pieChart) this.pieChart.destroy();
    if (this.lineChart) this.lineChart.destroy();
  }

  generateTable(): void {
    if (this.form.invalid) {
      this.tableData = [];
      this.updateCharts();
      return;
    }

    const { system, principal, rate, periods } = this.form.value;
    const i = rate / 100;

    switch (system) {
      case 'french':
        this.tableData = this.engine.generateFrenchAmortization(principal, i, periods);
        break;
      case 'german':
        this.tableData = this.engine.generateGermanAmortization(principal, i, periods);
        break;
      case 'american':
        this.tableData = this.engine.generateAmericanAmortization(principal, i, periods);
        break;
    }

    this.calculateTotals();
    this.updateCharts();
  }

  calculateTotals(): void {
    this.totalInterest = this.tableData.reduce((acc, row) => acc + row.interest, 0);
    this.totalPrincipal = this.tableData.reduce((acc, row) => acc + row.principalPayment, 0);
  }

  updateCharts(): void {
    if (this.pieChart) { this.pieChart.destroy(); this.pieChart = null; }
    if (this.lineChart) { this.lineChart.destroy(); this.lineChart = null; }

    if (!this.tableData.length) return;

    // Use setTimeout to allow DOM to render canvas if it was hidden
    setTimeout(() => {
      const pieCanvas = document.getElementById('pieChart') as HTMLCanvasElement;
      if (pieCanvas) {
        this.pieChart = new Chart(pieCanvas, {
          type: 'pie',
          data: {
            labels: ['Total Principal', 'Total Interest'],
            datasets: [{
              data: [this.totalPrincipal, this.totalInterest],
              backgroundColor: ['rgba(0, 210, 255, 0.7)', 'rgba(58, 123, 213, 0.7)'],
              borderColor: ['#00d2ff', '#3a7bd5'],
              borderWidth: 1
            }]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
      }

      const lineCanvas = document.getElementById('lineChart') as HTMLCanvasElement;
      if (lineCanvas) {
        const labels = [0, ...this.tableData.map(r => r.period)];
        const data = [this.form.value.principal, ...this.tableData.map(r => r.finalBalance)];
        
        this.lineChart = new Chart(lineCanvas, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Remaining Balance',
              data: data,
              borderColor: '#00d2ff',
              backgroundColor: 'rgba(0, 210, 255, 0.1)',
              fill: true,
              tension: 0.3
            }]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
        });
      }
    }, 0);
  }

  exportCsv(): void {
    this.exportService.exportToCsv(this.tableData, `Amortization_${this.form.value.system}`);
  }

  exportPdf(): void {
    window.print();
  }
}
