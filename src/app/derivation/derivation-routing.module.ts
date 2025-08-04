import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DerivationComponent } from './derivation/derivation.component';

const routes: Routes = [
  {
    path: '',
    component: DerivationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DerivationRoutingModule { }
