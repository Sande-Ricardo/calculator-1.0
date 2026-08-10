import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { StatsRoutingModule } from './stats-routing.module';
import { StatsComponent } from './stats.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StatsComponent
  ],
  imports: [
    CommonModule,
    StatsRoutingModule,
    FormsModule,
    TranslateModule
  ]
})
export class StatsModule { }
