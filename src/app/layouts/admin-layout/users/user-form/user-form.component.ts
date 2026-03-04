import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../../main-layout/services/alert.service';

@Component({
  selector: 'user-view-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="w-full h-dvh bg-black/35 fixed inset-0 flex justify-center items-center" (click)="closeModal()">

      <div class="bg-white px-4 py-2 rounded-2xl" (click)="$event.stopPropagation()">


      <div class="flex justify-between">
         <h2 class="text-xl font-semibold">
          {{ editing ? 'Actualizar usuario' : 'Crear usuario' }}
        </h2>
        <button (click)="closeModal()" class="px-2 py-0 rounded-md hover:cursor-pointer hover:bg-red-500 hover:text-white transition">X</button>
      </div>


        <form [formGroup]="userForm" class="grid md:grid-cols-2 gap-4">

          <div>
            <label class="block text-sm font-medium mb-1">NIP</label>
            <p class="w-full border rounded-lg px-3 py-2">
              {{f.nip.value}}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <p class="w-full border rounded-lg px-3 py-2">
              {{f.email.value}}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Nombre</label>
            <input type="text" formControlName="name"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none">
            @if(f.name.touched && f.name.invalid) {
                <p class="text-sm text-red-500">Nombre invalido</p>
              }
          </div>


          <div>
            <label class="block text-sm font-medium mb-1">Fecha de nacimiento</label>
            <p class="w-full border rounded-lg px-3 py-2">
              {{f.birth.value | date}}
            </p>
          </div>

          <!-- Cantidad -->
          <div>
            <label class="block text-sm font-medium mb-1">Genero</label>
            <p class="w-full border rounded-lg px-3 py-2">
              {{f.sex.value == 'M' ? 'Masculino' : 'Femenino' }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Roles</label>
            <select formControlName="roles" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none">
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_USER">User</option>
            </select>
            @if(f.roles.touched && f.roles.invalid) {
                <p class="text-sm text-red-500">Rol invalido</p>
              }
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Direccion</label>
            <input type="text" formControlName="address"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none">
            @if(f.address.touched && f.address.invalid) {
                <p class="text-sm text-red-500">Direccion invalida</p>
              }
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Telefono</label>
            <input type="text" formControlName="telf"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-yellow-500 outline-none">
            @if(f.telf.touched && f.telf.invalid) {
                <p class="text-sm text-red-500">Telefono invalida</p>
              }
          </div>

          <!-- Botones -->
          <div class="md:col-span-2 flex gap-3 pt-2">
            <button type="submit"
            (click)="selectAction()"
              class="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-lg transition hover:cursor-pointer">
              {{ editing ? 'Actualizar' : 'Crear' }}
            </button>

            <button type="button"
              class="bg-gray-300 hover:bg-gray-400 px-5 py-2 rounded-lg transition hover:cursor-pointer" (click)="closeModal()">
              Cancelar
            </button>
          </div>

        </form>
      </div>


    </div>
  `,
  styles: ``,
})
export class UserForm {

  @Input() user!: User;
  @Output() close = new EventEmitter();
  @Output() refresh = new EventEmitter()
  @Input() editing = false;

  fb = inject(FormBuilder);
  userService =inject(UserService);
  alertService = inject(AlertService);

  userForm = this.fb.nonNullable.group(
    {
      nip: [0],
      email: [''],
      name: [''],
      roles: ['', [Validators.required, Validators.pattern(/^(ROLE_ADMIN|ROLE_USER)$/)]],
      birth: [new Date(),],
      sex: ['', [Validators.pattern(/^[MF]$/)]],
      address: ['', [Validators.required]],
      telf: ['', [Validators.required]]
    }
  );

  ngOnInit()
  {

    const {roles, birth, ...user} = this.user;
    this.userForm.patchValue({
      roles: roles[0],
      birth: birth ?? undefined,
      ...user})
  }

  get f()
  {
    return this.userForm.controls;
  }

  closeModal()
  {
    this.editing = false;
    this.close.emit();
  }

  selectAction()
  {
    this.editing ? this.updateUser(): this.createUser();
  }


  createUser()
  {
    console.log('Creating a new user...');
  }

  updateUser()
  {
    let {roles, ...userData} = this.userForm.getRawValue();

    roles = roles.substring(5);

    this.userService.putUser({rol: roles, ...userData}).subscribe(
      {
        next: res=> {
          this.refresh.emit();
          this.alertService.success('Usuario actualizado');
          this.alertService.clear(3000);
        }
      }
    );
  }




}

// export interface User {
//   nip: number;
//   email : string;
//   name: string;
//   birth: Date | null;
//   roles : string[];
//   sex: string;
//   address: string;
//   telf: string;
// }
