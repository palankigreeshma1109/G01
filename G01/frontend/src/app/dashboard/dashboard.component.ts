import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  successMessage: string = '';
  userData: any = null; // Variable to store the user data

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.successMessage = 'Logged in successfully. Welcome to the dashboard.';

      // Fetch user data using the token from the AuthService
      this.authService.fetchUserData().subscribe((data) => {
        if (data) {
          this.userData = data; // Store the fetched user data
        } else {
          this.successMessage = 'Failed to fetch user data. Please try again.';
        }
      });
    } else {
      this.successMessage = 'User is not logged in.';
    }
  }
}
