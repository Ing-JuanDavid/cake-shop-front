import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { UserComplete } from '../../../core/models/userComplete.model';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { AlertService } from '../../../core/services/alert.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'admin-user-details',
  imports: [NgClass, CommonModule],
  template: `
    @if (currentUser) {
      <div class="p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-center gap-3">
          <button
            (click)="router.navigate(['admin/users'])"
            class="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          >
            <i class="fa-solid fa-arrow-left fa-lg"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold">{{ currentUser.name }}</h1>
            <p class="text-gray-500 text-sm">NIP: {{ currentUser.nip }}</p>
          </div>
        </div>

        <!-- Info card -->
        <section class="bg-white shadow-xl rounded-2xl p-6">
          <!-- Avatar + status -->
          <div class="flex justify-between">
            <div class="flex items-center gap-4 mb-6">
              <div
                class="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                style="background: #D97706;"
              >
                {{ currentUser.name.charAt(0) }}
              </div>

              <div>
                <h2 class="text-lg font-semibold">{{ currentUser.name }}</h2>
                <div class="flex items-center gap-2 mt-1">
                  <span
                    [ngClass]="
                      currentUser.accountNonLocked
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    "
                    class="text-xs px-2 py-0.5 rounded-full font-medium"
                  >
                    {{ currentUser.accountNonLocked ? 'Activo' : 'Bloqueado' }}
                  </span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-100 text-yellow-800"
                  >
                    {{ parseRole(currentUser.roles[0]) }}
                  </span>
                </div>
              </div>
            </div>

             <button
                    (click)="currentUser.accountNonLocked ? lockUser(currentUser) : unLockUser(currentUser)"
                    [ngClass]="
                      currentUser.accountNonLocked
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    "
                    class="border-none rounded-md px-3 py-3 cursor-pointer text-xs transition self-center"
                    [title]="currentUser.accountNonLocked ? 'Bloquear' : 'Desbloquear'"
                  >
                    @if (currentUser.accountNonLocked) {
                      <i class="fa-solid fa-lock fa-lg"></i>
                    } @else {
                      <i class="fa-solid fa-unlock fa-lg"></i>
                    }
                  </button>
          </div>

          <!-- Personal info grid -->
          <div class="grid md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-400 font-medium">Email</label>
              <p class="text-sm font-medium">{{ currentUser.email }}</p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-400 font-medium">Teléfono</label>
              <p class="text-sm font-medium">{{ currentUser.telf || 'No especificado' }}</p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-400 font-medium">Dirección</label>
              <p class="text-sm font-medium">{{ currentUser.address || 'No especificado' }}</p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-400 font-medium">Fecha de nacimiento</label>
              <p class="text-sm font-medium">{{ currentUser.birth | date: 'mediumDate' }}</p>
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-400 font-medium">Género</label>
              <p class="text-sm font-medium">
                {{
                  currentUser.sex == 'M'
                    ? 'Masculino'
                    : currentUser.sex == 'F'
                      ? 'Femenino'
                      : 'No especificado'
                }}
              </p>
            </div>
          </div>
        </section>

        <!-- Orders — only for ROLE_USER -->
        @if (currentUser.roles[0] === 'ROLE_USER') {
          <section class="bg-white shadow-xl rounded-2xl p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-medium">Historial de pedidos</h2>
              <span class="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                {{ currentUser.orders.length }} pedidos
              </span>
            </div>

            @if (currentUser.orders.length === 0) {
              <p class="text-sm text-gray-400 text-center py-4">No hay pedidos registrados</p>
            } @else {
              <div class="overflow-x-auto rounded-xl border border-gray-200">
                <table class="w-full border-collapse text-sm">
                  <thead>
                    <tr style="background: #D97706;">
                      <th class="p-3 text-left text-white text-xs font-medium">#ID</th>
                      <th class="p-3 text-left text-white text-xs font-medium">Fecha</th>
                      <th class="p-3 text-left text-white text-xs font-medium">Productos</th>
                      <th class="p-3 text-left text-white text-xs font-medium">Total</th>
                      <th class="p-3 text-left text-white text-xs font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (order of currentUser.orders; track order.orderId) {
                      <tr
                        (click)="goToOrderDetails(currentUser.nip.toString(), order.orderId.toString())"
                        class="border-b border-gray-100 hover:bg-yellow-50 transition-colors last:border-none hover:cursor-pointer"
                      >
                        <td class="p-3 text-gray-400 text-xs">#{{ order.orderId }}</td>
                        <td class="p-3 text-xs">{{ order.date | date: 'mediumDate' }}</td>
                        <td class="p-3 text-xs">{{ order.products.length }} producto(s)</td>
                        <td class="p-3 text-xs">$ {{ order.total | number: '1.0-0' }}</td>
                        <td class="p-3">
                          <span
                            [ngClass]="
                              order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            "
                            class="text-xs px-2 py-0.5 rounded-full font-medium"
                          >
                            {{ order.status }}
                          </span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </section>
        }

        <!-- Rates -->
        <section class="bg-white shadow-xl rounded-2xl p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-base font-medium">Reseñas</h2>
            <span class="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
              {{ currentUser.rates.length }} reseñas
            </span>
          </div>

          @if (currentUser.rates.length === 0) {
            <p class="text-sm text-gray-400 text-center py-4">No hay reseñas registradas</p>
          } @else {
            <div class="grid md:grid-cols-2 gap-3">
              @for (rate of currentUser.rates; track rate.rateId) {
                <div
                  class="border border-gray-100 rounded-xl p-4 hover:bg-yellow-50 transition-colors"
                >
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-medium">{{ rate.productName }}</p>
                    <div class="flex items-center gap-1">
                      @for (star of [1, 2, 3, 4, 5]; track star) {
                        <i
                          class="fa-star text-xs"
                          [ngClass]="
                            star <= rate.score
                              ? 'fa-solid text-yellow-500'
                              : 'fa-regular text-gray-300'
                          "
                        >
                        </i>
                      }
                    </div>
                  </div>
                  <p class="text-xs text-gray-500">{{ rate.comment }}</p>
                  <p class="text-xs text-gray-400 mt-2">
                    {{ rate.creationDate | date: 'mediumDate' }}
                  </p>
                </div>
              }
            </div>
          }
        </section>
      </div>
    }
  `,
  styles: ``,
})
export class UserDetails {
  currentUser!: UserComplete;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    if (!this.userId?.match(/^\d+$/)) {
      this.router.navigate(['admin/users']);
      return;
    }

    this.userService.getUser(this.userId).subscribe({
      next: (res) => {
        this.currentUser = res.data;
      },
      error: () => {
        this.router.navigate(['admin/users/not-found']);
      },
    });
  }

  get userId() {
    return this.route.snapshot.paramMap.get('userId');
  }

  parseRole(role: string) {
    return role.includes('USER') ? 'User' : 'Admin';
  }

   lockUser(user: UserComplete) {
      this.userService.lockUser(user.nip).subscribe({
        next: (res) => {
          this.alertService.success('Usuario bloqueado');
          this.loadUser();
          this.alertService.clear(2000);
        },
        error: (err) => {
          this.alertService.error(err.error.error);
          this.alertService.clear(2000);
        },
      });
    }

    unLockUser(user: UserComplete) {
      this.userService.unLockUser(user.nip).subscribe({
        next: (res) => {
          this.alertService.success('Usuario desbloqueado');
          this.loadUser();
          this.alertService.clear(2000);
        },
        error: (err) => {
          this.alertService.error(err.error.error);
          this.alertService.clear(2000);
        },
      });
    }

    goToOrderDetails(userId: string, orderId : string)
    {
      this.router.navigate([`admin/users/${userId}/orders/${orderId}`]);

    }
}
