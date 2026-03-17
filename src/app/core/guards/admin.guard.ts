import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../session/session.service';

export const AdminGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const sessionService = inject(SessionService);
  const user = sessionService.currentUser();

  if(user && user.roles[0] == 'ROLE_ADMIN') return true;

  router.navigate(['/unauthorized']);

  return false;
};
