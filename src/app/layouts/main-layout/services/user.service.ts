import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { Response } from '../../../core/responses/genericResponse.response';

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

}
