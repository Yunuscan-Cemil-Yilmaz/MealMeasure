import { Component } from '@angular/core';
import { AuthService } from './authicencation/services/authicencation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web-front';
  constructor(private authService:AuthService){}
  ngOnInit(): void{
    this.authService.checkSession();
  }
  
}
