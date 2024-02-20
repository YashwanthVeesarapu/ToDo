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

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authenticated = this.authService.isAuthenticated();

    if (this.authenticated) {
      // User is already authenticated, redirect to another route
      this.router.navigate(['/']); // Replace with your desired route
    }

    this.initForm();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
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
    };

    this.authService.register(user).subscribe(
      (u) => {
        if (u.accessToken && u.username && u.id) {
          localStorage.setItem('access_token', u.accessToken);
          localStorage.setItem('username', u.username);
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
