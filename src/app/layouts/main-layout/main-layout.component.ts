import { Component } from '@angular/core';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { UserService } from '../../core/user/user.service';


@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet],
  template: `
    <div class="w-full bg-linear-to-r from-transparent from-80%  to-yellow-700/65">
      <app-navbar></app-navbar>
    </div>

    <router-outlet></router-outlet>
  `,
  styles: ``,
})
export class MainLayout {

}
