import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root',
})
export class SessionService {

  router = inject(Router);

  public currentUser = signal<User | null>(null);

  public logout() {
    this.currentUser.set(null);
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }
}
