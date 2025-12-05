import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BasicComponent } from "src/app/components/basic/basic.component";
import { CalculatorRoutingModule } from './calculator-routing.module';
import { CalculatorComponent } from './calculator/calculator.component';


@NgModule({
  declarations: [
    CalculatorComponent
  ],
  imports: [
    CommonModule,
    CalculatorRoutingModule,
    BasicComponent
]
})
export class CalculatorModule { }
