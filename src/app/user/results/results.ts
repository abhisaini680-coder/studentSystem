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
import { HttpParams } from '@angular/common/http';

interface ResultRecord {
  id: number;
  studentId: number;
  studentName: string;
  course: string;
  subject: string;
  marks: number;
  grade: string;
}

@Component({
  selector: 'app-user-results',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './results.html'
})
export class UserResults implements OnInit {

  private apiUrl =
    '/api/Results';

  results: ResultRecord[] = [];

  constructor(
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Automatically load results
    // when the page opens
    this.loadResults();
  }

  loadResults(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const params = new HttpParams().set('studentId', String(user.id || 0));

    console.log(
      'Loading results from:',
      this.apiUrl
    );

    this.http.get<ResultRecord[]>(
      this.apiUrl,
      { params }
    ).subscribe({

      next: (data) => {

        console.log(
          'Results received:',
          data
        );

        this.results = data;
        this.changeDetector.markForCheck();
      },

      error: (error) => {

        console.error(
          'Results API error:',
          error
        );

        this.results = [];
        this.changeDetector.markForCheck();
      }

    });
  }
}