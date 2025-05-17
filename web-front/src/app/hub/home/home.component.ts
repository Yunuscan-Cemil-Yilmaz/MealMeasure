import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  stream: MediaStream | null = null;

  days: number[] = [];
  selectedDay: number | null = null;
  selectedMonth: string = "";
  selectedYear: number = 0;
  calculatedMonth: number = 0;
  numberOfSelectedMonth: number = 0;
  calculatedYear: number = 0;
  months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  selectedDateString: string = ""
  mealList: any[] = [];


  cal: string = '';
  isOpenCalArea: boolean = false;
  isOpenConfirmArea: boolean = false;
  isCameraOpen: boolean = false;
  calculatedCal: number = 0

  selectDay(day: number) {
    this.selectedDay = day;
    const choosedDay = day >= 10 ? String(day) : String(`0${day}`); 
    const choosedYear = this.selectedYear;
    const choosedMonth = this.numberOfSelectedMonth >= 10 ? this.numberOfSelectedMonth : `0${this.numberOfSelectedMonth}`
    this.selectedDateString = `${choosedYear}-${choosedMonth}-${choosedDay}`
    console.log(this.selectedDateString);

    const body = {
      'selected_date': this.selectedDateString
    };
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
    const headers = {
      'auth_token': token || '',
      'sender_id': String(user.user_id),
      'sender_email': String(user.user_email),
    };
    this.http.post(`${environment.API_URL}${environment.API_GET_CAL_PER_DAY}`, body, { headers }).subscribe({
      next: (response: any) => {
        this.mealList = response.response;
        console.log(this.mealList)
        console.log(response);
      },
      error: (error: any) => {
        this.mealList = [];
      }
    });
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
  
  constructor(private router:Router, private http: HttpClient, private cdr:ChangeDetectorRef) { }

  ngOnInit(): void {
    const today = new Date();
    this.calculatedMonth = today.getMonth();
    this.calculatedYear = today.getFullYear();
    
    this.selectedYear = this.calculatedYear;
    this.selectedMonth = this.months[this.calculatedMonth];
    this.numberOfSelectedMonth = this.calculatedMonth + 1;
    
    const lastDay = new Date(this.selectedYear, this.calculatedMonth + 1, 0);
    const dayAmount = lastDay.getDate()
    this.days = Array.from({ length: dayAmount }, (_, i) => i + 1);
  }

  nextMonth(){
    if(this.calculatedMonth > 10){ // go next year
      this.calculatedYear++;
      this.selectedYear = this.calculatedYear;
      this.calculatedMonth = 0;
      this.selectedMonth = this.months[this.calculatedMonth];
      this.numberOfSelectedMonth = this.calculatedMonth + 1;
      this.daysLoop();
    }else { // stay this year
      this.calculatedMonth++;
      this.selectedMonth = this.months[this.calculatedMonth];
      this.numberOfSelectedMonth = this.calculatedMonth + 1;
      this.daysLoop();
    }
  }

  prevMonth(){
    if(this.calculatedMonth < 1) { // go prev year
      this.calculatedYear--;
      this.selectedYear = this.calculatedYear;
      this.calculatedMonth = 11;
      this.selectedMonth = this.months[this.calculatedMonth];
      this.numberOfSelectedMonth = this.calculatedMonth + 1;
      this.daysLoop();
    } else { // stay this year
      this.calculatedMonth--
      this.selectedMonth = this.months[this.calculatedMonth];
      this.numberOfSelectedMonth = this.calculatedMonth + 1;
      this.daysLoop();
    }
  }

  daysLoop(){
    const lastDay = new Date(this.selectedYear, this.calculatedMonth + 1, 0);
    const dayAmount = lastDay.getDate()
    this.days = Array.from({ length: dayAmount }, (_, i) => i + 1);
  }

  openCalArea(){
    this.isOpenCalArea = true;
  }
  closeCalArea(){
    this.isOpenCalArea = false;
  }
  openConfirmArea() { 
    console.log('calisti');
    this.isOpenConfirmArea = true;
  }
  closeConfirmArea(){
    this.isOpenConfirmArea = false;
  }

  submit(){
    let input = Number(this.cal);
    if(isNaN(input)){
      alert('Please Enter a Number');
      return;
    }
    const body = {
      'cal_value': input
    };
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
    const headers = {
      'auth_token': token || '',
      'sender_id': String(user.user_id),
      'sender_email': String(user.user_email),
    };
    this.http.post(`${environment.API_URL}${environment.API_ADD_MEAL_WITH_CAL}`, body, { headers }).subscribe({
      next: (response: any) => {
        alert('add meal with successfuly');
        this.closeCalArea();
      }, 
      error: (err) => {
        alert('system error while adding');
        this.closeCalArea();
      }
    })
  }

  openCamera() {
    this.isCameraOpen = true;
  
    setTimeout(() => {
      // Önce arka kamerayı dene
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: 'environment' } }
      }).then(stream => {
        this.stream = stream;
        this.video.nativeElement.srcObject = stream;
      }).catch(err => {
        console.warn('Arka kamera açılamadı, ön kameraya geçiliyor:', err);
  
        // Geri dönüş: ön kameraya geç
        navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        }).then(stream => {
          this.stream = stream;
          this.video.nativeElement.srcObject = stream;
        }).catch(e => {
          console.error('Kamera açılamadı:', e);
        });
      });
    }, 0);
  }

  takePhoto() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');
  
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
  
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    canvas.toBlob(blob => {
      if (!blob) return;
  
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
  
      const headers = {
        'auth_token': token || '',
        'sender_id': String(user.user_id),
        'sender_email': String(user.user_email),
      };
  
      const formData = new FormData();
      formData.append('image', blob, 'photo.jpg');
      console.log(formData);
      this.http.post(`${environment.API_URL}${environment.API_ADD_MEAL_WITH_IMAGE}`, formData, { headers }).subscribe({
        next: (res: any) => {
          alert('✅ YANIT GELDİ');
          console.log('Upload successful', res);
          // ✅ RESPONSE GELDİKTEN SONRA paneli ve kamerayı kapat
          this.stream?.getTracks().forEach(track => track.stop());
          this.isCameraOpen = false;
          this.calculatedCal = Math.round(Number(res.response));
          this.openConfirmArea();
          this.cdr.detectChanges();
        },
        error: err => {
          if (err.status == 501) {
            alert('Are u joking with me ? This is not a meal');
            this.stream?.getTracks().forEach(track => track.stop());
            this.isCameraOpen = false;
            return;
          }
          alert('❌ İSTEK HATA VERDİ veya TARAYICI KESTİ');
          
          // ❌ Hata durumunda da kamerayı durdurmak istersen buraya da ekle:
          this.stream?.getTracks().forEach(track => track.stop());
          this.isCameraOpen = false;
        }
      });
  
    }, 'image/jpeg');
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click(); // Gizli input'u tetikle
  }

  uploadFile(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;
  
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
    const headers = {
      'auth_token': token || '',
      'sender_id': String(user.user_id),
      'sender_email': String(user.user_email),
    };
  
    const formData = new FormData();
    formData.append('image', file);
  
    this.http.post(`${environment.API_URL}${environment.API_ADD_MEAL_WITH_IMAGE}`, formData, { headers }).subscribe({
        next: (res: any) => {
          alert('✅ YANIT GELDİ');
          console.log('Upload successful', res);
          this.calculatedCal = Math.round(Number(res.response));
          this.openConfirmArea();
        },
        error: (err) => {
          if(err.status == 501){
            alert('Are u joking with me ? This is not a meal');
            return;
          }
          alert('❌ İSTEK HATA VERDİ veya TARAYICI KESTİ');
        }
      });
  }

  cancelConfirm(){
    this.calculatedCal = 0;
    this.closeConfirmArea();
  }

  confirmConfirm(){
    let input = this.calculatedCal
    if(isNaN(input) || input === 0){
      alert('Error');
      this.calculatedCal = 0;
      this.closeConfirmArea();
      return;
    }
    const body = {
      'cal_value': input
    };
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
    const headers = {
      'auth_token': token || '',
      'sender_id': String(user.user_id),
      'sender_email': String(user.user_email),
    };
    this.http.post(`${environment.API_URL}${environment.API_ADD_MEAL_WITH_CAL}`, body, { headers }).subscribe({
      next: (response: any) => {
        alert('add meal with successfuly');
        this.closeConfirmArea();
      }, 
      error: (err) => {
        alert('system error while adding');
        this.closeConfirmArea();
      }
    })
  }
}
