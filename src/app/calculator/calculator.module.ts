import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StandardCalculatorComponent } from "src/app/components/standard-calculator/standard-calculator.component";
import { CalculatorRoutingModule } from './calculator-routing.module';
import { CalculatorComponent } from './calculator/calculator.component';


@NgModule({
  declarations: [
    CalculatorComponent
  ],
  imports: [
    CommonModule,
    CalculatorRoutingModule,
    StandardCalculatorComponent
]
})
export class CalculatorModule { }
