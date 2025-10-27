// src/app/core/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { getToken } from './token.util';

function decodeJwt(): any | null {
  const t = getToken(); if (!t) return null;
  const parts = t.split('.');
  if (parts.length !== 3) return null;
  try { return JSON.parse(atob(parts[1])); } catch { return null; }
}

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  const token = getToken();
  if (!token) { router.navigateByUrl('/login'); return false; }

  const payload = decodeJwt();
  const needRoles: string[] | undefined = route.data?.['roles'];

  if (needRoles?.length) {
    const role = payload?.role ?? payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (!role || !needRoles.includes(role)) {
      router.navigateByUrl('/unauthorized');
      return false;
    }
  }

  return true;
};
