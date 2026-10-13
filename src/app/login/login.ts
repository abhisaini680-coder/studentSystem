import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface StudentLoginRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: string;
  password?: string;
}

interface LoginResponse {
  user?: {
    id?: number;
    name?: string;
    email?: string;
    role?: string;
    phone?: string;
    course?: string;
  };
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
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
  private readonly studentsApiUrl = '/api/Students';
  private readonly userApiUrl = '/api/User';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(): void {

    this.message = '';

    this.email = this.email.trim();

    if (!this.email) {
      this.message = 'Please enter your email.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.message = 'Please enter a valid email address.';
      return;
    }

    if (!this.password) {
      this.message = 'Please enter your password.';
      return;
    }

    this.loading = true;

    this.http.get<StudentLoginRecord[]>(this.studentsApiUrl).subscribe({
      next: (students) => {
        const student = students.find(
          item => item.email.toLowerCase() === this.email.toLowerCase()
        );

        if (student) {
          if (student.password !== this.password) {
            this.finishLogin('Incorrect email or password. Please try again.');
            return;
          }

          this.saveSession({
            id: student.id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            course: student.course,
            role: 'user'
          });
          this.router.navigate(['/user/dashboard']);
          return;
        }

        this.loginAdmin();
      },
      error: () => this.loginAdmin()
    });
  }

  private loginAdmin(): void {
    this.http.post<LoginResponse>(`${this.userApiUrl}/Login`, {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        const user = response.user;

        if (user?.role?.toLowerCase() !== 'admin') {
          this.finishLogin('Only students added by an administrator can log in.');
          return;
        }

        this.saveSession(user);
        this.router.navigate(['/admin/dashboard']);
      },
      error: (error) => {
        this.finishLogin(
          error.status === 0
            ? 'Cannot connect to the server. Please try again later.'
            : 'Incorrect email or password. Please try again.'
        );
      }
    });
  }

  private saveSession(user: object): void {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', (user as { role?: string }).role || 'user');
    localStorage.setItem('user', JSON.stringify(user));
    this.loading = false;
  }

  private finishLogin(message: string): void {
    this.loading = false;
    this.message = message;
  }
}