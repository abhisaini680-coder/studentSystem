import {
  CommonModule
} from '@angular/common';

import {
  Component,
  ChangeDetectorRef,
  OnInit
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

interface Course {
  id: number;
  name: string;
  code: string;
  duration: string;
  description: string;
}

@Component({
  selector: 'app-user-courses',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './courses.html'
})
export class Courses implements OnInit {

  private apiUrl =
    '/api/Courses';

  courses: Course[] = [];

  constructor(
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Automatically load courses
    // when the page opens
    this.loadCourses();
  }

  loadCourses(): void {

    console.log(
      'Loading courses from:',
      this.apiUrl
    );

    this.http.get<Course[]>(
      this.apiUrl
    ).subscribe({

      next: (data) => {

        console.log(
          'Courses received:',
          data
        );

        this.courses = data;
        this.changeDetector.markForCheck();
      },

      error: (error) => {

        console.error(
          'Courses API error:',
          error
        );

        this.courses = [];
        this.changeDetector.markForCheck();
      }

    });
  }
}