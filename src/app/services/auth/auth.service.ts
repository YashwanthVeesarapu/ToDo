import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, shareReplay, tap } from 'rxjs/operators';

import { User } from '../../models/User';
import { UserCredentials } from '../../models/UserCredentials';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /** Get the current user on app startup */
  getCurrentUser(): Observable<User | null> {
    if (this.userSubject.value && !this.loadingSubject.value) return this.user$; // Return cached state

    this.loadingSubject.next(true); // Start loading indicator

    return this.http
      .get<User>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(
        tap((user) => this.userSubject.next(user)),
        catchError(() => {
          this.userSubject.next(null);
          return of(null);
        }),
        finalize(() => this.loadingSubject.next(false)),
        shareReplay(1) // Cache response for multiple subscribers
      );
  }

  /** Login user and update state */
  login(credentials: UserCredentials): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(tap((user) => this.userSubject.next(user)));
  }

  /** Register new user */
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }

  /** Logout user and clear state */
  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.userSubject.next(null);
        }) // Clear user state only after successful logout
      )
      .subscribe();
  }
}
