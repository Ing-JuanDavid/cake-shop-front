import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { User, UserService } from '../user/user.service';
import { TokenService } from '../token/token.service';
import { RegisterModel } from '../../layouts/auth-layout/models/register.model';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:8080/auth';

  http = inject(HttpClient);
  userService = inject(UserService);
  tokenService = inject(TokenService);
  router = inject(Router);

  private handlerError(error: HttpErrorResponse) {
    if (error.status !== 0) {
      return of({
        ok: false,
        error: error.error.error ?? 'error desconocido',
        fieldErrors: error.error.fieldErrors ?? null,
        data: null,
      });
    }

    return of({
      ok: false,
      error: 'No se pudo conectar con el servidor',
      fieldErrors: null,
      data: null,
    });
  }

  public login(email: string, password: string) {
    const url = this.baseUrl + '/login';
    return this.http
      .post<any>(url, { email: email, password: password })
      .pipe(catchError((error) => this.handlerError(error)));
  }

  public register(registerModel: RegisterModel) {
    const url = this.baseUrl + '/register';
    return this.http
      .post<any>(url, registerModel)
      .pipe(catchError((error) => this.handlerError(error)));
  }

  public loadUserByToken(token: string) {
    const payload = this.tokenService.validateToken(token);

    if (!payload) {
      this.userService.setCurrentUser(null);
      return;
    }

    localStorage.setItem('token', token);

    this.userService.setCurrentUser({
      email: payload.sub,
      roles: payload.roles,
    });

    this.router.navigate(['/']);
    return;
  }

  public keepSession() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.userService.setCurrentUser(null);
      return;
    }

    const payload = this.tokenService.validateToken(token);

    if (!payload) {
      this.userService.setCurrentUser(null);
      localStorage.removeItem('token');
      return;
    }

    this.userService.setCurrentUser({ email: payload.sub, roles: payload.roles });
  }

  public aplyBackendErrors(errors: any, form: FormGroup) {
    Object.keys(errors).forEach((key) => {
      const control = form.get(key);
      if (control) {
        control.setErrors({ backend: errors[key] });
      }
    });
  }
}
