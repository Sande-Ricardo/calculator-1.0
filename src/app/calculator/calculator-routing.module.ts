import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphComponent } from '../components/graph/graph.component';
import { CalculatorComponent } from './calculator/calculator.component';

const routes: Routes = [
  {
    path: 'calculator',
    component: CalculatorComponent
  },
  {
    path: 'graph-calculator',
    component: GraphComponent
  },
  {
    path: '',
    redirectTo: 'calculator',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'calculator',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalculatorRoutingModule { }
