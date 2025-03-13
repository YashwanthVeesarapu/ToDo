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
  // private jwtToken: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + '/user';
    // this.jwtToken = localStorage.getItem('access_token') || '';
  }

  editUser(user: User) {
    return this.http.put(this.apiUrl + '/update', user, {
      withCredentials: true,
    });
  }

  changePasssword(data: ChangePassword) {
    return this.http.post(this.apiUrl + '/change-password', data, {
      withCredentials: true,
    });
  }

  getUser() {
    return this.http.get(this.apiUrl, {
      withCredentials: true,
    });
  }
}
