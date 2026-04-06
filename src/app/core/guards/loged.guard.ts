import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../session/session.service';
import { User } from '../models/user.model';

export const logedGuard: CanActivateFn = (route, state) => {

const router = inject(Router);
const sesionService = inject(SessionService);

const user: null | User = sesionService.currentUser();

  if( user ) return true;


    router.navigateByUrl('/unauthorized', { replaceUrl: false });
  return false;
};
