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

    insightSend(
        gender: string,
        age: string,
        weightKg: string,
        heightCm: string,
        activityFactor: string
      ) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
      
        const headers = {
          'auth_token': token || '',
          'sender_id': String(user.user_id) || '',
          'sender_email': String(user.user_email) || ''
        };
      
        const body = {
          gender,
          age: Number(age),
          weight: Number(weightKg),
          height: Number(heightCm),
          activity_factor: Number(activityFactor)
        };
      
        return this.http.post(`${environment.API_URL}${environment.API_INSIGHT}`, body, { headers }).subscribe({
          next: (res: any) => {
            console.log("insight success:", res);
      
            if (res.status === 'success') {
              user.user_bmi = res.user_bmi ?? null;
              user.user_tdee = res.user_tdee ?? null;
              user.is_completed = true;
      
              localStorage.setItem('user', JSON.stringify(user));
      
              alert('insight info saved');
              window.location.reload();
            }
          },
          error: (err) => {
            console.error("mistake accured:", err);
            alert("mistake accured");
          }
        });
      }
      updateUserInfo(name: string, surname: string, nickname: string) {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
      
        const headers = {
          'auth_token': token || '',
          'sender_id': String(user.user_id),
          'sender_email': String(user.user_email),
        };
      
        const body = {
          user_name: name,
          user_surname: surname,
          user_nickname: nickname
        };
      
        return this.http.post(`${environment.API_URL}${environment.API_SETTINGS}`, body, { headers }).subscribe({
            next: (res: any) => {
                
                user.user_name= res.user.user_name ?? null;
                user.user_surname = res.user.user_surname ?? null;
                user.user_nickname = res.user.user_nickname ?? null;
        
                localStorage.setItem('user', JSON.stringify(user));
                
        
                alert('settings info saved');
            },
            error: (err) => {
              console.error("mistake accured:", err);
              alert("mistake accured");
            }
          
                
                
        });
      }                                        

    setLogin(){
    this.isloggedInSubject.next(true);
    }
      
      
}