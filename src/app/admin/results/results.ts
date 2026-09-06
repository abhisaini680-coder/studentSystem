import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Result {
  id: number;
  studentId: number;
  studentName: string;
  course: string;
  subject: string;
  marks: number;
  grade: string;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './results.html'
})
export class Results implements OnInit {

  private apiUrl = 'https://localhost:7200/api/Results';

  results: Result[] = [];

  result: Result = {
    id: 0,
    studentId: 0,
    studentName: '',
    course: '',
    subject: '',
    marks: 0,
    grade: ''
  };

  editing = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Automatically load results when page opens
    this.loadResults();
  }

  loadResults(): void {
    this.http.get<Result[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.results = data;
      },
      error: (error) => {
        console.error('Error loading results:', error);
        this.results = [];
      }
    });
  }

  saveResult(): void {

    if (
      !this.result.studentId ||
      !this.result.studentName ||
      !this.result.course ||
      !this.result.subject ||
      this.result.marks < 0 ||
      !this.result.grade
    ) {
      alert('Please fill all fields');
      return;
    }

    if (this.editing) {

      this.http.put<Result>(
        `${this.apiUrl}/${this.result.id}`,
        this.result
      ).subscribe({
        next: () => {
          alert('Result updated successfully');
          this.clearForm();
          this.loadResults();
        },
        error: (error) => {
          console.error('Update error:', error);
          alert('Unable to update result');
        }
      });

    } else {

      const newResult = {
        studentId: this.result.studentId,
        studentName: this.result.studentName,
        course: this.result.course,
        subject: this.result.subject,
        marks: this.result.marks,
        grade: this.result.grade
      };

      this.http.post<Result>(
        this.apiUrl,
        newResult
      ).subscribe({
        next: () => {
          alert('Result added successfully');
          this.clearForm();
          this.loadResults();
        },
        error: (error) => {
          console.error('Add error:', error);
          alert('Unable to add result');
        }
      });
    }
  }

  editResult(item: Result): void {
    this.result = { ...item };
    this.editing = true;
  }

  deleteResult(id: number): void {

    if (!confirm('Are you sure you want to delete this result?')) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        alert('Result deleted successfully');
        this.loadResults();
      },
      error: (error) => {
        console.error('Delete error:', error);
        alert('Unable to delete result');
      }
    });
  }

  clearForm(): void {
    this.result = {
      id: 0,
      studentId: 0,
      studentName: '',
      course: '',
      subject: '',
      marks: 0,
      grade: ''
    };

    this.editing = false;
  }
}