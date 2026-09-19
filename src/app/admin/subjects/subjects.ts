import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Subject {
  id: number;
  name: string;
  code: string;
  course: string;
}

interface Course {
  id: number;
  name: string;
}

@Component({
  selector: 'app-admin-subjects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './subjects.html'
})
export class Subjects implements OnInit {
  private readonly apiUrl = '/api/Subjects';
  private readonly coursesApiUrl = '/api/Courses';
  subjects: Subject[] = [];
  courses: Course[] = [];
  subject: Subject = { id: 0, name: '', code: '', course: '' };
  editing = false;

  constructor(
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadSubjects();
  }

  loadCourses(): void {
    this.http.get<Course[]>(this.coursesApiUrl).subscribe({
      next: (data) => {
        this.courses = data;
        this.changeDetector.markForCheck();
      },
      error: (error) => console.error('Error loading courses:', error)
    });
  }

  loadSubjects(): void {
    this.http.get<Subject[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.subjects = data;
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Error loading subjects:', error);
        this.subjects = [];
        this.changeDetector.markForCheck();
      }
    });
  }

  saveSubject(): void {
    if (!this.subject.name.trim() || !this.subject.code.trim() || !this.subject.course) {
      alert('Please fill all fields');
      return;
    }

    const request = this.editing
      ? this.http.put<Subject>(`${this.apiUrl}/${this.subject.id}`, this.subject)
      : this.http.post<Subject>(this.apiUrl, {
          name: this.subject.name,
          code: this.subject.code,
          course: this.subject.course
        });

    request.subscribe({
      next: () => {
        this.clearForm();
        this.loadSubjects();
      },
      error: (error) => {
        console.error('Subject save error:', error);
        alert(error?.error?.message || 'Unable to save subject');
      }
    });
  }

  editSubject(subject: Subject): void {
    this.subject = { ...subject };
    this.editing = true;
  }

  deleteSubject(id: number): void {
    if (!confirm('Are you sure you want to delete this subject?')) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadSubjects(),
      error: (error) => {
        console.error('Subject delete error:', error);
        alert('Unable to delete subject');
      }
    });
  }

  clearForm(): void {
    this.subject = { id: 0, name: '', code: '', course: '' };
    this.editing = false;
  }
}
