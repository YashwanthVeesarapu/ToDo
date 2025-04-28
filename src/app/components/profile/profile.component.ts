import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/User';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    CommonModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  animations: [
    trigger('appear', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.3s ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: User = {};
  notificationMessage: string | null = null;
  notificationType: 'success' | 'error' = 'success';

  timezones = [
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Anchorage', label: 'Alaska Time' },
    { value: 'Pacific/Honolulu', label: 'Hawaii Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
    { value: 'Australia/Sydney', label: 'Sydney' },
    { value: 'Asia/Dubai', label: 'Dubai' },
    { value: 'Asia/Kolkata', label: 'India Standard Time' },
    { value: 'Asia/Shanghai', label: 'Shanghai' },
    { value: 'Asia/Singapore', label: 'Singapore' },
    { value: 'Asia/Hong_Kong', label: 'Hong Kong' },
    { value: 'Asia/Bangkok', label: 'Bangkok' },
    { value: 'Asia/Jakarta', label: 'Jakarta' },
    { value: 'Asia/Kuala_Lumpur', label: 'Kuala Lumpur' },
    { value: 'Asia/Manila', label: 'Manila' },
  ];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      timezone: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe({
      next: (response: User) => {
        this.user = response;
        this.profileForm.patchValue({
          firstName: response.firstName,
          lastName: response.lastName,
          timezone: response.timezone,
        });
      },
      error: (error) => {
        this.showNotification('Failed to load user data', 'error');
      },
    });
  }

  saveProfile(): void {
    if (this.profileForm.valid) {
      const updatedUser: User = {
        ...this.user,
        ...this.profileForm.value,
      };
      this.userService.editUser(updatedUser).subscribe({
        next: (response) => {
          this.user = response;
          this.showNotification('Profile updated successfully', 'success');
        },
        error: (error) => {
          this.showNotification('Failed to update profile', 'error');
        },
      });
    } else {
      this.showNotification('Please fill all required fields', 'error');
    }
  }

  changePassword(): void {
    this.router.navigate(['/change-password']);
  }

  logout(): void {
    this.authService.logout();
    this.showNotification('Logged out successfully', 'success');
    this.router.navigate(['/login']);
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
    });
    setTimeout(() => (this.notificationMessage = null), 5000);
  }

  trackByTimezone(index: number, timezone: any): string {
    return timezone.value;
  }
}
