import { Component, OnInit} from '@angular/core';
import {Router} from '@angular/router'
import { AuthService } from '../services/authicencation.service';

@Component({
  selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
  export class LoginComponent implements OnInit {
    isPasswordVisible: boolean = false;
    
    constructor(private router: Router,private authService: AuthService) { }

    ngOnInit(): void {
    }

    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
      const passwordInput = document.querySelector('.login-password-input') as HTMLInputElement;
      if (passwordInput) {
        passwordInput.type = this.isPasswordVisible ? 'text' : 'password';
      } 
    }
    onSave() {
      console.log('loggg');
    }

    email:string= '';
    password:string='';
    
    submit(){
      this.authService.login(this.email,this.password);
    }

    goToSignUp(){
      this.router.navigate(['/register'])
    }
    
  }