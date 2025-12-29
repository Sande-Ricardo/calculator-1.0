import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MathjaxViewerComponent } from "src/app/components/mathjax-viewer/mathjax-viewer.component";
import { FunctionViewerComponent } from '../components/function-viewer/function-viewer.component';
import { DerivationRoutingModule } from './derivation-routing.module';
import { DerivationComponent } from './derivation/derivation.component';

@NgModule({
  declarations: [
    DerivationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    DerivationRoutingModule,
    MathjaxViewerComponent,
    FunctionViewerComponent
]
})
export class DerivationModule { }
