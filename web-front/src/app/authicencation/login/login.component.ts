import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router'
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/authicencation.service';

@Component({
  selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
  })
  export class LoginComponent implements OnInit {
    isPasswordVisible: boolean = false;
    
    constructor(private router: Router, private http: HttpClient,private authService: AuthService) { }

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