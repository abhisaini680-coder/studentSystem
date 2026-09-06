import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  Component,
  OnInit
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

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
    'https://localhost:7200/api/Attendance';

  attendanceList: AttendanceRecord[] = [];

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    // Automatically load attendance
    // when the page opens
    this.loadAttendance();
  }

  loadAttendance(): void {

    console.log(
      'Loading attendance from:',
      this.apiUrl
    );

    this.http.get<AttendanceRecord[]>(
      this.apiUrl
    ).subscribe({

      next: (data) => {

        console.log(
          'Attendance received:',
          data
        );

        this.attendanceList = data;
      },

      error: (error) => {

        console.error(
          'Attendance API error:',
          error
        );

        this.attendanceList = [];
      }

    });
  }
}