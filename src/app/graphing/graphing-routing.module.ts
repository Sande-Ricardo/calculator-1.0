import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GraphingComponent } from './graphing.component';

const routes: Routes = [{ path: '', component: GraphingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GraphingRoutingModule { }
