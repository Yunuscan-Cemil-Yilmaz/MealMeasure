import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  firstName: string = 'John';
  lastName: string = 'Doe';
  nickname: string = 'johnd';
  email: string = 'john@example.com';
  password: string = 'goddamnpassword';
  maskedPassword: string = '';
  isEditing: boolean = false;
  isPasswordEditing: boolean = false;
  userBmi: number = 22.5;
userTdee: number = 2400;

goToInsight() {
  this.router.navigate(['/insight']);
}


  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateMaskedPassword();
  }

  onChangePassword(){
    this.isPasswordEditing = true
    this.maskedPassword = this.password
  }

  onPasswordToggle() {
    if (this.isPasswordEditing) {
      // Save işlemi
      this.isPasswordEditing = false;
      this.maskedPassword = '•'.repeat(this.password.length);
    } else {
      // Change işlemi
      this.isPasswordEditing = true;
    }
  }

  onPasswordInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.password = input.value;
  }

  updateMaskedPassword() {
    this.maskedPassword = '•'.repeat(this.password.length);
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveChanges() {
    this.isEditing = false;
    console.log('Saved:', {
      firstName: this.firstName,
      lastName: this.lastName,
      nickname: this.nickname
    });
  }

  logout() {
    console.log('Log out clicked');
  }
  onLastNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.lastName = input?.value || '';
  }
  onNickNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.nickname = input?.value || '';
  }
  onFirstNameChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.firstName = input?.value || '';
  }
  
}
