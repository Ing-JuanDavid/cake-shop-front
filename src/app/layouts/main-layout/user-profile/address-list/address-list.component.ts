import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Address } from '../../../../core/models/address.model';
import { AddressService } from '../../../../core/services/address.service';
import { AlertService } from '../../../../core/services/alert.service';
import { addressToString } from '../../../../core/helpers/defaultAddress';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressDto } from '../../../../core/models/addressDto.model';

@Component({
  selector: 'user-profile-address-list',
  imports: [ReactiveFormsModule],
  template: `
    <div class="mt-10">

      <!-- Header -->
      <div class="border-b border-yellow-900/20 pb-4 mb-5">
        <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50 mb-1">Envío</p>
        <h3 class="text-xl font-semibold uppercase tracking-widest text-yellow-900">Mis Direcciones</h3>
        <p class="text-sm text-yellow-900/50 mt-1">{{ addresses.length }} dirección(es) registrada(s)</p>
      </div>

      <!-- Address list -->
      <div class="flex flex-col">
        @for (address of addresses; track address.addressId) {
          <div class="flex items-center justify-between py-3 border-b border-yellow-900/10 hover:bg-yellow-900/5 transition-colors px-2">

            <div class="flex items-start gap-3 flex-1 min-w-0">
              <i class="fa-solid fa-location-dot text-sm mt-0.5"
                [class.text-yellow-900]="address.default"
                [class.text-yellow-900/30]="!address.default"></i>
              <div class="flex flex-col min-w-0">
                <p class="text-sm font-medium truncate">{{ addressToString(address) }}</p>
                @if (address.description) {
                  <p class="text-xs text-yellow-900/50 mt-0.5">{{ address.description }}</p>
                }
              </div>
            </div>

            <div class="flex items-center gap-3 shrink-0 ml-4">
              @if (address.default) {
                <span class="text-xs border border-yellow-900/30 text-yellow-900/60 px-2.5 py-0.5 rounded-full">
                  Domicilio
                </span>
              } @else {
                <button
                  (click)="setDefault(address)"
                  class="text-xs border border-yellow-900/20 text-yellow-900/50 px-2.5 py-0.5 rounded-full
                         hover:border-yellow-900 hover:text-yellow-900 transition-all">
                  Establecer domicilio
                </button>
              }
              <button
                (click)="deleteAddress(address)"
                class="text-yellow-900/20 hover:text-red-400 transition-colors"
                title="Eliminar">
                <i class="fa-solid fa-trash text-xs"></i>
              </button>
            </div>

          </div>
        } @empty {
          <div class="flex flex-col items-center gap-4 py-10 text-yellow-900/40">
            <i class="fa-solid fa-location-dot fa-2xl"></i>
            <p class="text-sm font-semibold uppercase tracking-widest">Sin direcciones registradas</p>
          </div>
        }
      </div>

      <!-- Add address button -->
      <div class="flex justify-end mt-4">
        <button
          (click)="openModal()"
          class="flex items-center gap-2 border border-yellow-900 text-yellow-900 px-5 py-2 rounded-full text-xs font-semibold
                       hover:bg-yellow-900 hover:text-yellow-50 transition-all cursor-pointer">
          <i class="fa-solid fa-plus text-xs"></i>
          Nueva dirección
        </button>
      </div>

    </div>

    <!-- Modal backdrop -->
    @if (showModal) {
      <div class="fixed inset-0 z-50 flex items-center justify-center px-4"
           style="background: rgba(0,0,0,0.3)"
           (click)="closeModal()">

        <!-- Modal panel -->
        <div class="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
             (click)="$event.stopPropagation()">

          <!-- Modal header -->
          <div class="flex items-center justify-between mb-6 border-b border-yellow-900/20 pb-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50">Envío</p>
              <h3 class="text-lg font-semibold uppercase tracking-widest text-yellow-900">Nueva Dirección</h3>
            </div>
            <button (click)="closeModal()" class="text-yellow-900/30 hover:text-yellow-900 transition-colors">
              <i class="fa-solid fa-xmark fa-lg"></i>
            </button>
          </div>

          <!-- Modal form -->
          <form [formGroup]="addressForm" (ngSubmit)="submitAddress()" class="space-y-4">

            <!-- City + Department -->
            <div class="flex gap-4">
              <div class="flex-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">Ciudad</label>
                <div class="flex items-center gap-2 border-b-2 pb-1 transition-colors"
                  [class.border-yellow-900]="af.city.touched && af.city.valid"
                  [class.border-red-400]="af.city.touched && af.city.invalid"
                  [class.border-yellow-900/20]="!af.city.touched">
                  <i class="fa-solid fa-city text-xs text-yellow-900/40"></i>
                  <input type="text" formControlName="city" placeholder="Ciudad"
                    class="bg-transparent outline-none text-sm text-yellow-900 placeholder:text-yellow-900/30 w-full py-1" />
                </div>
                @if (af.city.touched && af.city.invalid) {
                  <small class="text-red-400 text-xs flex items-center gap-1 mt-1">
                    <i class="fa-solid fa-circle-exclamation"></i> Requerido
                  </small>
                }
              </div>

              <div class="flex-1">
                <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">Departamento</label>
                <div class="flex items-center gap-2 border-b-2 pb-1 transition-colors"
                  [class.border-yellow-900]="af.department.touched && af.department.valid"
                  [class.border-red-400]="af.department.touched && af.department.invalid"
                  [class.border-yellow-900/20]="!af.department.touched">
                  <i class="fa-solid fa-map text-xs text-yellow-900/40"></i>
                  <input type="text" formControlName="department" placeholder="Departamento"
                    class="bg-transparent outline-none text-sm text-yellow-900 placeholder:text-yellow-900/30 w-full py-1" />
                </div>
                @if (af.department.touched && af.department.invalid) {
                  <small class="text-red-400 text-xs flex items-center gap-1 mt-1">
                    <i class="fa-solid fa-circle-exclamation"></i> Requerido
                  </small>
                }
              </div>
            </div>

            <!-- Address line -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">Dirección</label>
              <div class="flex items-center gap-2 border-b-2 pb-1 transition-colors"
                [class.border-yellow-900]="af.addressLine.touched && af.addressLine.valid"
                [class.border-red-400]="af.addressLine.touched && af.addressLine.invalid"
                [class.border-yellow-900/20]="!af.addressLine.touched">
                <i class="fa-solid fa-location-dot text-xs text-yellow-900/40"></i>
                <input type="text" formControlName="addressLine" placeholder="Calle, número, barrio..."
                  class="bg-transparent outline-none text-sm text-yellow-900 placeholder:text-yellow-900/30 w-full py-1" />
              </div>
              @if (af.addressLine.touched && af.addressLine.invalid) {
                <small class="text-red-400 text-xs flex items-center gap-1 mt-1">
                  <i class="fa-solid fa-circle-exclamation"></i> Mínimo 5 caracteres
                </small>
              }
            </div>

            <!-- Description -->
            <div>
              <label class="block text-xs font-semibold uppercase tracking-wider text-yellow-900/60 mb-1">Descripción <span class="normal-case text-yellow-900/30">(opcional)</span></label>
              <div class="flex items-center gap-2 border-b-2 border-yellow-900/20 pb-1">
                <i class="fa-solid fa-note-sticky text-xs text-yellow-900/40"></i>
                <input type="text" formControlName="description" placeholder="Ej: Casa, Oficina..."
                  class="bg-transparent outline-none text-sm text-yellow-900 placeholder:text-yellow-900/30 w-full py-1" />
              </div>
            </div>

            <!-- Set as default -->
            <div class="flex items-center gap-2 pt-1">
              <input type="checkbox" formControlName="isDefault" id="isDefault"
                class="accent-yellow-900 cursor-pointer" />
              <label for="isDefault" class="text-xs text-yellow-900/60 cursor-pointer">
                Establecer como domicilio principal
              </label>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-yellow-900/10">
              <button type="button" (click)="closeModal()"
                class="text-xs text-yellow-900/50 hover:text-yellow-900 transition-colors px-4 py-2">
                Cancelar
              </button>
              <button type="submit" [disabled]="addressForm.invalid"
                class="flex items-center gap-2 border border-yellow-900 text-yellow-900 px-5 py-2 rounded-full text-xs font-semibold
                       hover:bg-yellow-900 hover:text-yellow-50 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                <i class="fa-solid fa-plus text-xs"></i>
                Agregar
              </button>
            </div>

          </form>
        </div>
      </div>
    }
  `,
  styles: ``,
})
export class AddressList {

