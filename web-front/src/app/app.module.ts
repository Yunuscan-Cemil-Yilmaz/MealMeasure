import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthicencationModule } from './authicencation/authicencation.module';
import { DietsModule } from './diets/diets.module';
import { MealsModule } from './meals/meals.module';
import { SharedModule } from './shared/shared.module';
import { UtilsModule } from './utils/utils.module';
import { HubModule } from './hub/hub.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HubModule,
    AuthicencationModule,
    DietsModule,
    MealsModule,
    SharedModule,
    UtilsModule,

    BrowserModule,
    AppRoutingModule,
    HttpClientModule    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
