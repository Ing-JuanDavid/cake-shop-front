import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { UserMenu } from "./user-menu/userMenu.component";
import { UserLinks } from "./user-links/user-links.component";
import { SessionService } from '../../../../core/session/session.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, UserMenu, UserLinks],
  standalone: true,
  template: `
    <nav class="flex justify-between px-3 py-4">
      <div class="font-[Kaushan] text-3xl text-yellow-900">
        <h2>Shaylu</h2>
      </div>

      <ul class="flex gap-4 text-yellow-900 font-semibold:">
        <li class="hover:text-yellow-600"><a routerLink="home">home</a></li>
        <li class="hover:text-yellow-600"><a routerLink="products">products</a></li>
        <li class="hover:text-yellow-600"><a routerLink="contact">contact</a></li>


        @if (user(); as u) {

          <navbar-user-links [user]="u" [links]="this.links"></navbar-user-links>

          <li
            class="hover:text-yellow-600 relative"
            (mouseenter)="toogleMenu()"
            (mouseleave)="toogleMenu()"
          >
            <a routerLink="user/profile">
              <i class="fa-solid fa-circle-user fa-2xl"></i>
            </a>

            @if (isMenuOpen()) {
              <!-- UserMenuComponent -->
              <div class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg borde">
                <navbar-user-menu [user]="u"></navbar-user-menu>
              </div>
            }
          </li>
        }

        @if (!sessionService.currentUser()) {
          <li class="hover:text-yellow-600">
            <a routerLink="auth"><i class="fa-solid fa-right-to-bracket fa-lg"></i></a>
          </li>
        }
      </ul>
    </nav>
  `,
  styles: ``,
})
export class NavbarComponent {

  links = [
    {
      rol: 'ROLE_ADMIN',
      value: 'admin',
      icon: null,
      class: null,
      path: 'admin/productos'
    },
    {
      rol: 'ROLE_USER',
      value: null,
      icon: 'fa-solid fa-cart-shopping fa-lg',
      class: null,
      path: 'user/cart'
    }
  ]

  isMenuOpen = signal(false);

  sessionService = inject(SessionService);
  user = this.sessionService.currentUser;

  toogleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }
}
