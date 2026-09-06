import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: string;
}

type ApiStudent = Partial<Student> & {
  Id?: number;
  Name?: string;
  Email?: string;
  Phone?: string;
  Course?: string;
};

type StudentResponse =
  | ApiStudent[]
  | { data?: ApiStudent[]; $values?: ApiStudent[] };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html'
})
export class Dashboard implements OnInit {

  private apiUrl = '/api';
  private platformId = inject(PLATFORM_ID);

  user: any = null;

  totalStudents = 0;
  totalCourses = 0;
  totalAttendance = 0;
  totalResults = 0;

  recentStudents: Student[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
  //  this.loadUser();
    if (isPlatformBrowser(this.platformId)) {
      this.loadStudents();
    }
  ///  this.loadCourses();
  ///  this.loadAttendance();
 //   this.loadResults();
  }

  // LOAD LOGGED-IN USER
  loadUser(): void {
debugger;
    if (typeof window === 'undefined') {
      return;
    }

    const savedUser = localStorage.getItem('user');

    if (savedUser) {

      try {
        this.user = JSON.parse(savedUser);
      } catch {
        this.user = null;
      }

    }
  }

  // LOAD STUDENTS
  loadStudents(): void {
    this.http.get<StudentResponse>(
      `${this.apiUrl}/Students`
    ).subscribe({

      next: (data) => {
        const rawStudents = Array.isArray(data)
          ? data
          : data.data ?? data.$values ?? [];
debugger
        const students: Student[] = rawStudents.map((student) => ({
          id: student.id ?? student.Id ?? 0,
          name: student.name ?? student.Name ?? '',
          email: student.email ?? student.Email ?? '',
          phone: student.phone ?? student.Phone ?? '',
          course: student.course ?? student.Course ?? ''
        }));

        this.totalStudents = students.length;

        this.recentStudents = students;
         
      },

      error: (error) => {
debugger
        console.error('Students API error:', error);

        this.totalStudents = 0;
        this.recentStudents = [];
      }

    });
  }

  // LOAD COURSES
  loadCourses(): void {

    this.http.get<any[]>(
      `${this.apiUrl}/Courses`
    ).subscribe({

      next: (data) => {

        this.totalCourses = data.length;
      },

      error: (error) => {

        console.error('Courses API error:', error);

        this.totalCourses = 0;
      }

    });
  }

  // LOAD ATTENDANCE
  loadAttendance(): void {

    this.http.get<any[]>(
      `${this.apiUrl}/Attendance`
    ).subscribe({

      next: (data) => {

        this.totalAttendance = data.length;
      },

      error: (error) => {

        console.error('Attendance API error:', error);

        this.totalAttendance = 0;
      }

    });
  }

  // LOAD RESULTS
  loadResults(): void {

    this.http.get<any[]>(
      `${this.apiUrl}/Results`
    ).subscribe({

      next: (data) => {

        this.totalResults = data.length;
      },

      error: (error) => {

        console.error('Results API error:', error);

        this.totalResults = 0;
      }

    });
  }
}