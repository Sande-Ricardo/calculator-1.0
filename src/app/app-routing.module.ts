import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'derivate',
    loadChildren: () => import('./derivation/derivation.module').then(m => m.DerivationModule)
  },
  {
    path: 'integrate',
    loadChildren: () => import('./integration/integration.module').then(m => m.IntegrationModule)
  },
  {
    path: 'course',
    loadChildren: () => import('./course/course.module').then(m => m.CourseModule)
  },
  {
    path: '',
    loadChildren: () => import('./calculator/calculator.module').then(m => m.CalculatorModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
