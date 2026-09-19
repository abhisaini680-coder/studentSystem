import {
  CommonModule,
  DatePipe
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

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-user-attendance',

  standalone: true,

  imports: [
    CommonModule,
    DatePipe
  ],

  templateUrl: './attendance.html'
})
export class UserAttendance implements OnInit {

  private apiUrl =
    '/api/Attendance';

  attendanceList: AttendanceRecord[] = [];

  constructor(
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Automatically load attendance
    // when the page opens
    this.loadAttendance();
  }

  loadAttendance(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const params = new HttpParams().set('studentId', String(user.id || 0));

    console.log(
      'Loading attendance from:',
      this.apiUrl
    );

    this.http.get<AttendanceRecord[]>(
      this.apiUrl,
      { params }
    ).subscribe({

      next: (data) => {

        console.log(
          'Attendance received:',
          data
        );

        this.attendanceList = data;
        this.changeDetector.markForCheck();
      },

      error: (error) => {

        console.error(
          'Attendance API error:',
          error
        );

        this.attendanceList = [];
        this.changeDetector.markForCheck();
      }

    });
  }
}