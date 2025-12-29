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
    loadComponent: () => import('./components/basic/basic.component').then(m => m.BasicComponent)
  },
  {
    path: 'derivate',
    loadChildren: () => import('./derivation/derivation.module').then(m => m.DerivationModule)
  },
  {
    path: 'integrate',
    loadChildren: () => import('./integration/integration.module').then(m => m.IntegrationModule)
  },
  {
    path: 'calculator',
    loadChildren: () => import('./calculator/calculator.module').then(m => m.CalculatorModule)
  },
  {
    path: 'course',
    loadChildren: () => import('./course/course.module').then(m => m.CourseModule)
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
