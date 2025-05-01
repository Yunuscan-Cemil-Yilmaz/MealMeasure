import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.scss']
})
export class InsightComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
 }

  age: string = '';
  gender: string = '';
  weight: string = '';
  height: string = '';
  activityLevel: string = '';

  submit(){
    this.router.navigate(['/settings'])
  }


  onGenderChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.gender = select.value;
  }
  
  onActivityLevelChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.activityLevel = select.value;
  }
}
