import {
  CommonModule,
  isPlatformBrowser
} from '@angular/common';

import {
  Component,
  OnInit,
  PLATFORM_ID,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpClient
} from '@angular/common/http';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  course: string;
  phone: string;
  role?: string;
}

@Component({
  selector: 'app-profile',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './profile.html'
})
export class Profile implements OnInit {

  private platformId =
    inject(PLATFORM_ID);

  private apiUrl =
    'https://localhost:7200/api/User';

  user: UserProfile = {
    id: 0,
    name: '',
    email: '',
    course: '',
    phone: ''
  };

  editing = false;

  message = '';

  errorMessage = '';

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    this.loadProfile();

  }


  // ==========================================
  // LOAD PROFILE
  // ==========================================

  loadProfile(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const savedUser =
      localStorage.getItem('user');

    if (!savedUser) {

      this.errorMessage =
        'User information not found.';

      return;
    }

    try {

      const loggedUser =
        JSON.parse(savedUser);

      this.user = {
        id: loggedUser.id || 0,
        name: loggedUser.name || '',
        email: loggedUser.email || '',
        course: loggedUser.course || '',
        phone: loggedUser.phone || ''
      };

    } catch {

      this.errorMessage =
        'Unable to load profile.';
    }
  }


  // ==========================================
  // EDIT PROFILE
  // ==========================================

  startEditing(): void {

    this.editing = true;

    this.message = '';

    this.errorMessage = '';
  }


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  cancelEditing(): void {

    this.editing = false;

    this.loadProfile();

    this.message = '';

    this.errorMessage = '';
  }


  // ==========================================
  // SAVE PROFILE
  // ==========================================

  saveProfile(): void {

    this.message = '';

    this.errorMessage = '';

    if (
      !this.user.name.trim() ||
      !this.user.email.trim()
    ) {

      this.errorMessage =
        'Name and Email are required.';

      return;
    }

    const profileData = {

      id: this.user.id,

      name: this.user.name,

      email: this.user.email,

      course: this.user.course,

      phone: this.user.phone
    };

    this.http.put<any>(
      `${this.apiUrl}/Profile/${this.user.id}`,
      profileData
    ).subscribe({

      next: (response) => {

        this.message =
          'Profile updated successfully.';

        this.editing = false;

        // Update localStorage
        if (isPlatformBrowser(this.platformId)) {

          const existingUser =
            localStorage.getItem('user');

          let storedUser: any = {};

          if (existingUser) {

            try {
              storedUser =
                JSON.parse(existingUser);
            } catch {
              storedUser = {};
            }
          }

          const updatedUser = {
            ...storedUser,

            id: response.user.id,
            name: response.user.name,
            email: response.user.email,
            course: response.user.course,
            phone: response.user.phone,
            role: response.user.role
          };

          localStorage.setItem(
            'user',
            JSON.stringify(updatedUser)
          );
        }

        this.user = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          course: response.user.course,
          phone: response.user.phone
        };
      },

      error: (error) => {

        console.error(
          'Profile update error:',
          error
        );

        if (
          error?.error?.message
        ) {

          this.errorMessage =
            error.error.message;

        } else {

          this.errorMessage =
            'Unable to update profile.';
        }
      }
    });
  }
}