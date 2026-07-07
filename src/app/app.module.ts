import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ScientificComponent } from './components/scientific/scientific.component';
import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';
import { SideMenuComponent } from './core/layout/side-menu/side-menu.component';



@NgModule({
  declarations: [
    AppComponent,
    TopMenuComponent,
    ScientificComponent,
    MainLayoutComponent,
    SideMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
