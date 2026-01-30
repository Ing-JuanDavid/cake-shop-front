import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';
import { Router, RouterLink } from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import { UserService } from '../../../core/user/user.service';
import { TokenService } from '../../../core/token/token.service';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';


@Component({
  selector: 'auth-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, AlertComponent, SpinnerComponent],
  template: `

    <h2 class="text-3xl text-center font-bold font-[Kaushan] mb-2">Bienvenido</h2>

    <form [formGroup]="loginForm" class="p-3 m-auto border border-zinc-300 rounded-lg" (ngSubmit)="onSubmit()">
      <div class="mb-3">
        <label>Email:</label>
        <input
          formControlName="email"
          class="
            block w-full
            border
          border-zinc-400
            px-1
            py-0.5
            rounded-md
          focus:outline-yellow-900
          text-zinc-600
          placeholder:text-zinc-500"
          type="email"
          name="email"
          placeholder="alguien@gmail.com"
        />

        @if(loginForm.get('email')?.errors) {
            <p class="text-red-600 text-sm">

              @if(loginForm.get('email')?.touched && loginForm.get('email')?.errors?.['required']) {
                El email es obligatorio.
              }

              @if(loginForm.get('email')?.errors?.['email']) {
                El email no es válido.
              }

              @if(loginForm.get('email')?.errors?.['backend']) {
                {{loginForm.get('email')?.errors?.['backend']}}
              }
            </p>
        }

      </div>

      <div class="mb-3">
        <label>Password:</label>
        <input
          formControlName="password"
          class="
            block w-full border
          border-zinc-400
            px-1
          focus:outline-yellow-900
            py-0.5 rounded-md
          text-zinc-600
          placeholder:text-zinc-500"
          type="password"
          name="password"
          placeholder="********"
          autocomplete="on"
        />

        @if(loginForm.get('password')) {
          @if(loginForm.get('password')?.touched && loginForm.get('password')?.errors?.['required']) {
            <p class="text-red-600 text-sm">La contraseña es obligatoria.</p>
          }

          @if(loginForm.get('password')?.errors?.['backend']) {
            <p class="text-red-600 text-sm">{{loginForm.get('password')?.errors?.['backend']}}</p>
          }
        }


      </div>

      <div class="w-full mb-3">
        <button
        [disabled]="!loginForm.valid"
          type="submit"
          class="
            w-full
          bg-yellow-800
          text-white
            font-semibold
            py-1 px-2
            rounded-md
            mt-2
          hover:bg-yellow-700
            cursor-pointer
            flex items-center justify-center"
        >
        @if(!loading){
          Ingresar
        } @else {
          <app-spinner [size]="'sm'"></app-spinner>
        }
        </button>
      </div>

      <div class="text-center mb-3">
        <a routerLink="change-password" class="text-center underline hover:cursor-pointer hover:text-yellow-700">¿Olvidaste tu contraseña?</a>
      </div>

      <div class="w-full mb-3">
        <a
        class="
          block
          w-full
        bg-yellow-800
        text-white
          font-semibold
          py-1 px-2
          rounded-md
          mt-2
        hover:bg-yellow-700
          cursor-pointer
          text-center"
        routerLink="register">Registrate</a>
      </div>

      @if(loginForm.errors?.['backend']) {
        <auth-alert [message]="loginForm.errors?.['backend']"></auth-alert>
      }

    </form>

  `,
  styles: ``,
})
export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });

  loading = false;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private userService: UserService,
    private router : Router) {}


  onSubmit() {
    if(! this.loginForm.valid) return;

    this.loading = true;

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe(res => {

    if (res.fieldErrors) {
      this.authService.aplyBackendErrors(res.fieldErrors, this.loginForm);
    }

    if(res.error) {
      this.loginForm.setErrors({ backend: res.error });
    }

     if(res.ok && res.data?.token) {
      this.authService.loadUserByToken(res.data.token);
    }

    this.loading = false;

    });
  }
}
