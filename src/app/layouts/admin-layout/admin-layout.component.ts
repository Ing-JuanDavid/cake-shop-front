import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";
import { AdminAside } from "./shared/aside/aside.component";
import { Alert } from "../main-layout/shared/alert/alert.component";

@Component({
  selector: 'app-admin-layout.component',
  imports: [RouterOutlet, AdminAside, Alert],
  template: `
    <div class="flex min-h-screen">
      <!-- Aside -->
      <admin-aside
        [isOpen]="isAsideOpen"
        (close)="isAsideOpen = false">
      </admin-aside>

      <!-- Contenido -->
      <div class="flex-1 flex flex-col">

        <!-- Topbar móvil -->
        <header class="md:hidden p-3 bg-yellow-600 text-900">
          <button (click)="isAsideOpen = true">
            ☰
          </button>
        </header>

        <main class="flex-1 p-6 bg-gray-100 md:max-h-dvh md:overflow-y-auto">
          <main-layout-alert></main-layout-alert>
          <router-outlet></router-outlet>
        </main>

      </div>

    </div>
  `,
  styles: ``,
})
export class AdminLayoutComponent {
  isAsideOpen = false;
}
