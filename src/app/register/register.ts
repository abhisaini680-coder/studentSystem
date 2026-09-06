import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

interface Course {
  id: number;
  name: string;
  code: string;
  duration: string;
  description: string;
}

@Component({
  selector: 'app-register',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './register.html'
})
export class Register implements OnInit {

  // ==========================================
  // API URLS
  // ==========================================

  private userApiUrl =
    'https://localhost:7200/api/User';

  private courseApiUrl =
    'https://localhost:7200/api/Courses';


  // ==========================================
  // REGISTER FIELDS
  // ==========================================

  name = '';

  email = '';

  password = '';

  confirmPassword = '';

  phone = '';

  course = '';


  // ==========================================
  // COURSES FROM ADMIN
  // ==========================================

  courses: Course[] = [];

  loadingCourses = true;


  // ==========================================
  // MESSAGES
  // ==========================================

  message = '';

  errorMessage = '';

  loading = false;


  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  // ==========================================
  // PAGE LOAD
  // ==========================================

  ngOnInit(): void {

    // Load only courses created by Admin
    this.loadCourses();

  }


  // ==========================================
  // LOAD COURSES FROM DATABASE
  // ==========================================

  loadCourses(): void {

    this.loadingCourses = true;

    console.log(
      'Loading courses from:',
      this.courseApiUrl
    );

    this.http.get<Course[]>(
      this.courseApiUrl
    ).subscribe({

      next: (data) => {

        console.log(
          'Courses received:',
          data
        );

        this.courses = data;

        this.loadingCourses = false;

      },

      error: (error) => {

        console.error(
          'Error loading courses:',
          error
        );

        this.courses = [];

        this.loadingCourses = false;

        this.errorMessage =
          'Unable to load courses. Please try again later.';
      }

    });
  }


  // ==========================================
  // REGISTER
  // ==========================================

  register(): void {

    this.message = '';

    this.errorMessage = '';


    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !this.name.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.confirmPassword ||
      !this.phone.trim() ||
      !this.course
    ) {

      this.errorMessage =
        'Please fill all fields.';

      return;
    }


    // PASSWORD CHECK

    if (
      this.password !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }


    // PHONE CHECK

    const phonePattern =
      /^[0-9]{10}$/;

    if (
      !phonePattern.test(
        this.phone.trim()
      )
    ) {

      this.errorMessage =
        'Please enter a valid 10-digit phone number.';

      return;
    }


    // ==========================================
    // CHECK SELECTED COURSE
    // ==========================================

    const selectedCourse =
      this.courses.find(
        c => c.name === this.course
      );

    if (!selectedCourse) {

      this.errorMessage =
        'Please select a valid course from the list.';

      return;
    }


    // ==========================================
    // REGISTER DATA
    // ==========================================

    const userData = {

      name: this.name.trim(),

      email: this.email.trim(),

      password: this.password,

      phone: this.phone.trim(),

      course: selectedCourse.name

    };


    console.log(
      'Registering user:',
      userData
    );


    this.loading = true;


    // ==========================================
    // API CALL
    // ==========================================

    this.http.post<any>(
      `${this.userApiUrl}/Register`,
      userData
    ).subscribe({

      next: (response) => {

        console.log(
          'Registration successful:',
          response
        );

        this.loading = false;

        this.message =
          response?.message ||
          'Account created successfully.';


        // ======================================
        // CLEAR FORM
        // ======================================

        this.name = '';

        this.email = '';

        this.password = '';

        this.confirmPassword = '';

        this.phone = '';

        this.course = '';


        // ======================================
        // GO TO LOGIN
        // ======================================

        setTimeout(() => {

          this.router.navigate([
            '/login'
          ]);

        }, 1200);

      },

      error: (error) => {

        console.error(
          'Registration error:',
          error
        );

        this.loading = false;


        if (
          error?.error?.message
        ) {

          this.errorMessage =
            error.error.message;

        } else if (
          error?.status === 0
        ) {

          this.errorMessage =
            'Unable to connect to the server. Make sure .NET API is running.';

        } else {

          this.errorMessage =
            'Unable to create account.';
        }

      }

    });
  }
}