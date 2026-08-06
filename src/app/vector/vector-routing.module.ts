import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VectorCalculatorComponent } from './components/vector-calculator/vector-calculator.component';

const routes: Routes = [
  { path: '', component: VectorCalculatorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VectorRoutingModule { }
