import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialMathRoutingModule } from './financial-math-routing.module';
import { FinancialMathMainComponent } from './financial-math-main/financial-math-main.component';
import { InterestCalculatorComponent } from './components/interest-calculator/interest-calculator.component';
import { AmortizationComponent } from './components/amortization/amortization.component';
import { ProjectEvaluationComponent } from './components/project-evaluation/project-evaluation.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    FinancialMathMainComponent,
    InterestCalculatorComponent,
    AmortizationComponent,
    ProjectEvaluationComponent
  ],
  imports: [
    CommonModule,
    FinancialMathRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FinancialMathModule { }
