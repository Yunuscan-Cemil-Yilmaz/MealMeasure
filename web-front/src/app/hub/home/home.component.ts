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

  selectDay(day: number) {
  this.selectedDay = day;
  }

  goToSettings() {
    this.router.navigate(['/settings']);
  }
  

  constructor(private router:Router) { }

  ngOnInit(): void {
    const totalDaysInMonth = 31; 
    this.days = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);
  }

}
