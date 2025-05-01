import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  isPasswordVisible: boolean = false;
  isPasswordAgainVisible: boolean = false;

  firstName: string = '';
  lastName: string = '';
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  goToLogIn(){
    this.router.navigate(['/login'])
  }

  submit(): void {

    if (this.password !== this.confirmPassword) {
      console.error("Passwords do not match.");
      return;
    }

  // togglePasswordAgainVisibility(){
  //   const passwordAgainInput = document.querySelector('.register-password-again-input') as HTMLInputElement
  //     if(this.isPasswordAgainVisible == false && passwordAgainInput.type == 'password'){
  //       this.isPasswordAgainVisible = true;
  //       passwordAgainInput.type = 'text';
  //     }else if(this.isPasswordAgainVisible == true && passwordAgainInput.type == 'text'){
  //       this.isPasswordAgainVisible = false;
  //       passwordAgainInput.type = 'password';
  //     } else {
  //       this.isPasswordAgainVisible = false;
  //       passwordAgainInput.type = 'password';
  //     }
  // }

  // togglePasswordVisibility() {
  //   const passwordInput = document.querySelector('.register-password-input') as HTMLInputElement
  //   if(this.isPasswordVisible == false && passwordInput.type == 'password'){
  //     this.isPasswordVisible = true;
  //     passwordInput.type = 'text';
  //   }else if(this.isPasswordVisible == true && passwordInput.type == 'text'){
  //     this.isPasswordVisible = false;
  //     passwordInput.type = 'password';
  //   } else {
  //     this.isPasswordVisible = false;
  //     passwordInput.type = 'password';
  //   }
  // }
  }
}
