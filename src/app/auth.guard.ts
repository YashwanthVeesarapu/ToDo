import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './services/auth/auth.service';
import { Observable, take, map, switchMap, filter, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoading$.pipe(
      // Wait until isLoading$ becomes false
      filter((isLoading) => isLoading === false),
      // Take the first false value
      take(1),
      // Now check the user authentication
      switchMap(() => {
        return this.authService.user$.pipe(
          take(1),
          switchMap((user) => {
            if (user) {
              return of(true); // User is authenticated
            } else {
              this.router.navigate(['/login']);
              return of(false);
            }
          })
        );
      })
    );
  }
}
