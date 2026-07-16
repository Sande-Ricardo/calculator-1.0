import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ApiManagementService } from 'src/app/core/services/api-management.service';
import {
  StatsDescriptiveRequestDTO,
  StatsDescriptiveResponseDTO,
  StatsProbabilityRequestDTO,
  StatsProbabilityResponseDTO
} from 'src/app/interfaces/Stats';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit, AfterViewChecked {

  activeTab: 'descriptive' | 'probability' = 'descriptive';

  // --- Descriptive Statistics ---
  datasetRaw: string = '12.5, 14.2, 10.1, 15.6, 12.5, 18.9, 11.0, 9.5, 45.0';
  isSample: boolean = true;
  descriptiveData: StatsDescriptiveResponseDTO['data'] | null = null;
  descriptiveLoading: boolean = false;
  descriptiveError: string = '';

  @ViewChild('histogramCanvas') histogramCanvas!: ElementRef<HTMLCanvasElement>;
  histogramChart: Chart | null = null;
  private histogramNeedsUpdate: boolean = false;

  // --- Probability Distributions ---
  selectedDistribution: 'normal' | 't_student' | 'binomial' | 'poisson' = 'normal';
  queryType: 'exact' | 'cumulative_less' | 'cumulative_greater' | 'between' = 'cumulative_less';
  
  // Evaluation values
  queryValue: number = 1.96;
  queryValueMin: number = -1.96;
  queryValueMax: number = 1.96;

  // Parameters
  mu: number = 0;
  sigma: number = 1;
  df: number = 10;
  loc: number = 0;
  scale: number = 1;
  n: number = 10;
  p: number = 0.5;
  lambda: number = 3;

  probabilityData: StatsProbabilityResponseDTO | null = null;
  probabilityLoading: boolean = false;
  probabilityError: string = '';

  @ViewChild('probabilityCanvas') probabilityCanvas!: ElementRef<HTMLCanvasElement>;
  probabilityChart: Chart | null = null;
  private probabilityNeedsUpdate: boolean = false;

  constructor(private apiService: ApiManagementService) { }

  ngOnInit(): void {
    // Initial fetch for descriptive statistics
    this.calculateDescriptive();
  }

  ngAfterViewChecked(): void {
    // Render charts after Angular finishes drawing the view elements (since tabs toggle visibility)
    if (this.histogramNeedsUpdate && this.histogramCanvas) {
      this.renderHistogramChart();
      this.histogramNeedsUpdate = false;
    }
    if (this.probabilityNeedsUpdate && this.probabilityCanvas) {
      this.renderProbabilityChart();
      this.probabilityNeedsUpdate = false;
    }
  }

  onTabChange(tab: 'descriptive' | 'probability'): void {
    this.activeTab = tab;
    if (tab === 'descriptive' && this.descriptiveData) {
      this.histogramNeedsUpdate = true;
    } else if (tab === 'probability' && this.probabilityData) {
      this.probabilityNeedsUpdate = true;
    }
  }

  onDistributionChange(): void {
    // Reset defaults based on distribution selection
    if (this.selectedDistribution === 'normal') {
      this.queryType = 'cumulative_less';
      this.queryValue = 1.96;
    } else if (this.selectedDistribution === 't_student') {
      this.queryType = 'cumulative_less';
      this.queryValue = 2.228;
    } else if (this.selectedDistribution === 'binomial') {
      this.queryType = 'exact';
      this.queryValue = 5;
    } else if (this.selectedDistribution === 'poisson') {
      this.queryType = 'exact';
      this.queryValue = 3;
    }
    this.probabilityData = null;
  }

  calculateDescriptive(): void {
    this.descriptiveLoading = true;
    this.descriptiveError = '';
    
    // Parse dataset from string
    const parsedDataset = this.datasetRaw
      .split(/[\s,;]+/)
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));

    if (parsedDataset.length === 0) {
      this.descriptiveError = 'Please enter a valid dataset containing numeric values.';
      this.descriptiveLoading = false;
      return;
    }

    const request: StatsDescriptiveRequestDTO = {
      dataset: parsedDataset,
      sample: this.isSample
    };

    this.apiService.getDescriptiveStats(request).subscribe({
      next: (response) => {
        this.descriptiveLoading = false;
        if (response.status === 'success') {
          this.descriptiveData = response.data;
          this.histogramNeedsUpdate = true;
        } else {
          this.descriptiveError = 'Calculations failed on the server side.';
        }
      },
      error: (err) => {
        this.descriptiveLoading = false;
        console.error('Descriptive stats error:', err);
        this.descriptiveError = 'Error fetching descriptive statistics from the server.';
      }
    });
  }

  calculateProbability(): void {
    this.probabilityLoading = true;
    this.probabilityError = '';

    // Prepare parameters based on selected distribution
    const parameters: any = {};
    if (this.selectedDistribution === 'normal') {
      parameters.mu = this.mu;
      parameters.sigma = this.sigma;
    } else if (this.selectedDistribution === 't_student') {
      parameters.df = this.df;
      parameters.loc = this.loc;
      parameters.scale = this.scale;
    } else if (this.selectedDistribution === 'binomial') {
      parameters.n = this.n;
      parameters.p = this.p;
    } else if (this.selectedDistribution === 'poisson') {
      parameters.lambda = this.lambda;
    }

    // Prepare query value
    let qValue: number | number[] = this.queryValue;
    if (this.queryType === 'between') {
      qValue = [this.queryValueMin, this.queryValueMax];
    }

    const request: StatsProbabilityRequestDTO = {
      distribution: this.selectedDistribution,
      parameters,
      query_type: this.queryType,
      query_value: qValue
    };

    this.apiService.getProbabilityDistribution(request).subscribe({
      next: (response) => {
        this.probabilityLoading = false;
        if (response.status === 'success') {
          this.probabilityData = response;
          this.probabilityNeedsUpdate = true;
        } else {
          this.probabilityError = 'Calculation failed on the server side.';
        }
      },
      error: (err) => {
        this.probabilityLoading = false;
        console.error('Probability error:', err);
        this.probabilityError = 'Error fetching probability calculation from the server.';
      }
    });
  }

  // --- Charting ---

  private renderHistogramChart(): void {
    if (!this.descriptiveData || !this.histogramCanvas) return;

    if (this.histogramChart) {
      this.histogramChart.destroy();
    }

    const { bins, frequencies } = this.descriptiveData.chart_data.histogram;
    // Formatting bin labels like [10.5 - 15.6]
    const labels = bins.slice(0, -1).map((bin, i) => `[${bin.toFixed(2)}, ${bins[i + 1].toFixed(2)}]`);

    const ctx = this.histogramCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.histogramChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Frequencies',
          data: frequencies,
          backgroundColor: 'rgba(59, 130, 246, 0.4)', // Glassy blue
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1.5,
          barPercentage: 1.0,
          categoryPercentage: 1.0 // Removes spacing between bars to represent a real histogram
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.6)' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.6)', stepSize: 1 }
          }
        }
      }
    });
  }

  private renderProbabilityChart(): void {
    if (!this.probabilityData || !this.probabilityCanvas) return;

    if (this.probabilityChart) {
      this.probabilityChart.destroy();
    }

    const points = this.probabilityData.chart_data.curve_points || [];
    const labels = points.map(p => p.x.toFixed(3));
    const dataValues = points.map(p => p.y);

    const shaded = this.probabilityData.chart_data.shaded_region;
    const isDiscrete = this.selectedDistribution === 'binomial' || this.selectedDistribution === 'poisson';

    const datasets: any[] = [];

    if (isDiscrete) {
      const backgroundColors = points.map(p => {
        if (shaded && p.x >= shaded.x_min && p.x <= shaded.x_max) {
          return 'rgba(59, 130, 246, 0.4)';
        }
        return 'rgba(59, 130, 246, 0.05)';
      });

      datasets.push({
        label: 'Probability mass',
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1.5,
        pointRadius: 3
      });
    } else {
      // Line curve
      datasets.push({
        label: 'Probability density',
        data: dataValues,
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        tension: 0.4
      });

      // Shaded area dataset
      if (shaded) {
        const shadedValues = points.map(p => {
          if (p.x >= shaded.x_min && p.x <= shaded.x_max) {
            return p.y;
          }
          return null;
        });

        datasets.push({
          label: 'Shaded region',
          data: shadedValues,
          backgroundColor: 'rgba(59, 130, 246, 0.3)',
          borderColor: 'transparent',
          fill: 'origin',
          pointRadius: 0,
          tension: 0.4,
          spanGaps: false
        });
      }
    }

    const ctx = this.probabilityCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.probabilityChart = new Chart(ctx, {
      type: isDiscrete ? 'bar' : 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.6)', maxTicksLimit: 15 }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: 'rgba(255, 255, 255, 0.6)' }
          }
        }
      }
    });
  }
}
