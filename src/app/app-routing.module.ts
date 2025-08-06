import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '*',
    pathMatch: 'full',
    redirectTo: ''
  },
  {
    path: '',
    loadComponent: () => import('./basic/basic.component').then(m => m.BasicComponent)
  },
  {
    path: 'derivate',
    loadChildren: () => import('./derivation/derivation.module').then(m => m.DerivationModule)
  },
  {
    path: 'integrate',
    loadChildren: () => import('./integration/integration.module').then(m => m.IntegrationModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
