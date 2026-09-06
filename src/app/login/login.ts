import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html'
})
export class Login {

  email = '';
  password = '';

  message = '';
  loading = false;

  // IMPORTANT
  // Use the same port where your .NET API is running
  apiUrl = 'https://localhost:7200/api/User';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(): void {

    this.message = '';

    if (!this.email || !this.password) {
      this.message = 'Please enter email and password.';
      return;
    }

    this.loading = true;

    const loginData = {
      email: this.email,
      password: this.password
    };

    console.log('Sending login request:', loginData);
    console.log('API:', `${this.apiUrl}/Login`);

    this.http.post<any>(
      `${this.apiUrl}/Login`,
      loginData
    ).subscribe({

      next: (response) => {

        console.log('Login response:', response);

        this.loading = false;

        if (!response || !response.user) {
          this.message = 'Invalid response from server.';
          return;
        }

        const user = response.user;

        // Save login information
        localStorage.setItem(
          'isLoggedIn',
          'true'
        );

        localStorage.setItem(
          'role',
          user.role
        );

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );

        // =========================
        // ADMIN
        // =========================

        if (
          user.role?.toLowerCase() === 'admin'
        ) {

          this.router.navigate(['/admin/dashboard']);

          return;
        }

        // =========================
        // USER
        // =========================

        if (
          user.role?.toLowerCase() === 'user' ||
          user.role?.toLowerCase() === 'customer'
        ) {

          this.router.navigate(['/user/dashboard']);

          return;
        }

        this.message =
          'Unknown user role: ' + user.role;
      },

      error: (error) => {

        console.error('LOGIN ERROR:', error);

        this.loading = false;

        if (error.status === 401) {

          this.message =
            'Invalid email or password.';

        }
        else if (error.status === 0) {

          this.message =
            'Cannot connect to .NET API. Check that the API is running and the port is correct.';

        }
        else {

          this.message =
            error.error?.message ||
            'Login failed. Please try again.';
        }
      }
    });
  }
}