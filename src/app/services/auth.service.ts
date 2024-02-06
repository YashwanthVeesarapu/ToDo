import { Injectable } from '@angular/core';
import { User } from '../User';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ConfigService } from './config.service';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = configService.apiUrl + 'auth';
  }

  login(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('uid');
    localStorage.removeItem('username');
  }
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !jwtHelper.isTokenExpired(token || '');
  }
}
