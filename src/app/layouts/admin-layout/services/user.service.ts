import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../core/dtos/responses/genericResponse.response';
import { User, UserDto } from '../../../core/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  http = inject(HttpClient);


  baseUrl = 'http://localhost:8080/users';

  public getUser(userId: number): Observable<Response<User>>
  {
    return this.http.get<Response<User>>(`${this.baseUrl}/${userId}`);
  }

  public getUsers(): Observable<Response<User[]>>
  {
    return this.http.get<Response<User[]>>(this.baseUrl);
  }

  public putUser(user: UserDto): Observable<Response<User>>
  {
    return this.http.put<Response<User>>(`${this.baseUrl}/${user.nip}`, user)
  }

  public lockUser(nip: number): Observable<Response<User>>
  {
    return this.http.put<Response<User>>(`${this.baseUrl}/lock/${nip}`, null);
  }

  public unLockUser(nip: number): Observable<Response<User>>
  {
    return this.http.put<Response<User>>(`${this.baseUrl}/unlock/${nip}`, null);
  }

}
