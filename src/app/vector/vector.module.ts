import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VectorRoutingModule } from './vector-routing.module';
import { VectorCalculatorComponent } from './components/vector-calculator/vector-calculator.component';
import { MathjaxViewerComponent } from '../components/mathjax-viewer/mathjax-viewer.component';
import { VectorVisualizerComponent } from './components/vector-visualizer/vector-visualizer.component';

@NgModule({
  declarations: [
    VectorCalculatorComponent,
    VectorVisualizerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VectorRoutingModule,
    MathjaxViewerComponent
  ]
})
export class VectorModule { }
