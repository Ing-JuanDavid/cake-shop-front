import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UpdatedUser, User } from '../../../core/models/user.model';
import { Response } from '../../../core/dtos/responses/genericResponse.response';

@Injectable({
  providedIn: 'root',
})
export class UserService {


  baseUrl = 'http://localhost:8080/users';
  http = inject(HttpClient);

  public getUserInfo(): Observable<Response<User>>
  {
    return this.http.get<Response<User>>(this.baseUrl+'/me');
  }

  public updateUserInfo(updatedUser: UpdatedUser): Observable<Response<User>>
  {
    return this.http.put<Response<User>>(`${this.baseUrl}/me`, updatedUser);
  }

}
