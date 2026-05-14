import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-aside',
  imports: [RouterLink, NgClass],
  template: `
    <!-- Overlay móvil -->
    @if (isOpen) {
      <div class="fixed inset-0 bg-black/40 z-40 md:hidden" (click)="close.emit()"></div>
    }

    <aside
      class="
        fixed md:static
        top-0 left-0
        h-full
        w-64
        bg-yellow-600 text-yellow-900 pb-3
        transform transition-transform duration-300
        z-50
      "
      [ngClass]="{
        '-translate-x-full': !isOpen,
        'translate-x-0': isOpen,
        'md:translate-x-0': true,
      }"
    >
      <div class="font-[Kaushan] text-3xl text-center py-3">
        <h2>Shaylu</h2>
      </div>

      <ul>
        @for (link of links; track link) {
          <li class="hover:bg-yellow-700/40 py-2 px-3">
            <a [routerLink]="link.path" class="block w-full">
              @if (link.icon) {
                <i [ngClass]="link.icon"></i>
              }
              {{ link.value }}
            </a>
          </li>
        }
      </ul>
    </aside>
  `,
})
export class AdminAside {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  links: AsideLink[] = [
    { value: 'Dashboard', icon: 'fa-solid fa-chart-line', path: 'dashboard' },
    { value: 'Productos', icon: 'fa-solid fa-cheese', path: 'products' },
    { value: 'Categorias', icon: 'fa-solid fa-layer-group', path: 'categories' },
    { value: 'Usuarios', icon: 'fa-solid fa-user-group', path: 'users' },
    { value: 'Volver', icon: 'fa-solid fa-arrow-left', path: '/' },
  ];
}

export interface AsideLink {
  value: string;
  icon: string | null;
  path: string;
}
