import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../session/session.service';
import { User } from '../models/user.model';

export const userGuard: CanActivateFn = (route, state) => {

const router = inject(Router);
const sesionService = inject(SessionService);

const user: null | User = sesionService.currentUser();

  if( user && user.roles[0] == 'ROLE_USER') return true;


    router.navigateByUrl('/unauthorized', { replaceUrl: false });
  return false;
};
