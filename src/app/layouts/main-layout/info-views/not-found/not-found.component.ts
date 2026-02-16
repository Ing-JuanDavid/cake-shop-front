import { Component, Input } from '@angular/core';

@Component({
  selector: 'info-view-not-found',
  imports: [],
  template: `
    <div class="px-10 md:px-20 min-h-screen flex items-center justify-center">
      <p class="text-yellow-900/70 text-lg">{{msj}}</p>
    </div>
  `,
  styles: ``,
})
export class NotFoundView {

  @Input() msj! : string;

}
