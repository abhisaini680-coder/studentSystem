import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Course {
  id: number;
  name: string;
  code: string;
  duration: string;
  description: string;
}

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './courses.html'
})
export class Courses implements OnInit {

  private apiUrl = 'https://localhost:7200/api/Courses';

  courses: Course[] = [];

  course: Course = {
    id: 0,
    name: '',
    code: '',
    duration: '',
    description: ''
  };

  editing = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Automatically load courses when page opens
    this.loadCourses();
  }

  loadCourses(): void {
    this.http.get<Course[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.courses = [];
      }
    });
  }

  saveCourse(): void {

    if (
      !this.course.name.trim() ||
      !this.course.code.trim() ||
      !this.course.duration.trim()
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (this.editing) {

      this.http.put<Course>(
        `${this.apiUrl}/${this.course.id}`,
        this.course
      ).subscribe({
        next: () => {
          alert('Course updated successfully');
          this.clearForm();
          this.loadCourses();
        },
        error: (error) => {
          console.error('Update error:', error);
          alert('Unable to update course');
        }
      });

    } else {

      const newCourse = {
        name: this.course.name,
        code: this.course.code,
        duration: this.course.duration,
        description: this.course.description
      };

      this.http.post<Course>(
        this.apiUrl,
        newCourse
      ).subscribe({
        next: () => {
          alert('Course added successfully');
          this.clearForm();
          this.loadCourses();
        },
        error: (error) => {
          console.error('Add error:', error);
          alert('Unable to add course');
        }
      });
    }
  }

  editCourse(item: Course): void {
    this.course = { ...item };
    this.editing = true;
  }

  deleteCourse(id: number): void {

    if (!confirm('Are you sure you want to delete this course?')) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        alert('Course deleted successfully');
        this.loadCourses();
      },
      error: (error) => {
        console.error('Delete error:', error);
        alert('Unable to delete course');
      }
    });
  }

  clearForm(): void {
    this.course = {
      id: 0,
      name: '',
      code: '',
      duration: '',
      description: ''
    };

    this.editing = false;
  }
}