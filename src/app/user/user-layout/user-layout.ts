import {
  Component,
  inject,
  PLATFORM_ID
} from '@angular/core';

import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],

  templateUrl: './user-layout.html'
})
export class UserLayout {

  private platformId = inject(PLATFORM_ID);

  constructor(
    private router: Router
  ) {}

  // =========================
  // GET LOGGED-IN USER NAME
  // =========================

  getUserName(): string {

    if (!isPlatformBrowser(this.platformId)) {
      return 'Student';
    }

    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      return 'Student';
    }

    try {

      const user = JSON.parse(savedUser);

      return user?.name || 'Student';

    } catch {

      return 'Student';
    }
  }


  // =========================
  // LOGOUT
  // =========================

  logout(): void {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('user');

    }

    this.router.navigate(['/login']);
  }
}