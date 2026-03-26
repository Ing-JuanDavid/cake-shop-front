import { Component, inject } from '@angular/core';
import { SessionService } from '../../../core/session/session.service';
import { User } from '../../../core/models/user.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'user-profile-view',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-xl mx-auto p-6 bg-white shadow rounded-xl">

  <h2 class="text-2xl font-bold mb-6">Actualizar Perfil</h2>

  @if (loading) {
    <p>Cargando información...</p>
  }

  @if (!loading) {

    <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">

      <!-- NIP -->
      <div>
        <label class="block font-semibold">NIP</label>
        <p class="bg-gray-100 p-2 rounded">{{ f.nip.value }}</p>
      </div>

      <!-- Email -->
      <div>
        <label class="block font-semibold">Email</label>
        <p class="bg-gray-100 p-2 rounded">{{ f.email.value }}</p>
      </div>

      <!-- Nombre -->
      <div>
        <label class="block font-semibold">Nombre</label>
        <input class="bg-gray-100 p-2 rounded w-full" type="text" formControlName="name">

        @if (f.name.touched && f.name.invalid) {
          <small class="text-red-500">Nombre inválido (mínimo 3 caracteres)</small>
        }
      </div>

      <!-- Fecha nacimiento -->
      <div>
        <label class="block font-semibold">Fecha de nacimiento</label>
        <input class="bg-gray-100 p-2 rounded w-full" type="date" formControlName="birth">
      </div>

      <!-- Sexo -->
      <div>
        <label class="block font-semibold">Sexo</label>
        <select formControlName="sex" class="bg-gray-100 p-2 rounded w-full">
          <option value="">Seleccione</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
          <option value="O">Otro</option>
        </select>
      </div>

      <!-- Dirección -->
      <div>
        <label class="block font-semibold">Dirección</label>
        <input type="text" formControlName="address" class="bg-gray-100 p-2 rounded w-full">
      </div>

      <!-- Teléfono -->
      <div>
        <label class="block font-semibold">Teléfono</label>
        <input type="text" formControlName="telf" class="bg-gray-100 p-2 rounded w-full">

        @if (f.telf.touched && f.telf.invalid) {
          <small class="text-red-500">
            Solo números (7 a 15 dígitos)
          </small>
        }
      </div>

      <div class="flex justify-end">
        <button
        type="submit"
        [disabled]="form.invalid"
        class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 hover:cursor-pointer"
      >
        Actualizar
      </button>
      </div>

    </form>
  }
</div>

  `,
  styles: ``,
})
export class UserProfile {


  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private alertService = inject(AlertService);

  loading = true;

  form = this.fb.nonNullable.group({
    nip: [{ value: 0, disabled: true }],
    email: [{ value: '', disabled: true }],

    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]],

    birth: [new Date(), Validators.required],

    sex: [''],

    address: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)
    ]],

    telf: ['', [
      Validators.required,
      Validators.pattern(/^[0-9]{7,15}$/)
    ]]
  });

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: (res) => {
        const user = res.data;

        console.log(user);

        this.form.patchValue({
          nip: user.nip,
          email: user.email,
          name: user.name,
          birth: user.birth?? new Date(),
          sex: user.sex ?? '',
          address: user.address,
          telf: user.telf
        });

        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const {nip, email, ...updatedUser} = this.form.getRawValue();

    console.log(updatedUser);
    this.userService.updateUserInfo(updatedUser).subscribe(
      {next: res=>{{
        this.alertService.success('Usuario actualizado');
        setTimeout(()=>{
          this.alertService.clearWithOutDelay();
          this.alertService.success('Inicie sesion nuevamente para ver los cambios');
          this.alertService.clear(3000);
        }, 1000)
      }}}
    )
  }

  get f() {
    return this.form.controls;
  }
}
