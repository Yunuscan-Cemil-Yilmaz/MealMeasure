import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../authicencation/services/authicencation.service';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private authService: AuthService,private router: Router){}

  canActivate():Observable<boolean> {
    return this.authService.isLoggedIn$.pipe(map(isLoggedIn => {
      if(!isLoggedIn){
        this.router.navigate([`${environment.API_LOGIN}`])
        return false
      }
      else{
        return true
      }
    }))
    
  }
  
}
