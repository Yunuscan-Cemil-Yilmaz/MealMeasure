import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authicencation/login/login.component';
import { RegisterComponent } from './authicencation/register/register.component';
import { InsightComponent } from './authicencation/insight/insight.component';
import { HomeComponent } from './hub/home/home.component';
import { SettingsComponent } from './hub/settings/settings.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'register', component: RegisterComponent},
  {path: 'insight', component: InsightComponent},
  {path: 'home', component: HomeComponent},
  {path: 'settings', component: SettingsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
