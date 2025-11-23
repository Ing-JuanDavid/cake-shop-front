import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html',
  styles: ``,
})
export class RegisterComponent {
  email = '';
  password = '';

  onSubmit() {
    console.log('Registering user with email:', this.email);
  }
}
