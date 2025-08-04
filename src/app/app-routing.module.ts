import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  // {
  //   path: '*',
  //   pathMatch: 'full',
  //   redirectTo: 'basic'
  // },
  {
    path: '',
    loadComponent: () => import('./basic/basic.component').then(m => m.BasicComponent)
  },
  {
    path: 'derivate',
    loadChildren: () => import('./derivation/derivation.module').then(m => m.DerivationModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
