import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  title: string = 'Taskify';
  @Output() onLogout = new EventEmitter<void>();

  public authService: AuthService;

  constructor(authService: AuthService, private router: Router) {
    this.authService = authService;
  }

  ngOnInit(): void {}

  navigateTo(route: string) {
    // Navigate to the specified route
    this.router.navigate([route]);
  }

  onLogoutClick(): void {
    this.authService.logout();
  }
}
