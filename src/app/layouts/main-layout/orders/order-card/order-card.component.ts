import { Component, Input } from '@angular/core';
import { Order } from '../../../../core/models/order.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'orders-order-card',
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-3 p-4 border border-zinc-300 rounded-md shadow-sm mb-7">

      <!-- Header -->
      <div class="border-b border-zinc-300 pb-2 w-full">
        <p class="text-sm text-zinc-600">
          {{ order?.date | date: 'mediumDate' }}
        </p>
      </div>

      <!-- Order Info -->
      <div class="flex flex-col gap-1 text-left w-full text-yellow-900">
        <p class="font-medium">Estado: <span class="font-bold">{{ order?.status }}</span></p>
        <p class="text-sm">Productos: <span class="text-zinc-700">{{ order?.products?.length }}</span></p>
        <p class="font-semibold">Total: {{ '$' + (order?.total | number: '1.0-0') }}</p>
      </div>

      <!-- Action -->
      <div class="flex justify-end w-full">
        <button
        (click)="goToOrden(order?.orderId)"
        class="bg-yellow-900 text-white px-3 py-1.5 rounded-sm text-sm hover:bg-yellow-700 hover:cursor-pointer transition">
          Ver orden
        </button>
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

}
