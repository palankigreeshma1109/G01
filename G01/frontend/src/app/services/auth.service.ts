import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000'; // Base URL of the backend API

  constructor(private http: HttpClient) {}

  // Login method to call backend API
  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
      catchError((error) => {
        console.error('Error during login:', error);
        return of({ error: 'Invalid username or password' });
      })
    );
  }

  // Register method using an object with user details
  register(user: { firstname: string; lastname: string; username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user).pipe(
      catchError((error) => {
        console.error('Error during registration:', error);
        return of({ error: 'Registration failed. Please try again.' });
      })
    );
  }

  // Check if the user is logged in by checking if a token exists in localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  // Method to get the stored JWT token
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // Method to attach the token to outgoing HTTP requests
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Fetch user data (example of an authenticated API call)
  fetchUserData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user-data`, {
      headers: this.getAuthHeaders(),
    }).pipe(
      catchError((error) => {
        console.error('Error fetching user data:', error);
        return of(null);
      })
    );
  }

  // Log out the user by clearing the JWT token from localStorage
  logout(): void {
    localStorage.removeItem('jwtToken');
  }
}
