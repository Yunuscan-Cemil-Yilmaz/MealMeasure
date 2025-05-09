import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { environment } from "src/environments/environment"
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService{

    private isloggedInSubject = new BehaviorSubject<boolean>(false);
    isLoggedIn$ = this.isloggedInSubject.asObservable();   //the dolar sign for observable  !note me

    constructor(private http : HttpClient, private router: Router){}

    login(email:string,password:string){
       return this.http.post(`${environment.API_URL}${environment.API_LOGIN}`,{email,password}).subscribe({
            next: (res:any) => {
                if(res.token && res.user){
                    localStorage.setItem('token',res.token);
                    localStorage.setItem('user',JSON.stringify(res.user));
                    this.isloggedInSubject.next(true);  
                    this.router.navigate([`${environment.API_HOME}`])
                    }
                else{
                    alert("not a valid login");
                }
            },
            error: (err) => {
                console.error("login error",err);
                alert("login failed")
            }
       });
    }

    logout(){
        localStorage.clear();
        this.isloggedInSubject.next(false);
    }
    
    checkSession(){
        const token = localStorage.getItem('token')
        if(token) this.isloggedInSubject.next(true);
    }
}