import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Link, UserLinks } from '../user-links/user-links.component';
import { SessionService } from '../../../../../core/session/session.service';
import { User } from '../../../../../core/models/user.model';

@Component({
  selector: 'navbar-user-menu',
  imports: [RouterLink, UserLinks],
  template: `
    <ul class="flex flex-col text-yellow-900 font-semibold px-1">
      <li class="px-4 py-2 transition border-b border-zinc-400">
        <p>{{ user.name }}</p>
        <a [routerLink]="profileRoute" class="text-sm font-thin hover:text-yellow-600">Mi perfil</a>
      </li>

      <navbar-user-links [user]="user" [links]="links"></navbar-user-links>

      <li class="px-4 py-2 hover:cursor-pointer hover:text-yellow-600" (click)="sessionService.logout()">Salir</li>
    </ul>
  `,
  styles: ``,
})
export class UserMenu {
  @Input() user!: User;

  links:Link[] = [
    {
      rol: 'ROLE_USER',
      value: 'Mis pedidos',
      icon: null,
      class: "px-4 py-2 border-b border-zinc-400 hover:text-yellow-600",
      path: 'user/orders'
    },
    {
      rol: 'ROLE_USER',
      value: 'Ir al carrito',
      icon: null,
      class: "px-4 py-2 border-b border-zinc-400 hover:text-yellow-600",
      path: 'user/cart'
    }
  ]

  constructor(protected sessionService: SessionService) {}

  get profileRoute() {
    return this.user.roles.includes('ROLE_USER') ? 'user/profile' : 'admin/profile';
  }
}
