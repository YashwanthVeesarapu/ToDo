import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../../environment';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'auth/';
  }

  login(user: User): Observable<boolean> {
    return this.http.post<User>(this.apiUrl + 'login', user).pipe(
      map((response) => {
        localStorage.setItem('access_token', response.accessToken!);
        localStorage.setItem('uid', response.id!);
        localStorage.setItem('username', response.username!);
        localStorage.setItem('user', JSON.stringify(response));
        return true; // Return true indicating successful login
      }),
      catchError((error) => {
        console.log(error);
        return [false]; // Return false indicating failed login
      })
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + 'register', user);
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('uid');
    localStorage.removeItem('username');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');

    const localUser = localStorage.getItem('user');

    if (localUser) {
      const user: User = JSON.parse(localUser);
      if (user.id && user.username) {
        return true;
      }
    } else {
      return false;
    }

    return !jwtHelper.isTokenExpired(token || '');
  }
}
