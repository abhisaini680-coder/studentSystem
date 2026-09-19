import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

function readSession(): { loggedIn: boolean; role: string } {
  if (typeof window === 'undefined') {
    return { loggedIn: false, role: '' };
  }

  return {
    loggedIn: localStorage.getItem('isLoggedIn') === 'true',
    role: (localStorage.getItem('role') || '').toLowerCase()
  };
}

export const authGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const session = readSession();

  if (!session.loggedIn) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return true;
};

export const adminGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const session = readSession();

  if (!session.loggedIn) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  if (session.role !== 'admin') {
    return router.createUrlTree(['/user/dashboard']);
  }

  return true;
};

export const userGuard: CanActivateFn = (_route, state) => {
  const router = inject(Router);
  const session = readSession();

  if (!session.loggedIn) {
    return router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  if (session.role === 'admin') {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return true;
};
