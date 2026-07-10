import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EquationComponent } from './equation/equation.component';

const routes: Routes = [
  {
    path: '',
    component: EquationComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EquationRoutingModule { }
