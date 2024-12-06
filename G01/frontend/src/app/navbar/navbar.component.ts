import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

    // Handle navigation bar clicks for login, register, and logout
    navigateTo(route: string): void {
      console.log('navigateTo called, checking login state...');
      if (this.authService.isLoggedIn()) {
        console.log('User is logged in, navigating to:', route);
        this.router.navigate([route]); // Allow navigation if logged in
      } else {
        console.log('User is NOT logged in, triggering snackbar.');
        this.showSnackbar('Please log in before accessing other pages.','error');
      }
    }

  // Logout user
  logout(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.logout(); // Clear the token
      this.showSnackbar('You have been logged out.','error');
      this.router.navigate(['/login']); // Redirect to login page
    } else {
      this.showSnackbar('Please log in before logging out.','error');
    }
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    const loggedInStatus = this.authService.isLoggedIn();
    return loggedInStatus;
  }

  // Method to check if the current route matches a given path
  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }

  // Method to show snackbar notifications
  showSnackbar(message: string, type: 'success' | 'error'): void {
    let panelClass = '';

    // Choose the panel class based on the message type
    if (type === 'error') {
      panelClass = 'custom-snackbar-error'; // Use your custom error class
    } else {
      panelClass = 'custom-snackbar-success'; // Use your success class (if needed)
    }

    // Show snackbar with the appropriate message and style
    this.snackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: panelClass, // Apply the correct class here
    });
  }
}
