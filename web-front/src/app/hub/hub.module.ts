import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import { UtilsModule } from '../utils/utils.module';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserModule } from '@angular/platform-browser';



@NgModule({
  declarations: [
    SettingsComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    UtilsModule,
    CommonModule,
    AppRoutingModule,
    BrowserModule
  ],
  exports: [
    SettingsComponent,
    HomeComponent
  ]
})
export class HubModule { }
