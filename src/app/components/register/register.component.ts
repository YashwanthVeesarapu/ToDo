import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/User';
import { CommonModule } from '@angular/common';
import { take } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  authenticated = false;
  loginForm!: FormGroup;

  // all timezones
  timezones = [
    'America/Los_Angeles',
    'America/Chicago',
    'America/Toronto',
    'America/New_York',
    'America/Mexico_City',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Pacific/Auckland',
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authService.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        // User is already authenticated; redirect to home.
        this.router.navigate(['/']);
      }
    });

    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      timezone: [
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        [Validators.required],
      ],
      password: ['', [Validators.required, Validators.minLength(4)]],
      cpassword: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    if (
      this.formControls['password'].value !==
      this.formControls['cpassword'].value
    ) {
      alert('Passwords do not match');
      return;
    }

    const user: User = {
      username: this.loginForm.controls['username'].value,
      password: this.formControls['password'].value,
      timezone: this.formControls['timezone'].value,
      email: this.formControls['email'].value,
      firstName: this.formControls['firstName'].value,
      lastName: this.formControls['lastName'].value,
    };

    this.authService.register(user).subscribe(
      (u) => {
        if (u.accessToken && u.username && u.id && u.email) {
          localStorage.setItem('uid', u.id);

          this.router.navigate(['/']);
        }
      },
      (error) => {
        alert(error.error);
      }
    );
  }
}
