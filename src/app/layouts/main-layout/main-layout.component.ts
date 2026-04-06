import { Component, inject } from '@angular/core';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { Alert } from "./shared/alert/alert.component";
import { AlertService } from '../../core/services/alert.service';
import { FooterComponent } from "./shared/footer/footer.component";


@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet, Alert, FooterComponent],
  template: `
    <div class="w-full bg-linear-to-r from-transparent from-80%  to-yellow-700/65">
      <app-navbar></app-navbar>
    </div>

    <div>
      <main-layout-alert></main-layout-alert>
    </div>


    <router-outlet></router-outlet>

    <main-layout-footer></main-layout-footer>
  `,
  styles: ``,
})
export class MainLayout {

}
