import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EquationRoutingModule } from './equation-routing.module';
import { EquationComponent } from './equation/equation.component';
import { MathjaxViewerComponent } from 'src/app/components/mathjax-viewer/mathjax-viewer.component';

@NgModule({
  declarations: [
    EquationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EquationRoutingModule,
    MathjaxViewerComponent
  ]
})
export class EquationModule { }
