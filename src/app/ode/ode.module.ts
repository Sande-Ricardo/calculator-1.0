import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { OdeRoutingModule } from './ode-routing.module';
import { OdeComponent } from './ode.component';
import { SlopeFieldComponent } from './slope-field/slope-field.component';

import { FormsModule } from '@angular/forms';
import { MathjaxViewerComponent } from 'src/app/components/mathjax-viewer/mathjax-viewer.component';

@NgModule({
  declarations: [
    OdeComponent,
    SlopeFieldComponent
  ],
  imports: [
    CommonModule,
    OdeRoutingModule,
    FormsModule,
    MathjaxViewerComponent,
    TranslateModule
  ]
})
export class OdeModule { }

