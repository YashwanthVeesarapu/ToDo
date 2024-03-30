import { Injectable } from '@angular/core';
import { environment } from '../../../../environment';
import { HttpClient } from '@angular/common/http';

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

  editUser(user: any) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `${this.jwtToken}`,
    };

    return this.http.put(this.apiUrl + 'edit', user, { headers });
  }
}
