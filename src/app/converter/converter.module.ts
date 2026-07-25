import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConverterRoutingModule } from './converter-routing.module';
import { ConverterComponent } from './converter.component';
import { ConverterPanelsComponent } from './components/converter-panels/converter-panels.component';
import { ConverterSidebarComponent } from './components/converter-sidebar/converter-sidebar.component';
import { DimensionalInspectorComponent } from './components/dimensional-inspector/dimensional-inspector.component';
import { PhysicalConstantsComponent } from './components/physical-constants/physical-constants.component';
import { SiPrefixesComponent } from './components/si-prefixes/si-prefixes.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

@NgModule({
  declarations: [
    ConverterComponent,
    ConverterPanelsComponent,
    ConverterSidebarComponent,
    DimensionalInspectorComponent,
    PhysicalConstantsComponent,
    SiPrefixesComponent,
    FavoritesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ConverterRoutingModule
  ]
})
export class ConverterModule { }
