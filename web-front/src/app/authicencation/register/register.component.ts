import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/authicencation.service';



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
  

  constructor(private router:Router, private http :HttpClient,private authService: AuthService) { }

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

    this.http.post(`${environment.API_URL}${environment.API_REGISTER}`,userData).subscribe({
      next: (res: any) => {
        console.log("Kayıt başarılı", res);
      
        if (res.token && res.user) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.authService.setLogin();
        }
      
        this.router.navigate(['/insight']);
      }
      
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

