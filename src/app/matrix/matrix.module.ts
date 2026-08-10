import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatrixRoutingModule } from './matrix-routing.module';
import { MatrixComponent } from './matrix.component';
import { MathjaxViewerComponent } from 'src/app/components/mathjax-viewer/mathjax-viewer.component';

@NgModule({
  declarations: [
    MatrixComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatrixRoutingModule,
    MathjaxViewerComponent,
    TranslateModule
  ]
})
export class MatrixModule { }
