import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { AlertService } from '../../../../core/services/alert.service';
import { UserRegisterDto } from '../../../../core/dtos/requests/userRegister.request';

@Component({
  selector: 'user-view-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  template: `

 <!-- Overlay -->
<div
  (click)="closeDrawer()"
  class="fixed inset-0 h-full bg-black/40 z-40"
  [class.transition-opacity]="drawerAnimated"
  [class.duration-300]="drawerAnimated"
  [class.ease-in-out]="drawerAnimated"
  [class.opacity-0]="!drawerOpen"
  [class.opacity-100]="drawerOpen"
  [class.pointer-events-none]="!drawerOpen">
</div>

    <!-- Drawer -->
<div
  class="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-50 shadow-2xl flex flex-col"
  [class.transition-transform]="drawerAnimated"
  [class.duration-500]="drawerAnimated"
  [class.ease-in-out]="drawerAnimated"
  [class.translate-x-full]="!drawerOpen"
  [class.translate-x-0]="drawerOpen">

  <!-- Drawer header -->
  <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
    <div>
      <h2 class="text-base font-medium">
        {{ editing ? 'Actualizar usuario' : 'Crear usuario' }}
      </h2>
      <p class="text-xs text-gray-500">
        {{ editing ? 'Modifica los campos que desees' : 'Completa los campos del nuevo usuario' }}
      </p>
    </div>
    <button
      (click)="closeDrawer()"
      class="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1">
      <i class="fa-solid fa-xmark fa-lg"></i>
    </button>
  </div>

  <!-- Drawer body -->
<div class="flex-1 overflow-y-auto px-6 py-5">
  <form [formGroup]="userForm" class="flex flex-col gap-4">

    <!-- NIP -->
    <div class="flex flex-col gap-1">
      <label class="text-xs text-gray-500 font-medium">NIP</label>
      @if(editing) {
        <p class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400">
        {{ f.nip.value }}
      </p>
      }@else {
        <input
        type="number"
        formControlName="nip"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
        >
      }

      @if (f.nip.touched && f.nip.invalid) {
        <p class="text-xs text-red  -500">Email inválido</p>
      }

    </div>

    <!-- Email -->
    <div class="flex flex-col gap-1">
      <label class="text-xs text-gray-500 font-medium">Email</label>
      @if(editing){
        <p class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400">
          {{ f.email.value }}
        </p>
      }
      @else {
        <input
        type="email"
        formControlName="email"
        placeholder="juan@gmail.com"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
        >
      }

      @if (f.email.touched && f.email.invalid) {
        <p class="text-xs text-red-500">Email inválido</p>
      }


    </div>

    <!-- Nombre -->
    <div class="flex flex-col gap-1">
      <label class="text-xs text-gray-500 font-medium">Nombre</label>
      <input
        type="text"
        formControlName="name"
        placeholder="Ej: Juan Pérez"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
      />
      @if (f.name.touched && f.name.invalid) {
        <p class="text-xs text-red-500">Nombre inválido</p>
      }
    </div>

    <!-- Password -->
     @if(!editing) {
      <div class="flex flex-col gap-1">
      <label class="text-xs text-gray-500 font-medium">Contraseña</label>
      <input
        type="password"
        formControlName="password"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
      />
      @if (f.password.touched && f.password.invalid) {
        <p class="text-xs text-red-500">Tamaño minimo 7</p>
      }
    </div>
     }

    <!-- Fecha de nacimiento -->
    <div class="flex flex-col gap-1">
      <label class="text-xs text-gray-500 font-medium">Fecha de nacimiento</label>

      @if(editing){
        <p class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400">
        {{ f.birth.value | date }}
      </p>
      }@else {
        <input
        type="date"
        formControlName="birth"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
      />
      }

       @if (f.birth.touched && f.birth.invalid) {
        <p class="text-xs text-red-500">Nombre inválido</p>
      }
    </div>

    <!-- Genero -->
    <div class="flex flex-col gap-1">
      <label class="text-xs text-gray-500 font-medium">Género</label>
      @if(editing){
        <p class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400">
        {{ f.sex.value == null ? 'No especificado' : f.sex.value == 'M' ? 'Masculino' : 'Femenino' }}
      </p>
      }
      @else {

        <select
          formControlName="sex"
          class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
          >
          <option value="">Género</option>
          <option value="F">Femenino</option>
          <option value="M">Masculino</option>
        </select>
      }

      @if (f.sex.touched && f.sex.invalid) {
        <p class="text-xs text-red-500">Género inválido</p>
      }

    </div>

    <!-- Rol -->
    <div class="flex flex-col gap-1">
      <label class="text-xs text-gray-500 font-medium">Rol</label>
      <select
        formControlName="roles"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
      >
      <option value="">Rol</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      @if (f.roles.touched && f.roles.invalid) {
        <p class="text-xs text-red-500">Rol inválido</p>
      }
    </div>

    <!-- Dirección -->
    <div class="flex flex-col gap-1">
      <label class="text-xs text-gray-500 font-medium">Dirección</label>
      <input
        type="text"
        formControlName="address"
        placeholder="Ej: Calle 123"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
      />
      @if (f.address.touched && f.address.invalid) {
        <p class="text-xs text-red-500">Dirección inválida</p>
      }
    </div>

    <!-- Teléfono -->
    <div class="flex flex-col gap-1">
      <label class="text-xs text-gray-500 font-medium">Teléfono</label>
      <input
        type="text"
        formControlName="telf"
        placeholder="Ej: 3001234567"
        class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
      />
      @if (f.telf.touched && f.telf.invalid) {
        <p class="text-xs text-red-500">Teléfono inválido</p>
      }
    </div>

  </form>
</div>

  <!-- Drawer footer -->
  <div class="px-6 py-4 border-t border-gray-100 flex gap-3">
    <button
      (click)="editing ? updateUser() : createUser()"
      class="flex-1 text-white py-2 rounded-lg text-sm font-medium transition cursor-pointer hover:opacity-90"
      style="background: #D97706;">
      {{ editing ? 'Actualizar' : 'Crear usuario' }}
    </button>
    <button
      (click)="closeDrawer()"
      class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-medium transition cursor-pointer">
      Cancelar
    </button>
  </div>

</div>

  `,
  styles: ``,
})
export class UserForm {
  @Input() user: User | null = null;
  @Input() drawerOpen!: boolean;
  @Output() closeDrawerEvent = new EventEmitter();
  @Output() refresh = new EventEmitter();
  @Input() editing = false;
  @Input() drawerAnimated = false;

  fb = inject(FormBuilder);
  userService = inject(UserService);
  alertService = inject(AlertService);

  userForm = this.fb.nonNullable.group({
    nip: [0],
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(7)]],
    roles: ['', [Validators.required, Validators.pattern(/^(admin|user)$/)]],
    birth: [new Date()],
    sex: ['', [Validators.pattern(/^[MF]$/)]],
    address: ['', []],
    telf: ['', []],
    password: ['', [Validators.required, Validators.minLength(7)]]
  });

  ngOnChanges(changes : SimpleChanges)
  {

    const passwordConstrol = this.userForm.get('password');

    if(changes['editing']) {
      if(this.editing) {
        passwordConstrol?.clearValidators();
      }
      else {
        passwordConstrol?.addValidators([Validators.required, Validators.minLength(7)]);
      }
    }

    if(changes['user'] && changes['user'].currentValue != null)
    {
      this.fillFormToEdit(changes['user'].currentValue);
    }
  }

  ngOnInit() {
  }


  selectAction() {
    this.editing ? this.updateUser() : this.createUser();
  }

  fillFormToEdit(user: User)
  {
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    const { roles, birth, ...data } = user;
      this.userForm.patchValue({
        roles: roles[0],
        birth: birth ?? undefined,
        ...data,
      });
  }

  closeDrawer()
  {
    this.closeDrawerEvent.emit();
    this.clearForm();

  }

  clearForm()
  {
    this.userForm.reset();
  }


  get f() {
    return this.userForm.controls;
  }

  createUser() {
    if(this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const {roles, ...data} = this.userForm.getRawValue();

    let user: UserRegisterDto = data;
    user.rol = roles.substring(5);


    this.userService.postUser(user).subscribe(
      {
        next: res=> {
          this.closeDrawer();
          this.refresh.emit();
          this.alertService.success(`Usuario ${res.data.name} creado`);
          this.alertService.clear(3000);
        },
        error: err=> {
          this.alertService.error(err.error.error);
          this.alertService.clear(3000);
        }
      }
    )
  }

  updateUser() {


    if(this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      console.log('invalid form 1', 'errors: ', this.userForm);
      return;
    }

    let { roles, ...userData } = this.userForm.getRawValue();

    roles = roles.toUpperCase();

        console.log('helllo')

    this.userService.putUser({ rol: roles, ...userData }).subscribe({
      next: (res) => {
        this.closeDrawer();
        this.refresh.emit();
        this.alertService.success('Usuario actualizado');
        this.alertService.clear(3000);
      },
    });
  }
}
