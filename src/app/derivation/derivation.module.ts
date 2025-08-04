import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DerivationRoutingModule } from './derivation-routing.module';
import { DerivationComponent } from './derivation/derivation.component';


@NgModule({
  declarations: [
    DerivationComponent
  ],
  imports: [
    CommonModule,
    DerivationRoutingModule,
    FormsModule
  ]
})
export class DerivationModule { }
