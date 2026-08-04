import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
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
        path: 'equation',
        loadChildren: () => import('./equation/equation.module').then(m => m.EquationModule)
      },
      {
        path: 'graph',
        loadChildren: () => import('./graphing/graphing.module').then(m => m.GraphingModule)
      },
      {
        path: 'matrix',
        loadChildren: () => import('./matrix/matrix.module').then(m => m.MatrixModule)
      },
      {
        path: 'stats',
        loadChildren: () => import('./stats/stats.module').then(m => m.StatsModule)
      },
      {
        path: 'ode',
        loadChildren: () => import('./ode/ode.module').then(m => m.OdeModule)
      },
      {
        path: 'converter',
        loadChildren: () => import('./converter/converter.module').then(m => m.ConverterModule)
      },
      {
        path: 'finance',
        loadChildren: () => import('./financial-math/financial-math.module').then(m => m.FinancialMathModule)
      },
      {
        path: 'evaluator',
        loadChildren: () => import('./evaluator/evaluator.module').then(m => m.EvaluatorModule)
      },
      {
        path: 'chemistry',
        loadChildren: () => import('./chemistry/chemistry.module').then(m => m.ChemistryModule)
      },
      {
        path: '',
        loadChildren: () => import('./calculator/calculator.module').then(m => m.CalculatorModule)
      }
    ]
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
