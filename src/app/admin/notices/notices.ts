import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Notice {
  id: number;
  title: string;
  description: string;
  date: string | null;
  category: string | null;
}

@Component({
  selector: 'app-notices',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './notices.html'
})
export class Notices implements OnInit {

  private apiUrl = '/api/Notices';

  notices: Notice[] = [];

  notice: Notice = {
    id: 0,
    title: '',
    description: '',
    date: '',
    category: ''
  };

  editing = false;

  constructor(
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Automatically load notices when page opens
    this.loadNotices();
  }

  loadNotices(): void {
    this.http.get<Notice[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.notices = data;
        this.changeDetector.markForCheck();
      },
      error: (error) => {
        console.error('Error loading notices:', error);
        this.notices = [];
        this.changeDetector.markForCheck();
      }
    });
  }

  saveNotice(): void {

    if (
      !this.notice.title.trim() ||
      !this.notice.description.trim()
    ) {
      alert('Please fill Title and Description');
      return;
    }

    if (this.editing) {

      this.http.put<Notice>(
        `${this.apiUrl}/${this.notice.id}`,
        this.notice
      ).subscribe({
        next: () => {
          alert('Notice updated successfully');
          this.clearForm();
          this.loadNotices();
        },
        error: (error) => {
          console.error('Update error:', error);
          alert('Unable to update notice');
        }
      });

    } else {

      const newNotice = {
        title: this.notice.title,
        description: this.notice.description,
        date: this.notice.date || null,
        category: this.notice.category || null
      };

      this.http.post<Notice>(
        this.apiUrl,
        newNotice
      ).subscribe({
        next: () => {
          alert('Notice added successfully');
          this.clearForm();
          this.loadNotices();
        },
        error: (error) => {
          console.error('Add error:', error);
          alert('Unable to add notice');
        }
      });
    }
  }

  editNotice(item: Notice): void {
    this.notice = { ...item };
    this.editing = true;
  }

  deleteNotice(id: number): void {

    if (!confirm('Are you sure you want to delete this notice?')) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        alert('Notice deleted successfully');
        this.loadNotices();
      },
      error: (error) => {
        console.error('Delete error:', error);
        alert('Unable to delete notice');
      }
    });
  }

  clearForm(): void {
    this.notice = {
      id: 0,
      title: '',
      description: '',
      date: '',
      category: ''
    };

    this.editing = false;
  }
}