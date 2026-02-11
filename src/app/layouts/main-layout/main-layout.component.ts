import { Component, inject } from '@angular/core';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { Alert } from "./shared/alert/alert.component";
import { AlertService } from './services/alert.service';


@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet, Alert],
  template: `
    <div class="w-full bg-linear-to-r from-transparent from-80%  to-yellow-700/65">
      <app-navbar></app-navbar>
    </div>

    <div>
      <main-layout-alert></main-layout-alert>
    </div>


    <router-outlet></router-outlet>
  `,
  styles: ``,
})
export class MainLayout {

}
