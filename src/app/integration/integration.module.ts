import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { FunctionViewerComponent } from "src/app/components/function-viewer/function-viewer.component";
import { MathjaxViewerComponent } from '../components/mathjax-viewer/mathjax-viewer.component';
import { StepViewIntregratedComponent } from '../components/step-view-integrated/step-view-integrated.component';
import { IntegrationRoutingModule } from './integration-routing.module';
import { IntegrationComponent } from './integration/integration.component';


@NgModule({
  declarations: [
    IntegrationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IntegrationRoutingModule,
    StepViewIntregratedComponent,
    MathjaxViewerComponent,
    FunctionViewerComponent
]
})
export class IntegrationModule { }
