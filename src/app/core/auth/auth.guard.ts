import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { EncryptService } from '../services/encrypt.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  
  const encrypt = inject(EncryptService);

  const encrypted = localStorage.getItem('auth');

  const isLogged = (() => {
    if (!encrypted) return false;
    try {
      return encrypt.decrypt(encrypted)?.auth === true;
    } catch {
      return false;
    }
  })();

  if (isLogged && state.url === '/login') {
    return router.parseUrl('/users');
  }

  if (!isLogged && state.url !== '/login') {
    return router.parseUrl('/login');
  }

  return true;
};
