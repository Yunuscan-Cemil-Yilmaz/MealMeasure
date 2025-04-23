import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button/button.component';
import { InputTextComponent } from './input-text/input-text.component';



@NgModule({
  declarations: [
    ButtonComponent,
    InputTextComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [ButtonComponent,InputTextComponent
  ]
})
export class UtilsModule { }
