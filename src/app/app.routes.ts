import { Routes } from '@angular/router';

// ================= LOGIN =================

import { Login } from './login/login';

// ================= ADMIN =================

import { AdminLayout } from './admin/admin-layout/admin-layout';

import { Dashboard } from './admin/dashboard/dashboard';
import { Students } from './admin/students/students';
import { Courses as AdminCourses } from './admin/courses/courses';
import { Attendance } from './admin/attendance/attendance';
import { Results } from './admin/results/results';
import { Notices } from './admin/notices/notices';
import { Subjects as AdminSubjects } from './admin/subjects/subjects';

// ================= USER =================

import { UserLayout } from './user/user-layout/user-layout';

import { UserDashboard } from './user/dashboard/dashboard';
import { Profile } from './user/profile/profile';
import { Subjects as UserSubjects } from './user/subjects/subjects';
import { UserAttendance } from './user/attendance/attendance';
import { UserResults } from './user/results/results';
import { UserNotices } from './user/notices/notices';
import { adminGuard, userGuard } from './auth.guard';


export const routes: Routes = [

  // ==================================================
  // LOGIN
  // ==================================================

  {
    path: 'login',
    component: Login
  },


  // ==================================================
  // ADMIN LAYOUT
  // Sidebar stays visible
  // ==================================================

  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [adminGuard],

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
        path: 'subjects',
        component: AdminSubjects
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
    canActivate: [userGuard],

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
        path: 'subjects',
        component: UserSubjects
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