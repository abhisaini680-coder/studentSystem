import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './dashboard.html'
})
export class UserDashboard implements OnInit {

  private platformId = inject(PLATFORM_ID);

  private apiUrl = 'https://localhost:7200/api';

  user: any = null;

  // Dashboard counts
  totalCourses = 0;
  totalAttendance = 0;
  totalResults = 0;
  totalNotices = 0;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    // Load logged-in student
    this.loadUser();

    // Automatically load dashboard data
    this.loadCourses();
    this.loadAttendance();
    this.loadResults();
    this.loadNotices();
  }


  // ==========================================
  // LOAD USER
  // ==========================================

  loadUser(): void {

    // Prevent localStorage error during SSR
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      this.user = null;
      return;
    }

    try {

      this.user = JSON.parse(savedUser);

      console.log(
        'Logged-in student:',
        this.user
      );

    } catch (error) {

      console.error(
        'Error reading user:',
        error
      );

      this.user = null;
    }
  }


  // ==========================================
  // LOAD COURSES
  // ==========================================

  loadCourses(): void {

    this.http.get<any[]>(
      `${this.apiUrl}/Courses`
    ).subscribe({

      next: (data) => {

        console.log(
          'Courses:',
          data
        );

        this.totalCourses = data.length;

      },

      error: (error) => {

        console.error(
          'Courses API error:',
          error
        );

        this.totalCourses = 0;

      }

    });
  }


  // ==========================================
  // LOAD ATTENDANCE
  // ==========================================

  loadAttendance(): void {

    this.http.get<any[]>(
      `${this.apiUrl}/Attendance`
    ).subscribe({

      next: (data) => {

        console.log(
          'Attendance:',
          data
        );

        /*
         * This is the total number of attendance
         * records currently in the database.
         */
        this.totalAttendance = data.length;

      },

      error: (error) => {

        console.error(
          'Attendance API error:',
          error
        );

        this.totalAttendance = 0;

      }

    });
  }


  // ==========================================
  // LOAD RESULTS
  // ==========================================

  loadResults(): void {

    this.http.get<any[]>(
      `${this.apiUrl}/Results`
    ).subscribe({

      next: (data) => {

        console.log(
          'Results:',
          data
        );

        this.totalResults = data.length;

      },

      error: (error) => {

        console.error(
          'Results API error:',
          error
        );

        this.totalResults = 0;

      }

    });
  }


  // ==========================================
  // LOAD NOTICES
  // ==========================================

  loadNotices(): void {

    this.http.get<any[]>(
      `${this.apiUrl}/Notices`
    ).subscribe({

      next: (data) => {

        console.log(
          'Notices:',
          data
        );

        this.totalNotices = data.length;

      },

      error: (error) => {

        console.error(
          'Notices API error:',
          error
        );

        this.totalNotices = 0;

      }

    });
  }
}