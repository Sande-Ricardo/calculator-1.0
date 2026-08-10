import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MathjaxViewerComponent } from "src/app/components/mathjax-viewer/mathjax-viewer.component";
import { StepViewDerivativeComponent } from "src/app/components/step-view-derivative/step-view-derivative.component";
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
    FunctionViewerComponent,
    StepViewDerivativeComponent,
    TranslateModule
]
})
export class DerivationModule { }
