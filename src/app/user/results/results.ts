import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

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
    'https://localhost:7200/api/Results';

  results: ResultRecord[] = [];

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    // Automatically load results
    // when the page opens
    this.loadResults();
  }

  loadResults(): void {

    console.log(
      'Loading results from:',
      this.apiUrl
    );

    this.http.get<ResultRecord[]>(
      this.apiUrl
    ).subscribe({

      next: (data) => {

        console.log(
          'Results received:',
          data
        );

        this.results = data;
      },

      error: (error) => {

        console.error(
          'Results API error:',
          error
        );

        this.results = [];
      }

    });
  }
}