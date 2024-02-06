import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  apiUrl: string;

  constructor() {
    this.apiUrl = 'https://redtodo-91a009c1eda0.herokuapp.com/';
    let dev = false;
    if (window.location.href.includes('localhost')) {
      dev = true;
    }
    dev = false;
    if (dev) {
      this.apiUrl = 'http://localhost:8080/';
    }
  }
}
