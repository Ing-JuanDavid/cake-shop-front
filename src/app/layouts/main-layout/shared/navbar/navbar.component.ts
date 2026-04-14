import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserMenu } from "./user-menu/userMenu.component";
import { UserLinks } from "./user-links/user-links.component";
import { SessionService } from '../../../../core/session/session.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, UserMenu, UserLinks, FormsModule],
  standalone: true,
  template: `
    <nav class="flex items-center justify-between px-6 py-4 shadow-sm">

      <!-- Brand -->
      <a routerLink="home" class="font-[Kaushan] text-3xl text-yellow-900 hover:text-yellow-700 transition-colors">
        Shaylu
      </a>

      <!-- Nav links + actions -->
      <ul class="flex items-center gap-5 text-yellow-900 font-semibold">

        <li class="hover:text-yellow-600 transition-colors">
          <a routerLink="home" class="flex items-center gap-1.5 text-sm">
            <i class="fa-solid fa-house"></i>
            <span>Inicio</span>
          </a>
        </li>

        <li class="hover:text-yellow-600 transition-colors">
          <a routerLink="contact" class="flex items-center gap-1.5 text-sm">
            <i class="fa-solid fa-envelope"></i>
            <span>Contacto</span>
          </a>
        </li>

        @if (user(); as u) {

          <navbar-user-links [user]="u" [links]="links"></navbar-user-links>

          <!-- Profile with hover dropdown -->
          <li
            class="relative hover:text-yellow-600 transition-colors"
            (click)="toogleMenu()"
          >
            <button class="flex items-center gap-2">
              <i class="fa-solid fa-circle-user fa-xl"></i>
              <span class="text-sm max-w-24 truncate">{{ u.name }}</span>
              <i class="fa-solid fa-chevron-down text-xs opacity-60"
                [style.transform]="isMenuOpen() ? 'rotate(180deg)' : 'rotate(0deg)'"
                style="transition: transform 0.2s"></i>
            </button>

            @if (isMenuOpen()) {
              <div class="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-yellow-100 z-50">
                <navbar-user-menu [user]="u"></navbar-user-menu>
              </div>
            }
          </li>
        }

        @if (!sessionService.currentUser()) {
          <li class="hover:text-yellow-600 transition-colors">
            <a routerLink="auth" class="flex items-center gap-2 border border-yellow-900 px-4 py-1.5 rounded-full text-sm hover:bg-yellow-900 hover:text-yellow-50 transition-all">
              <i class="fa-solid fa-right-to-bracket"></i>
              <span>Ingresar</span>
            </a>
          </li>
        }

        <!-- Expandable search -->
        <li class="flex items-center">
          @if (!isSearchOpen()) {
            <button
              (click)="openSearch()"
              class="hover:text-yellow-600 transition-colors">
              <i class="fa-solid fa-magnifying-glass fa-lg"></i>
            </button>
          } @else {
            <div class="flex items-center gap-2 border-b-2 border-yellow-900 pb-0.5">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (keydown.enter)="onSearch()"
                (keydown.escape)="closeSearch()"
                placeholder="Buscar..."
                class="outline-none text-sm text-yellow-900 placeholder:text-yellow-900/40 w-40 bg-transparent"
              />
              <button (click)="closeSearch()" class="hover:text-yellow-600 transition-colors">
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          }
        </li>

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
      path: 'admin/products'
    },
    {
      rol: 'ROLE_USER',
      value: null,
      icon: 'fa-solid fa-cart-shopping fa-lg',
      class: null,
      path: 'user/cart'
    }
  ];

  isMenuOpen = signal(false);
  isSearchOpen = signal(false);
  searchQuery = '';

  sessionService = inject(SessionService);
  user = this.sessionService.currentUser;

  constructor(private router: Router) {}

  toogleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }

  openSearch() {
    this.isSearchOpen.set(true);
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('nav input[type="text"]')?.focus();
    }, 0);
  }

  closeSearch() {
    this.isSearchOpen.set(false);
    this.searchQuery = '';
  }

  onSearch() {
    const q = this.searchQuery.trim();
    if (!q) return;
    console.log(q);
    this.router.navigate(['/products/search'], { queryParams: { q } });
    this.closeSearch();
  }
}
