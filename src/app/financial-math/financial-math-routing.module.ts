import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialMathMainComponent } from './financial-math-main/financial-math-main.component';

const routes: Routes = [
  { path: '', component: FinancialMathMainComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialMathRoutingModule { }
