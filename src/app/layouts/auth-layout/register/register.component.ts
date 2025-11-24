import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterModel } from '../models/register.model';
import { AuthService } from '../../../core/auth/auth.service';
import { AlertComponent } from "../shared/alert/alert.component";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, AlertComponent],
  templateUrl: './register.html',
  styles: ``,
})
export class RegisterComponent {

  registerForm = new FormGroup(
    {
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required
      ]),
      name: new FormControl('', [
        Validators.required
      ]),
      birth: new FormControl('', [
        Validators.required
      ]),
      nip: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      address: new FormControl('', [
        Validators.required
      ]),
      telf: new FormControl('', [
        Validators.required
      ])
    }
  );


  constructor(private authService: AuthService){}

  onSubmit() {

    // Create validation for form

    this.authService.register(this.registerForm.value as RegisterModel).subscribe(
      res => {

        if(res.fieldErrors) {
          this.authService.aplyBackendErrors(res.fieldErrors, this.registerForm);
        }

        if(res.error) {
          this.registerForm.setErrors({ backend: res.error })
        }

        if(res.ok && (res.data.token)) {
          this.authService.loadUserByToken(res.data.token);
        }
      }
    );
  }
}
