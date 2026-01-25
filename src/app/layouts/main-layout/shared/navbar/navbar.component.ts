import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User, UserService } from '../../../../core/user/user.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
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

        @if(userService.currentUser()?.roles?.includes('ROLE_ADMIN')) {
          <li class="hover:text-yellow-600"><a routerLink="admin/productos">admin</a></li>
        }

        @if(userService.currentUser(); as user) {

          @if(user.roles.includes('ROLE_USER')) {
            <li class="hover:text-yellow-600"><a routerLink="user/cart"><i class="fa-solid fa-cart-shopping fa-lg"></i></a></li>
          }

          <li class="hover:text-yellow-600"><a routerLink="user/profile"><i class="fa-solid fa-circle-user fa-2xl"></i></a></li>
        }

        @if(! userService.currentUser()) {
          <li class="hover:text-yellow-600"><a routerLink="auth"><i class="fa-solid fa-right-to-bracket fa-lg"></i></a></li>
        }


      </ul>
    </nav>
  `,
  styles: `
  `,
})
export class NavbarComponent {

  constructor(public userService: UserService) {}

}
