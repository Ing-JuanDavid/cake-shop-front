import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin-layout.component',
  imports: [RouterLink, RouterOutlet],
  template: `
    <aside>
      <ul>
        <li><a routerLink="/admin/productos">productos</a></li>
      </ul>
    </aside>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: ``,
})
export class AdminLayoutComponent {

}
