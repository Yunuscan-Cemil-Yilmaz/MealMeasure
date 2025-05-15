import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

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
  selectDay(day: number) {
    this.selectedDay = day;
    const choosedDay = day >= 10 ? String(day) : String(`0${day}`); 
    const choosedYear = this.selectedYear;
    const choosedMonth = this.numberOfSelectedMonth >= 10 ? this.numberOfSelectedMonth : `0${this.numberOfSelectedMonth}`
    this.selectedDateString = `${choosedYear}-${choosedMonth}-${choosedDay}`
    console.log(this.selectedDateString);
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
  

  constructor(private router:Router) { }

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

}