  @Input() addresses: Address[] = [];

  private addressService = inject(AddressService);
  private alertService = inject(AlertService);
  private fb = inject(FormBuilder);

  addressToString = addressToString;
  showModal = false;

  addressForm = this.fb.nonNullable.group({
    city:        ['', Validators.required],
    department:  ['', Validators.required],
    addressLine: ['', [Validators.required, Validators.minLength(5)]],
    description: [''],
    isDefault:   [false],
  });

  get af() {
    return this.addressForm.controls;
  }

  openModal() {
    this.addressForm.reset();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.addressForm.reset();
  }

  loadAddresses() {
    this.addressService.getAddresses().subscribe({
      next: res => {
        this.addresses = res.data.reverse();
      },
      error: err => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      }
    });
  }

  setDefault(address: Address) {
    this.addressService.setDefaultAddress(address.addressId).subscribe({
      next: () => {
        this.loadAddresses();
        this.alertService.success('Domicilio establecido');
        this.alertService.clear(2000);
      },
      error: err => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      }
    });
  }

  deleteAddress(address: Address) {
    this.addressService.deleteAddress(address.addressId).subscribe({
      next: () => {
        this.addresses = this.addresses.filter(a => a.addressId !== address.addressId);
        this.alertService.success('Dirección eliminada');
        this.alertService.clear(2000);
      },
      error: err => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      }
    });
  }

  submitAddress() {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.addressService.createAddress(this.addressForm.getRawValue() as AddressDto).subscribe({
      next: () => {
        this.closeModal();
        this.loadAddresses();
        this.alertService.success('Dirección agregada');
        this.alertService.clear(2000);
      },
      error: err => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      }
    });
  }
}
