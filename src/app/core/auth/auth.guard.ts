import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { EncryptService } from '../services/encrypt.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const encrypt = inject(EncryptService);
  const encrypted = localStorage.getItem('auth');
  let isLogged = false;

  if (encrypted) {
    try {
      const decoded = encrypt.decrypt(encrypted);
      isLogged = decoded?.auth === true;
    } catch {
      isLogged = false;
    }
  }

  if (isLogged && state.url === '/login') {
    return router.parseUrl('/users');
  }

  if (!isLogged && state.url !== '/login') {
    return router.parseUrl('/login'); 
  }

  return true;
};
