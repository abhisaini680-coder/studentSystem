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

interface Notice {
  id: number;
  title: string;
  description: string;
  date: string | null;
  category: string | null;
}

@Component({
  selector: 'app-user-notices',

  standalone: true,

  imports: [
    CommonModule,
    DatePipe
  ],

  templateUrl: './notices.html'
})
export class UserNotices implements OnInit {

  private apiUrl =
    '/api/Notices';

  notices: Notice[] = [];

  constructor(
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    // Automatically load notices
    // when the page opens
    this.loadNotices();
  }

  loadNotices(): void {

    console.log(
      'Loading notices from:',
      this.apiUrl
    );

    this.http.get<Notice[]>(
      this.apiUrl
    ).subscribe({

      next: (data) => {

        console.log(
          'Notices received:',
          data
        );

        this.notices = data;
        this.changeDetector.markForCheck();
      },

      error: (error) => {

        console.error(
          'Notices API error:',
          error
        );

        this.notices = [];
        this.changeDetector.markForCheck();
      }

    });
  }
}