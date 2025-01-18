import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.scss',
})
export class ChangepasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    // Initialize the form
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get formControls() {
    return this.changePasswordForm.controls;
  }

  // Handle form submission
  onSubmit() {
    if (this.changePasswordForm.invalid) {
      alert('Please fill in all fields');
      return;
    }

    if (
      this.changePasswordForm.controls['newPassword'].value !==
      this.changePasswordForm.controls['confirmPassword'].value
    ) {
      alert('Passwords do not match');
      return;
    }

    // Add your logic here
    this.userService
      .changePasssword({
        oldPassword: this.changePasswordForm.controls['currentPassword'].value,
        newPassword: this.changePasswordForm.controls['newPassword'].value,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response) {
            alert('Password changed successfully');
            this.router.navigate(['/profile']);
          } else {
            alert('Invalid password');
          }
        },
        error: (error) => {
          console.log(error);
          if (typeof error.error === 'string') {
            alert(error.error);
          } else {
            alert('Error changing password');
          }
        },
      });
  }
}
