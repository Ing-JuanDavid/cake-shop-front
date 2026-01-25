import { Component } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { Observable } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'main-layout-alert',
  standalone: true,
  imports: [AsyncPipe, NgClass],
  template: `
  @if(alert$ | async; as alert) {
    <div class="fixed top-5 right-5 px-4 py-3 rounded shadow-lg text-white border-l-4"
           [ngClass]="{
             'bg-green-600 border-green-800': alert.type === 'success',
             'bg-red-600 border-red-900': alert.type === 'error',
             'bg-blue-600 border-blue-800': alert.type === 'info'
           }">
        {{ alert.message }}
      </div>
  }
  `,
  styles: ``,
})
export class Alert {
  alert$! : Observable<any>;
  constructor(public alertService : AlertService){
    this.alert$ = alertService.alert$;
  }
}
