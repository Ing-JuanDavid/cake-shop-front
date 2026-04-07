import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'user-profile-view',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8">

      <!-- Header -->
      <div class="mb-8">
        <p class="text-sm text-yellow-900/50 mt-0.5 uppercase tracking-widest">Perfil</p>
        <h2 class="text-2xl font-semibold uppercase tracking-widest text-yellow-900">Actualizar Perfil</h2>
        <p class="text-sm text-yellow-900/50 mt-0.5">Mantén tu información al día</p>
      </div>

      @if (loading) {
        <div class="flex items-center gap-3 text-yellow-900/60">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <span class="text-sm">Cargando información...</span>
        </div>
      }

      @if (!loading) {
        <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-5">

          <!-- Read-only row: NIP + Email -->
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">NIP</label>
              <div class="flex items-center gap-2 border-b border-yellow-900/20 pb-2 text-yellow-900/50">
                <i class="fa-solid fa-id-badge text-sm"></i>
                <span class="text-sm">{{ f.nip.value }}</span>
              </div>
            </div>
            <div class="flex-1">
              <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">Email</label>
              <div class="flex items-center gap-2 border-b border-yellow-900/20 pb-2 text-yellow-900/50">
                <i class="fa-solid fa-envelope text-sm"></i>
                <span class="text-sm truncate">{{ f.email.value }}</span>
              </div>
            </div>
          </div>

          <div class="pt-5 space-y-5">

            <!-- Nombre -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">Nombre</label>
              <div class="flex items-center gap-2 border-b-2 pb-1 transition-colors"
                [class.border-yellow-900]="f.name.touched && f.name.valid"
                [class.border-red-400]="f.name.touched && f.name.invalid"
                [class.border-yellow-900/20]="!f.name.touched">
                <i class="fa-solid fa-user text-sm text-yellow-900/40"></i>
                <input
                  type="text"
                  formControlName="name"
                  placeholder="Tu nombre completo"
                  class="bg-transparent outline-none text-sm text-yellow-900 placeholder:text-yellow-900/30 w-full py-1" />
              </div>
              @if (f.name.touched && f.name.invalid) {
                <small class="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i> Mínimo 3 caracteres
                </small>
              }
            </div>

            <!-- Birth + Sex row -->
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">Fecha de nacimiento</label>
                <div class="flex items-center gap-2 border-b-2 border-yellow-900/20 pb-1">
                  <i class="fa-solid fa-cake-candles text-sm text-yellow-900/40"></i>
                  <input
                    type="date"
                    formControlName="birth"
                    class="bg-transparent outline-none text-sm text-yellow-900 w-full py-1 cursor-pointer" />
                </div>
              </div>

              <div class="flex-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">Sexo</label>
                <div class="flex items-center gap-2 border-b-2 border-yellow-900/20 pb-1">
                  <i class="fa-solid fa-venus-mars text-sm text-yellow-900/40"></i>
                  <select formControlName="sex"
                    class="bg-transparent outline-none text-sm text-yellow-900 w-full py-1 cursor-pointer">
                    <option value="">Seleccione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                    <option value="O">Otro</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Dirección -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">Dirección</label>
              <div class="flex items-center gap-2 border-b-2 pb-1 transition-colors"
                [class.border-yellow-900]="f.address.touched && f.address.valid"
                [class.border-red-400]="f.address.touched && f.address.invalid"
                [class.border-yellow-900/20]="!f.address.touched">
                <i class="fa-solid fa-location-dot text-sm text-yellow-900/40"></i>
                <input
                  type="text"
                  formControlName="address"
                  placeholder="Tu dirección"
                  class="bg-transparent outline-none text-sm text-yellow-900 placeholder:text-yellow-900/30 w-full py-1" />
              </div>
              @if (f.address.touched && f.address.invalid) {
                <small class="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i> Mínimo 5 caracteres
                </small>
              }
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">Teléfono</label>
              <div class="flex items-center gap-2 border-b-2 pb-1 transition-colors"
                [class.border-yellow-900]="f.telf.touched && f.telf.valid"
                [class.border-red-400]="f.telf.touched && f.telf.invalid"
                [class.border-yellow-900/20]="!f.telf.touched">
                <i class="fa-solid fa-phone text-sm text-yellow-900/40"></i>
                <input
                  type="text"
                  formControlName="telf"
                  placeholder="Tu número de teléfono"
                  class="bg-transparent outline-none text-sm text-yellow-900 placeholder:text-yellow-900/30 w-full py-1" />
              </div>
              @if (f.telf.touched && f.telf.invalid) {
                <small class="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <i class="fa-solid fa-circle-exclamation"></i> Solo números (7 a 15 dígitos)
                </small>
              }
            </div>

          </div>

          <!-- Submit -->
          <div class="flex justify-end pt-4">
            <button
              type="submit"
              [disabled]="form.invalid"
              class="flex items-center gap-2 border border-yellow-900 text-yellow-900 px-5 py-2 rounded-full text-sm font-semibold
                     hover:bg-yellow-900 hover:text-yellow-50 transition-all
                     disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
              <i class="fa-solid fa-floppy-disk"></i>
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
    nip:     [{ value: 0, disabled: true }],
    email:   [{ value: '', disabled: true }],
    name:    ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    birth:   [new Date(), Validators.required],
    sex:     [''],
    address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
    telf:    ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
  });

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe({
      next: (res) => {
        const user = res.data;
        this.form.patchValue({
          nip:     user.nip,
          email:   user.email,
          name:    user.name,
          birth:   user.birth ?? new Date(),
          sex:     user.sex ?? '',
          address: user.address,
          telf:    user.telf,
        });
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nip, email, ...updatedUser } = this.form.getRawValue();
    this.userService.updateUserInfo(updatedUser).subscribe({
      next: () => {
        this.alertService.success('Usuario actualizado');
        setTimeout(() => {
          this.alertService.clearWithOutDelay();
          this.alertService.success('Inicie sesión nuevamente para ver los cambios');
          this.alertService.clear(3000);
        }, 1000);
      },
    });
  }

  get f() {
    return this.form.controls;
  }
}
