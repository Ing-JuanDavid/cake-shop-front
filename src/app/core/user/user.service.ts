import { Injectable, signal } from '@angular/core';

export interface User {
  email : string;
  roles : string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {

  public currentUser = signal<User | null>(null);

  public setCurrentUser(user: User | null)
  {
    this.currentUser.set(user);
  }
}
