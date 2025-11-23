import { Component, Input } from '@angular/core';

@Component({
  selector: 'auth-alert',
  imports: [],
  template: `
    <div class="bg-red-200 rounded-lg p-3 text-sm text-red-800 text-center">
      <p>{{message}}</p>
    </div>
  `,
  styles: ``,
})
export class AlertComponent {
  @Input() message: string = '';
}
