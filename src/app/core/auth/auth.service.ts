import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { TokenService } from '../token/token.service';
import { RegisterModel } from '../../layouts/auth-layout/models/register.model';
import { FormGroup } from '@angular/forms';
import { SessionService } from '../session/session.service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = 'http://localhost:8080/auth';

  http = inject(HttpClient);
  sessionService = inject(SessionService);
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

  // public loadUserByToken(token: string) {
  //   const payload = this.tokenService.validateToken(token);

  //   if (!payload) {
  //     this.sessionService.setCurrentUser(null);
  //     return;
  //   }

  //   localStorage.setItem('token', token);

  //   this.sessionService.setCurrentUser({
  //     email: payload.sub,
  //     roles: payload.roles,
  //   });

  //   this.router.navigate(['/']);
  //   return;
  // }

  loadUser(token: string,  user: User)
  {


    if(! user || ! this.tokenService.validateToken(token)) {
      this.sessionService.currentUser.set(null);
      return;
    }

    localStorage.setItem('token', token);
    this.sessionService.currentUser.set(user);

    this.router.navigate(['/']);
  }

  public keepSession() {
    const token = localStorage.getItem('token');

    if (!token) {
      this.sessionService.currentUser.set(null);
      return;
    }

    const payload = this.tokenService.validateToken(token);

    if (!payload) {
      this.sessionService.currentUser.set(null);
      localStorage.removeItem('token');
      return;
    }


    const user : User = {
      nip: 0,
      email: payload.sub,
      name: payload.name,
      birth: null,
      roles: payload.roles,
      sex: '',
      address: '',
      telf: ''
    };

    this.sessionService.currentUser.set(user);
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
