import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './admin-layout.html'
})
export class AdminLayout {

  private platformId = inject(PLATFORM_ID);

  constructor(private router: Router) {}

  getUserName(): string {

    if (!isPlatformBrowser(this.platformId)) {
      return 'Admin';
    }

    const savedUser = localStorage.getItem('user');

    if (!savedUser) {
      return 'Admin';
    }

    try {
      const user = JSON.parse(savedUser);
      return user?.name || 'Admin';
    } catch {
      return 'Admin';
    }
  }

  logout(): void {

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    }

    this.router.navigate(['/login']);
  }
}