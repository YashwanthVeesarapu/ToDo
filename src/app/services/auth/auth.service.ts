import { Injectable } from '@angular/core';
import { User } from '../../models/User';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
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
    return this.http
      .post<User>(this.apiUrl + 'login', user, {
        withCredentials: true,
      })
      .pipe(
        map((response: any) => {
          // localStorage.setItem('access_token', response.accessToken!);
          localStorage.setItem('uid', response.uid);
          // localStorage.setItem('username', response.username!);
          // localStorage.setItem('user', JSON.stringify(response));
          return true;
        }),
        catchError((error) => {
          return of(false); // Return false indicating failed login
        })
      );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl + 'register', user);
  }

  logout() {
    // localStorage.removeItem('access_token');
    localStorage.removeItem('uid');
    // localStorage.removeItem('username');
    // localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    // const token = localStorage.getItem('access_token');
    // const localUser = localStorage.getItem('user');

    const uid = localStorage.getItem('uid');

    if (uid) {
      // const user: User = JSON.parse(localUser);
      // if (!user.id || !user.username) {
      //   return false;
      // }
      return true;

      // check with server
    } else {
      return false;
    }

    // return false;

    // return !jwtHelper.isTokenExpired(token || '');
  }
}
