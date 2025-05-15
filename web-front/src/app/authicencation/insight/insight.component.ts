import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authicencation.service';

@Component({
  selector: 'app-insight',
  templateUrl: './insight.component.html',
  styleUrls: ['./insight.component.scss']
})
export class InsightComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  age: string = '';
  gender: string = '';
  weight: string = '';
  height: string = '';
  activityLevel: string = '';
  is_completed: boolean = false;

  ngOnInit(): void {
    
  }

  submit(): void {
    this.authService.insightSend(
      this.gender,
      this.age,
      this.weight,
      this.height,
      this.activityLevel
    );

    // is_completed burada localStorage'da set ediliyor, direkt yönlendiriyoruz ufak logic işi
    this.router.navigate(['/settings']);
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
