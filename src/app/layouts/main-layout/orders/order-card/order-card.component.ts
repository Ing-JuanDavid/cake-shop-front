import { Component, Input } from '@angular/core';
import { Order } from '../../../../core/models/order.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ORDER_STATUSES } from '../../../../core/models/orderStatuses.model';

@Component({
  selector: 'orders-order-card',
  imports: [CommonModule],
  template: `
     <div class="border-b border-yellow-900/10 py-4 hover:bg-yellow-900/5 transition-colors px-2 cursor-pointer"
         (click)="goToOrden(order?.orderId)">

      <!-- Top row -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-box text-yellow-900/40 text-sm"></i>
          <span class="text-sm font-semibold">Pedido #{{ order?.orderId }}</span>
        </div>
        <span class="text-xs text-yellow-900/40">{{ order?.date | date:'mediumDate' }}</span>
      </div>

      <!-- Info row -->
      <div class="flex items-center justify-between">

        <div class="flex flex-col gap-0.5">
          <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50">Productos</p>
          <p class="text-sm">{{ order?.products?.length }} producto(s)</p>
        </div>

        <div class="flex flex-col gap-0.5 items-center">
          <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50">Estado</p>
          <span class="text-xs px-2.5 py-0.5 border rounded-full font-medium"
            [ngClass]="{
              'border-yellow-400 text-yellow-700':   order?.status === 'PENDING',
              'border-blue-400 text-blue-700':        order?.status === 'IN_PROGRESS',
              'border-purple-400 text-purple-700':    order?.status === 'SHIPPED',
              'border-green-400 text-green-700':      order?.status === 'DELIVERED',
              'border-red-400 text-red-700':          order?.status === 'CANCELED'
            }">
            {{ statusLabel(order?.status) }}
          </span>
        </div>

        <div class="flex flex-col gap-0.5 items-end">
          <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50">Total</p>
          <p class="text-sm font-semibold">{{ "" + (order?.total | number:'1.0-0') }}</p>
        </div>

      </div>

      <!-- Footer -->
      <div class="flex justify-end mt-3">
        <span class="flex items-center gap-1.5 text-xs font-semibold text-yellow-900/50 hover:text-yellow-700 transition-colors">
          Ver detalles <i class="fa-solid fa-arrow-right text-xs"></i>
        </span>
      </div>

    </div>

  `,
  styles: `
  `,
})
export class OrderCard {
  @Input() order: Order | null = null;

  constructor(
    private router: Router
  ){}

   goToOrden(id: any) {
    this.router.navigate([`/user/orders/${id}`]);
  }

  statusLabel(status?: string)
  {
    return ORDER_STATUSES.find(o => o.value == status)?.label ?? status;
  }

}
