import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initialize the login form with required validations
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]], // Username is required
      password: ['', [Validators.required]], // Password is required
    });
  }

  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    // Call the AuthService to validate credentials against the backend
    this.authService.login(username, password).subscribe(
      (response) => {
        if (response.token) {
          // If login is successful, store the token and navigate to the dashboard
          localStorage.setItem('jwtToken', response.token);
          this.loginError = false;
          this.showSnackBar('Login successful!', 'success');
          this.router.navigate(['/dashboard']);
        } else {
          // If login fails, show the error message
          this.loginError = true;
          this.showSnackBar('Invalid username or password.', 'error');
        }
      },
      (error) => {
        this.loginError = true;
        this.showSnackBar('An error occurred during login. Please try again.', 'error');
      }
    );
  }

  // Navigate to the registration page
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  // Show a temporary snack bar message
  showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, '', {
      duration: 1800,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error',
    });
  }
}
