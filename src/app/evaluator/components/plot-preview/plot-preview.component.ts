import { Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { EvaluatorEngineService } from '../../services/evaluator-engine.service';

Chart.register(...registerables);

@Component({
  selector: 'app-plot-preview',
  templateUrl: './plot-preview.component.html',
  styleUrls: ['./plot-preview.component.scss']
})
export class PlotPreviewComponent implements OnChanges, OnDestroy {
  @Input() expression: string = '';
  @Input() variables: string[] = [];
  @Input() fixedScope: Record<string, number> = {};

  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;

  targetVariable: string = 'x';
  xMin: number = -10;
  xMax: number = 10;
  steps: number = 100;

  chart: Chart | null = null;
  isValidPlotable: boolean = false;

  constructor(private engineService: EvaluatorEngineService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.variables && this.variables.length > 0) {
      // Pick 'x' if available, otherwise first variable
      this.targetVariable = this.variables.includes('x') ? 'x' : this.variables[0];
      this.isValidPlotable = true;
    } else if (this.expression && this.variables.length === 0) {
      // Constant function plot
      this.targetVariable = 'x';
      this.isValidPlotable = true;
    } else {
      this.isValidPlotable = false;
    }

    setTimeout(() => {
      this.updatePlot();
    }, 0);
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  onDomainChange(): void {
    if (this.xMin >= this.xMax) {
      this.xMin = this.xMax - 1;
    }
    this.updatePlot();
  }

  updatePlot(): void {
    if (!this.isValidPlotable || !this.chartCanvas) {
      return;
    }

    // Build secondary scope for remaining variables
    const otherScope: Record<string, number> = { ...this.fixedScope };
    delete otherScope[this.targetVariable];

    const points = this.engineService.generatePlotPoints(
      this.expression,
      this.targetVariable,
      otherScope,
      [this.xMin, this.xMax],
      this.steps
    );

    const labels = points.map(p => p.x);
    const data = points.map(p => p.y);

    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `f(${this.targetVariable}) = ${this.expression}`,
            data: data,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2.5,
            fill: true,
            pointRadius: points.length < 30 ? 3 : 0,
            tension: 0.2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#cbd5e1',
              font: { family: 'JetBrains Mono', size: 12 }
            }
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: (context) => `y = ${context.parsed.y}`
            }
          }
        },
        scales: {
          x: {
            type: 'category',
            title: {
              display: true,
              text: this.targetVariable,
              color: '#94a3b8'
            },
            grid: {
              color: 'rgba(71, 85, 105, 0.3)'
            },
            ticks: {
              color: '#cbd5e1',
              maxTicksLimit: 10
            }
          },
          y: {
            title: {
              display: true,
              text: 'f(' + this.targetVariable + ')',
              color: '#94a3b8'
            },
            grid: {
              color: 'rgba(71, 85, 105, 0.3)'
            },
            ticks: {
              color: '#cbd5e1'
            }
          }
        }
      }
    });
  }
}
