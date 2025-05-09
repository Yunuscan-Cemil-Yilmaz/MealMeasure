import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


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
  

  constructor(private router:Router, private http :HttpClient) { }

  ngOnInit(): void {
  }

  goToLogIn(){
    this.router.navigate(['/login'])
  }

  submit(): void {
    
    const userData = {
      email: this.email,
      password: this.password,
      passwordAgain: this.confirmPassword,
      name: this.firstName,
      surname: this.lastName,
      nickname: this.username
    };

    this.http.post('http://127.0.0.1:8000/api/register',userData).subscribe({
      next: (res: any) => {
        console.log("successfully sign up",res);
        this.router.navigate(['/insight'])},
      error: (err) => {console.log("something went wrong",err)}
    });
    

  }
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

