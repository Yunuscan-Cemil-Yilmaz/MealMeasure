import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { UtilsModule } from '../utils/utils.module';
import { InsightComponent } from './insight/insight.component';



@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    InsightComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    UtilsModule,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    InsightComponent
  ]
})
export class AuthicencationModule { }
