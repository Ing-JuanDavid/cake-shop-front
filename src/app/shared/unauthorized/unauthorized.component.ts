import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { UserService } from '../../layouts/main-layout/services/user.service';
import { SessionService } from '../../core/session/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'info-view-unauthorized',
  imports: [],
  template: `
    <div class="px-10 md:px-20 min-h-screen flex items-center justify-center bg-amber-50">
      <div class="text-center max-w-md">
        <!-- Icon -->
        <div class="flex justify-center mb-6">
          <div class="w-20 h-20 rounded-full bg-yellow-900/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-15 h-15 text-yellow-900/60"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
              <path d="M12 9v4" />
              <path d="M12 16v.01" />
            </svg>
          </div>
        </div>

        <!-- Code -->
        <p class="text-yellow-900/30 text-sm font-semibold tracking-widest uppercase mb-2">
          Error 403
        </p>

        <!-- Title -->
        <h1 class="text-yellow-900/80 text-3xl font-bold mb-3">Acceso denegado</h1>

        <!-- Message -->
        <p class="text-yellow-900/50 text-base mb-8">
          No tienes los permisos suficientes para ver esta página. Contacta a tu administrador si
          crees que esto es un error.
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center">

          <button
            (click)="router.navigate(['/'])"
            class="px-5 py-2.5 rounded-lg bg-yellow-900/80 text-amber-50
                   text-sm font-medium hover:bg-yellow-900 transition-colors cursor-pointer"
          >
            Ir al inicio
          </button>

          @if(! sessionService.currentUser()) {
          <button
            (click)="router.navigate(['/auth'])"
            class="px-5 py-2.5 rounded-lg border border-yellow-900/20 text-yellow-900/60
                   text-sm font-medium hover:bg-yellow-900/5 transition-colors cursor-pointer"
          >
            Iniciar sesion
          </button>
        }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class Unauthorized {

  constructor(
    protected sessionService: SessionService,
    protected router: Router
  ){}
}
