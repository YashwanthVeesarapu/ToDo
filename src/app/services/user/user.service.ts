import { Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/User';

type ChangePassword = {
  oldPassword: string;
  newPassword: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string;
  private jwtToken: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'user/';
    this.jwtToken = localStorage.getItem('access_token') || '';
  }

  editUser(user: User) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `${this.jwtToken}`,
    };

    return this.http.put(this.apiUrl + 'update', user, { headers });
  }

  changePasssword(data: ChangePassword) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `${this.jwtToken}`,
    };
    return this.http.post(this.apiUrl + 'change-password', data, { headers });
  }
}
