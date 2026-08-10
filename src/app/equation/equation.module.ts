import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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
    MathjaxViewerComponent,
    TranslateModule
  ]
})
export class EquationModule { }
