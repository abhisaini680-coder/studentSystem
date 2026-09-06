import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface AttendanceRecord {
  id: number;
  studentId: number;
  studentName: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './attendance.html'
})
export class Attendance implements OnInit {

  private apiUrl = 'https://localhost:7200/api/Attendance';

  attendanceList: AttendanceRecord[] = [];

  attendance: AttendanceRecord = {
    id: 0,
    studentId: 0,
    studentName: '',
    date: '',
    status: 'Present'
  };

  editing = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Automatically load attendance when page opens
    this.loadAttendance();
  }

  loadAttendance(): void {
    this.http.get<AttendanceRecord[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.attendanceList = data;
      },
      error: (error) => {
        console.error('Error loading attendance:', error);
        this.attendanceList = [];
      }
    });
  }

  saveAttendance(): void {

    if (
      !this.attendance.studentId ||
      !this.attendance.studentName ||
      !this.attendance.date ||
      !this.attendance.status
    ) {
      alert('Please fill all fields');
      return;
    }

    if (this.editing) {

      this.http.put<AttendanceRecord>(
        `${this.apiUrl}/${this.attendance.id}`,
        this.attendance
      ).subscribe({
        next: () => {
          alert('Attendance updated successfully');
          this.clearForm();
          this.loadAttendance();
        },
        error: (error) => {
          console.error('Update error:', error);
          alert('Unable to update attendance');
        }
      });

    } else {

      const newAttendance = {
        studentId: this.attendance.studentId,
        studentName: this.attendance.studentName,
        date: this.attendance.date,
        status: this.attendance.status
      };

      this.http.post<AttendanceRecord>(
        this.apiUrl,
        newAttendance
      ).subscribe({
        next: () => {
          alert('Attendance added successfully');
          this.clearForm();
          this.loadAttendance();
        },
        error: (error) => {
          console.error('Add error:', error);
          alert('Unable to add attendance');
        }
      });
    }
  }

  editAttendance(item: AttendanceRecord): void {
    this.attendance = { ...item };
    this.editing = true;
  }

  deleteAttendance(id: number): void {

    if (!confirm('Are you sure you want to delete this attendance record?')) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        alert('Attendance deleted successfully');
        this.loadAttendance();
      },
      error: (error) => {
        console.error('Delete error:', error);
        alert('Unable to delete attendance');
      }
    });
  }

  clearForm(): void {
    this.attendance = {
      id: 0,
      studentId: 0,
      studentName: '',
      date: '',
      status: 'Present'
    };

    this.editing = false;
  }
}