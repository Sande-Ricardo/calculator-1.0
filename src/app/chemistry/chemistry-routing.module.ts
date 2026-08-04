import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MolarMassCalculatorComponent } from './components/molar-mass-calculator/molar-mass-calculator.component';

const routes: Routes = [
  { path: '', component: MolarMassCalculatorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChemistryRoutingModule { }
