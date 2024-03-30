import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { User } from '../../models/User';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  authenticated = false;
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Check if user is already authenticated
    this.authenticated = this.authService.isAuthenticated();

    if (this.authenticated) {
      // User is already authenticated, redirect to another route
      this.router.navigate(['/']);
    }

    this.initForm();
  }

  initForm() {
    // Initialize the form
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required, Validators.minLength(4)],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  get formControls() {
    return this.loginForm.controls;
  }

  // Handle form submission
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    const user: User = {
      username: this.loginForm.controls['username'].value,
      password: this.formControls['password'].value,
    };

    this.authService.login(user).subscribe(
      (u) => {
        if (u.accessToken && u.username && u.id) {
          localStorage.setItem('access_token', u.accessToken);
          localStorage.setItem('username', u.username);
          localStorage.setItem('uid', u.id);
          delete u.password;
          localStorage.setItem('user', JSON.stringify(u));
          this.router.navigate(['/']);
        }
      },
      (error) => {
        alert(error.error);
      }
    );
  }
}
