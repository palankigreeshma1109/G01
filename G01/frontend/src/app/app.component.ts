import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'G01';
  timeoutWarning: boolean = false; // To track whether the session warning should be displayed
  private sessionTimer: any; // Timer for session expiration
  private warningTimer: any; // Timer for warning display
  private activityTimer: any; // Timer for inactivity detection
  private readonly inactivityTimeout: number = 6000000; // 1 minute of inactivity before showing warning
  private readonly redirectTimeout: number = 7000000; // 1 minute 50 seconds of inactivity before redirect

  constructor(private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.startInactivityTimer(); // Start detecting inactivity when the app initializes
    this.listenToUserActivity(); // Listen to user activity events
  }

  ngOnDestroy(): void {
    clearTimeout(this.sessionTimer); // Clear the session timer when the component is destroyed
    clearTimeout(this.warningTimer); // Clear the warning timer when the component is destroyed
    clearTimeout(this.activityTimer); // Clear the inactivity timer when the component is destroyed
  }

  // Start inactivity detection and session timers
  private startInactivityTimer(): void {
    // Reset the activity timer whenever there is user activity
    this.resetInactivityTimer();

    // Show session expiration warning after inactivity for the specified period
    this.warningTimer = setTimeout(() => {
      this.showTimeoutWarning();
    }, this.inactivityTimeout);

    // Redirect to login page after a short delay if there's no activity
    this.sessionTimer = setTimeout(() => {
      this.sessionExpired();
    }, this.redirectTimeout);
  }

  // Listen for user activity events
  private listenToUserActivity(): void {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

    // Reset inactivity timer on any of these events
    events.forEach((event) => {
      window.addEventListener(event, () => this.resetInactivityTimer());
    });
  }

  // Reset the inactivity timer when user activity is detected
  private resetInactivityTimer(): void {
    clearTimeout(this.activityTimer); // Clear any previous inactivity timer
    this.timeoutWarning = false; // Hide the warning if user is active again
    this.startInactivityTimer(); // Restart the inactivity timer
  }

  // Display session expiration warning
  private showTimeoutWarning(): void {
    this.timeoutWarning = true; // Show the warning notification
    console.log('Session has expired. Redirecting soon...');
  }

  // Handle session expiration and redirect to login page
  private sessionExpired(): void {
    console.log('Session expired, redirecting to login...');
    this.timeoutWarning = false; // Hide the warning notification
    localStorage.removeItem('jwtToken'); // Remove the token from localStorage
    this.router.navigate(['/login']); // Redirect to login page
  }

}
