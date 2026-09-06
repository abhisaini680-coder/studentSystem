import { Routes } from '@angular/router';

// ================= LOGIN / REGISTER =================

import { Login } from './login/login';
import { Register } from './register/register';

// ================= ADMIN =================

import { AdminLayout } from './admin/admin-layout/admin-layout';

import { Dashboard } from './admin/dashboard/dashboard';
import { Students } from './admin/students/students';
import { Courses as AdminCourses } from './admin/courses/courses';
import { Attendance } from './admin/attendance/attendance';
import { Results } from './admin/results/results';
import { Notices } from './admin/notices/notices';

// ================= USER =================

import { UserLayout } from './user/user-layout/user-layout';

import { UserDashboard } from './user/dashboard/dashboard';
import { Profile } from './user/profile/profile';
import { Courses as UserCourses } from './user/courses/courses';
import { UserAttendance } from './user/attendance/attendance';
import { UserResults } from './user/results/results';
import { UserNotices } from './user/notices/notices';


export const routes: Routes = [

  // ==================================================
  // LOGIN
  // ==================================================

  {
    path: 'login',
    component: Login
  },


  // ==================================================
  // REGISTER
  // ==================================================

  {
    path: 'register',
    component: Register
  },


  // ==================================================
  // ADMIN LAYOUT
  // Sidebar stays visible
  // ==================================================

  {
    path: 'admin',
    component: AdminLayout,

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'students',
        component: Students
      },

      {
        path: 'courses',
        component: AdminCourses
      },

      {
        path: 'attendance',
        component: Attendance
      },

      {
        path: 'results',
        component: Results
      },

      {
        path: 'notices',
        component: Notices
      }

    ]
  },


  // ==================================================
  // USER LAYOUT
  // Sidebar stays visible
  // ==================================================

  {
    path: 'user',
    component: UserLayout,

    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        component: UserDashboard
      },

      {
        path: 'profile',
        component: Profile
      },

      {
        path: 'courses',
        component: UserCourses
      },

      {
        path: 'attendance',
        component: UserAttendance
      },

      {
        path: 'results',
        component: UserResults
      },

      {
        path: 'notices',
        component: UserNotices
      }

    ]
  },


  // ==================================================
  // DEFAULT
  // ==================================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // ==================================================
  // INVALID URL
  // ==================================================

  {
    path: '**',
    redirectTo: 'login'
  }

];