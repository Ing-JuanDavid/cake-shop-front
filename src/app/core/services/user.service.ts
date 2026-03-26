import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../dtos/responses/genericResponse.response';
import { UpdatedUser, User, UserDto } from '../models/user.model';
import { PaginatedResponse } from '../dtos/responses/paginatedProduct.response';
import { UserFilters } from '../dtos/requests/userFilters.request';
import { UserRegisterDto } from '../dtos/requests/userRegister.request';
import { UserComplete } from '../models/userComplete.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  http = inject(HttpClient);


  baseUrl = 'http://localhost:8080/users';

    public getUserInfo(): Observable<Response<User>>
  {
    return this.http.get<Response<User>>(this.baseUrl+'/me');
  }

  public updateUserInfo(updatedUser: UpdatedUser): Observable<Response<User>>
  {
    return this.http.put<Response<User>>(`${this.baseUrl}/me`, updatedUser);
  }


  public postUser(user: UserRegisterDto ) : Observable<Response<User>>
  {
    return this.http.post<Response<User>>(this.baseUrl, user);
  }

  public getUser(userId: string): Observable<Response<UserComplete>>
  {
    return this.http.get<Response<UserComplete>>(`${this.baseUrl}/${userId}`);
  }

  public getAllUsers(): Observable<Response<User[]>>
  {
    return this.http.get<Response<User[]>>(this.baseUrl + '/all');
  }

  public getUsers(
    currentPage: number = 1,
    sizePage: number = 5,
    filters?: UserFilters
  ): Observable<Response<PaginatedResponse<User>>>
  {

    let params = new HttpParams()
        .set('currentPage', currentPage)
        .set('sizePage', sizePage);

        if(filters?.name) params = params.set('name', filters.name);
        if(filters?.email) params = params.set('email', filters.email);
         if(filters?.nip) params = params.set('nip', filters.nip);
        if(filters?.role) params = params.set('role', filters.role);
        if(filters?.isAccountNonLocked != null) params = params.set('accountNonLocked', filters.isAccountNonLocked);

    return this.http.get<Response<PaginatedResponse<User>>>(this.baseUrl, {params});
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
