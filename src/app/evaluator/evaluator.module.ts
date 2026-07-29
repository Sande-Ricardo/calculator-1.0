import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EvaluatorRoutingModule } from './evaluator-routing.module';
import { EvaluatorMainComponent } from './evaluator-main/evaluator-main.component';
import { ExpressionInputComponent } from './components/expression-input/expression-input.component';
import { VariableDashboardComponent } from './components/variable-dashboard/variable-dashboard.component';
import { PlotPreviewComponent } from './components/plot-preview/plot-preview.component';
import { RootFinderComponent } from './components/root-finder/root-finder.component';
import { HistoryPanelComponent } from './components/history-panel/history-panel.component';
import { MathjaxViewerComponent } from '../components/mathjax-viewer/mathjax-viewer.component';

@NgModule({
  declarations: [
    EvaluatorMainComponent,
    ExpressionInputComponent,
    VariableDashboardComponent,
    PlotPreviewComponent,
    RootFinderComponent,
    HistoryPanelComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EvaluatorRoutingModule,
    MathjaxViewerComponent
  ],
  exports: [
    ExpressionInputComponent,
    VariableDashboardComponent,
    PlotPreviewComponent,
    RootFinderComponent,
    HistoryPanelComponent
  ]
})
export class EvaluatorModule { }
