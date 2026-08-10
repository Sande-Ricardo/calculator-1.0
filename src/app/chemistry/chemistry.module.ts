import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ChemistryRoutingModule } from './chemistry-routing.module';
import { MolarMassCalculatorComponent } from './components/molar-mass-calculator/molar-mass-calculator.component';

@NgModule({
  declarations: [
    MolarMassCalculatorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChemistryRoutingModule,
    TranslateModule
  ]
})
export class ChemistryModule { }
