import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, startWith } from 'rxjs';

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
  private destroyRef = inject(DestroyRef);
  private changeDetector = inject(ChangeDetectorRef);

  private apiUrl = '/api';

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
    if (isPlatformBrowser(this.platformId)) {
      this.loadUser();
      interval(30000)
        .pipe(
          startWith(0),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe(() => this.loadDashboardData());
    }
  }

  private loadDashboardData(): void {
    this.loadCourses();
    this.loadAttendance();
    this.loadResults();
    this.loadNotices();
  }

  private getStudentParams(): HttpParams {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return new HttpParams().set('studentId', String(user.id || 0));
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
        this.changeDetector.markForCheck();

      },

      error: (error) => {

        console.error(
          'Courses API error:',
          error
        );

        this.totalCourses = 0;
        this.changeDetector.markForCheck();

      }

    });
  }


  // ==========================================
  // LOAD ATTENDANCE
  // ==========================================

  loadAttendance(): void {

    this.http.get<any[]>(
      `${this.apiUrl}/Attendance`,
      { params: this.getStudentParams() }
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
        this.changeDetector.markForCheck();

      },

      error: (error) => {

        console.error(
          'Attendance API error:',
          error
        );

        this.totalAttendance = 0;
        this.changeDetector.markForCheck();

      }

    });
  }


  // ==========================================
  // LOAD RESULTS
  // ==========================================

  loadResults(): void {

    this.http.get<any[]>(
      `${this.apiUrl}/Results`,
      { params: this.getStudentParams() }
    ).subscribe({

      next: (data) => {

        console.log(
          'Results:',
          data
        );

        this.totalResults = data.length;
        this.changeDetector.markForCheck();

      },

      error: (error) => {

        console.error(
          'Results API error:',
          error
        );

        this.totalResults = 0;
        this.changeDetector.markForCheck();

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
        this.changeDetector.markForCheck();

      },

      error: (error) => {

        console.error(
          'Notices API error:',
          error
        );

        this.totalNotices = 0;
        this.changeDetector.markForCheck();

      }

    });
  }
}