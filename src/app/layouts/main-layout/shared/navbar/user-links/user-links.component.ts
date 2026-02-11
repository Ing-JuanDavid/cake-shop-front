import { Component, Input } from '@angular/core';
import { RouterLink } from "@angular/router";
import { NgClass } from '@angular/common';
import { User } from '../../../../../core/models/user.model';


@Component({
  selector: 'navbar-user-links',
  imports: [RouterLink, NgClass],
  template: `
      @for(link of links; track link) {

        @if(link.rol === user.roles[0]) {

          @if(link.icon) {
            <li class="hover:text-yellow-600">
              <a [routerLink]="link.path">
                <i [ngClass]="link.icon"></i>
              </a>
            </li>
          }

          @if(link.value) {
            <li [ngClass]=" link.class ? link.class :'hover:text-yellow-600'">
              <a [routerLink]="link.path">{{link.value}}</a>
            </li>
          }
        }

      }
  `,
  styles: ``,
})
export class UserLinks {

  @Input() user!: User;
  @Input() links!: Link[];

}

export interface Link {
 rol: string;
 value: string | null;
 icon: string | null;
 class: string | null;
 path: string;
}
