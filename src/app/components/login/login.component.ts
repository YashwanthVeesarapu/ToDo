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
import { UserCredentials } from '../../models/UserCredentials';
import { take } from 'rxjs';

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
    // this.authService.user$.pipe(take(1)).subscribe((user) => {
    //   if (user) {
    //     // User is already authenticated; redirect to home.
    //     this.router.navigate(['/']);
    //   }
    // });
    this.initForm();
  }

  initForm() {
    // Initialize the form
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
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

    const userCredentials: UserCredentials = {
      username: this.loginForm.controls['username'].value,
      password: this.formControls['password'].value,
    };

    this.authService.login(userCredentials).subscribe({
      next: (user) => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Invalid username or password');
      },
    });
  }
}
