import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';

interface Subject {
  id: number;
  name: string;
  code: string;
  course: string;
}

@Component({
  selector: 'app-user-subjects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subjects.html'
})
export class Subjects implements OnInit {
  private readonly apiUrl = '/api/Subjects';
  subjects: Subject[] = [];

  constructor(
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const course = String(user.course || '').trim();
    const params = new HttpParams().set('course', course);

    this.http.get<Subject[]>(this.apiUrl, { params }).subscribe({
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
}
