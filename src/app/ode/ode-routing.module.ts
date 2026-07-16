import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OdeComponent } from './ode.component';

const routes: Routes = [{ path: '', component: OdeComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OdeRoutingModule { }
