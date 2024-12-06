import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionTimeoutService {
  constructor(private router: Router) {}

  // Method to logout user
  public logout() {
    localStorage.removeItem('jwtToken'); // Optionally remove the authentication token
    this.router.navigate(['/login']); // Navigate to the login page
  }
}
