import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/authicencation/services/authicencation.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  firstName: string = '';
  lastName: string = '';
  nickname: string = '';
  email: string = '';
  userBmi: number = 0;
  userTdee: number = 0;
  isEditing: boolean = false;

  constructor(private router: Router,private authService:AuthService) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.firstName = user.user_name || '';
    this.lastName = user.user_surname || '';
    this.nickname = user.user_nickname || '';
    this.email = user.user_email || '';

    this.userBmi = Math.round((user.user_bmi ?? 0) * 100) / 100;
    this.userTdee = Math.round((user.user_tdee ?? 0) * 100) / 100;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    user.user_name = this.firstName;
    user.user_surname = this.lastName;
    user.user_nickname = this.nickname;

    localStorage.setItem('user', JSON.stringify(user));

    this.isEditing = false;
    this.authService.updateUserInfo(user.user_name,user.user_surname,user.user_nickname)
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToInsight() {
    this.router.navigate(['/insight']);
  }

  onFirstNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.firstName = input?.value || '';
  }

  onLastNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.lastName = input?.value || '';
  }

  onNickNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.nickname = input?.value || '';
  }

}
