import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MathjaxViewerComponent } from '../components/mathjax-viewer/mathjax-viewer.component';
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
    MathjaxViewerComponent
  ]
})
export class IntegrationModule { }
