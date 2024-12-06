import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:3000'; // API endpoint for user data

  constructor(private http: HttpClient) {}

  // Method to get AI adoption data
  getAIAdoptionData(): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    console.log('Token in localStorage for Adoptiondata:', token); // Log the token for debugging

    if (!token) {
      console.error('No token found in local storage for adoptiondata');
      //this.router.navigate(['/login']); // Redirect to login page
      return throwError('User is not authenticated. No token found for adoptiondata.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Sending request to API with token:', token); // Log token for debugging

    // Concatenate '/user-data1' to the base URL (apiUrl) to make the complete URL for the request
  const reporturl = `${this.apiUrl}/user-data2`;

    return this.http.get<any>(reporturl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching diagnostics data for adoptiondata:', error.message);
        return throwError(
          'Failed to fetch diagnostics data. Please try again later for adoptiondata.'
        );
      })
    );
  }
  /**
   * Fetch diagnostic data from the backend.
   * @returns Observable containing the API response.
   */
  getDiagnosticsData(): Observable<any> {
    const token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    console.log('Token in localStorage:', token); // Log the token for debugging

    if (!token) {
      console.error('No token found in local storage');
      //this.router.navigate(['/login']); // Redirect to login page
      return throwError('User is not authenticated. No token found.');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    console.log('Sending request to API with token:', token); // Log token for debugging

    const summaryurl = `${this.apiUrl}/user-data1`;

    return this.http.get<any>(summaryurl, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching diagnostics data:', error.message);
        return throwError(
          'Failed to fetch diagnostics data. Please try again later.'
        );
      })
    );
  }
}
