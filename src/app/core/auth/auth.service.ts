import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  baseUrl = 'http://localhost:8080';

  http = inject(HttpClient);
  userService = inject(UserService);
  tokenService = inject(TokenService);

  private handlerError(error: HttpErrorResponse) {

    if(error.status !== 0) {
      return of({
        ok: false,
        error: error.error.error ?? 'error desconocido',
        fieldErrors: error.error.fieldErrors ?? null,
        data : null
      });
    }

    return of({
      ok: false,
      error: 'No se pudo conectar con el servidor',
      fieldErrors: null,
      data: null
    });

  }

  public login(email: string, password: string) {
     let url = this.baseUrl + '/auth/login';
      return this.http.post<any>(url, {email: email, password: password})
      .pipe(
        catchError(error => this.handlerError(error)),
      );
  }

  public keepSession() {
    const token = localStorage.getItem('token');
    let payload : any | null = null;

    if(!token) {
      this.userService.setCurrentUser(null);
      return;
    }

    payload = this.tokenService.validateToken(token);

    if(!payload) {
      this.userService.setCurrentUser(null);
      localStorage.removeItem('token');
      return
    };

    this.userService.setCurrentUser({ email: payload.sub, roles: payload.roles });
  }
}
