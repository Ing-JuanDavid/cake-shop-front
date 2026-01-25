import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  type: string;
  message: string;
}


@Injectable({
  providedIn: 'root',
})
export class AlertService {

  private alertSubject = new  BehaviorSubject<Alert | null>(null);
  alert$ = this.alertSubject.asObservable();

  success(message : string) {
    this.alertSubject.next({type: 'success', message:message});
  }

  error(message: string) {
    this.alertSubject.next({type:'error', message: message})
  }

  clear() {
    this.alertSubject.next(null);
  }
}
