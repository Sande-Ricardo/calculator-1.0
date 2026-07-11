import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraphingRoutingModule } from './graphing-routing.module';
import { GraphingComponent } from './graphing.component';


import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GraphingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GraphingRoutingModule
  ]
})
export class GraphingModule { }
