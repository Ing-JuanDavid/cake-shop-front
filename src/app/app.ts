import { Component, signal } from '@angular/core';
import {RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('cake-shop-front');

  constructor(
    private authService: AuthService) {}

  ngOnInit()
  {
    console.log('App initialized');
    // Call validate token before starting the app, something like this => this.authService.validateToken()
    this.authService.keepSession();
  }
}
