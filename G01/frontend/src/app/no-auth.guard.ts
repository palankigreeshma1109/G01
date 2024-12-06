import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class NoAuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!this.authService.isLoggedIn()) {
      // If the user is not logged in, allow navigation to login
      return true;
    } else {
      // If already logged in and the user tries to access login route,
      // stay on the current page (do nothing)
      if (state.url === '/login') {
        return false;  // Prevent navigation to login if logged in
      }

      // If the user is logged in and tries to access any other route
      // besides the login page, allow navigation to the current route.
      return true;
    }
  }
}
