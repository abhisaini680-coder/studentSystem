import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  course: string;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './students.html',
  styleUrls: ['./students.css']
})
export class Students implements OnInit {

  private apiUrl = 'http://localhost:5246/api/Students';

  students: Student[] = [];
  

  student: Student = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    course: ''
  };

  editing = false;

  message = '';
  errorMessage = '';

  constructor(private http: HttpClient) {
    console.log('Students constructor called');
  }

  ngOnInit(): void {
    console.log('================================');
    console.log('Students ngOnInit() CALLED');
    console.log('================================');

    this.loadStudents();
  }

  loadStudents(): void {

    console.log('LOAD STUDENTS STARTED');
    console.log('API URL:', this.apiUrl);

    this.http.get<Student[]>(this.apiUrl).subscribe({

      next: (data) => {

        console.log('================================');
        console.log('STUDENTS API SUCCESS');
        console.log('DATA:', data);
        console.log('NUMBER OF STUDENTS:', data.length);
        console.log('================================');

        this.students = data;

        console.log('students array after assignment:', this.students);
      },

      error: (error) => {

        console.error('================================');
        console.error('STUDENTS API ERROR');
        console.error(error);
        console.error('STATUS:', error.status);
        console.error('MESSAGE:', error.message);
        console.error('ERROR:', error.error);
        console.error('================================');

        this.errorMessage =
          'Unable to load students. Check browser console.';
      },

      complete: () => {
        console.log('Students API request completed');
      }

    });
  }

  saveStudent(): void {

    console.log('SAVE STUDENT CALLED');

    if (this.editing) {

      this.http.put(
        `${this.apiUrl}/${this.student.id}`,
        this.student
      ).subscribe({

        next: () => {
          console.log('Student updated');
          this.message = 'Student updated successfully';
          this.clearForm();
          this.loadStudents();
        },

        error: (error) => {
          console.error('UPDATE ERROR:', error);
        }

      });

    } else {

      this.http.post(
        this.apiUrl,
        this.student
      ).subscribe({

        next: () => {
          console.log('Student added');
          this.message = 'Student added successfully';
          this.clearForm();
          this.loadStudents();
        },

        error: (error) => {
          console.error('ADD ERROR:', error);
        }

      });
    }
  }

  editStudent(item: Student): void {

    console.log('EDIT STUDENT:', item);

    this.student = {
      id: item.id,
      name: item.name,
      email: item.email,
      phone: item.phone,
      course: item.course
    };

    this.editing = true;
  }

  deleteStudent(id: number): void {

    console.log('DELETE STUDENT:', id);

    if (!confirm('Are you sure you want to delete this student?')) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({

      next: () => {
        console.log('Student deleted');
        this.loadStudents();
      },

      error: (error) => {
        console.error('DELETE ERROR:', error);
      }

    });
  }

  clearForm(): void {

    this.student = {
      id: 0,
      name: '',
      email: '',
      phone: '',
      course: ''
    };

    this.editing = false;
  }
}