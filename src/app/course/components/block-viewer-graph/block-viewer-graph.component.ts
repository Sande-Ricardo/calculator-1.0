import { Component, ElementRef, Input, OnChanges, OnDestroy, AfterViewInit, SimpleChanges, ViewChild } from '@angular/core';
import { DesmosLoaderService } from '../../services/desmos-loader.service';

declare var Desmos: any;

@Component({
  selector: 'app-block-viewer-graph',
  templateUrl: './block-viewer-graph.component.html',
  styleUrls: ['./block-viewer-graph.component.scss']
})
export class BlockViewerGraphComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() content: string = ''; // Base expression, e.g., "y = A \\sin(B x)"
  @Input() metadata: any = {};   // { title?: string, variables?: Array<{ name: string, min: number, max: number, step: number, value: number }> }

  @ViewChild('calculatorContainer') calculatorContainer!: ElementRef<HTMLDivElement>;

  calculator: any = null;
  isLoading: boolean = true;
  loadError: boolean = false;

  constructor(private desmosLoader: DesmosLoaderService) {}

  ngAfterViewInit(): void {
    this.initCalculator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.calculator) {
      this.updateExpressions();
    }
  }

  ngOnDestroy(): void {
    if (this.calculator) {
      try {
        this.calculator.destroy();
      } catch (e) {
        console.warn('Error destroying Desmos calculator instance', e);
      }
      this.calculator = null;
    }
  }

  private initCalculator(): void {
    this.isLoading = true;
    this.loadError = false;

    this.desmosLoader.loadDesmos().then(() => {
      this.isLoading = false;
      if (!this.calculatorContainer || !this.calculatorContainer.nativeElement) return;

      if (typeof Desmos === 'undefined') {
        this.loadError = true;
        return;
      }

      if (!this.calculator) {
        this.calculator = Desmos.GraphingCalculator(this.calculatorContainer.nativeElement, {
          keypad: true,
          expressions: true,
          settingsMenu: false,
          border: false,
          invertedColors: true // Dark mode style
        });
      }

      this.updateExpressions();
    }).catch(err => {
      console.error('Failed to load Desmos script:', err);
      this.isLoading = false;
      this.loadError = true;
    });
  }

  private updateExpressions(): void {
    if (!this.calculator) return;

    // Reset expressions
    this.calculator.setBlank();

    // 1. Set main equation
    if (this.content && this.content.trim()) {
      this.calculator.setExpression({
        id: 'main_fn',
        latex: this.content,
        color: (typeof Desmos !== 'undefined' && Desmos.Colors) ? Desmos.Colors.BLUE : '#3b82f6'
      });
    }

    // 2. Set variables/sliders
    if (this.metadata && Array.isArray(this.metadata.variables)) {
      this.metadata.variables.forEach((v: any, index: number) => {
        if (v && v.name) {
          const sliderConfig: any = {
            id: `var_${index}`,
            latex: `${v.name}=${v.value !== undefined ? v.value : 1}`
          };

          if (v.min !== undefined || v.max !== undefined) {
            sliderConfig.sliderBounds = {
              min: v.min !== undefined ? v.min : -10,
              max: v.max !== undefined ? v.max : 10,
              step: v.step !== undefined ? v.step : 0.1
            };
          }

          this.calculator.setExpression(sliderConfig);
        }
      });
    }
  }
}
