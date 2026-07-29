import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EvaluatorMainComponent } from './evaluator-main/evaluator-main.component';

const routes: Routes = [
  { path: '', component: EvaluatorMainComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EvaluatorRoutingModule { }
