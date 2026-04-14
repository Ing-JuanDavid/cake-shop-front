import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../../../core/models/order.model';
import { OrderCard } from './order-card/order-card.component';
import { NotFoundView } from '../../../shared/info-views/not-found/not-found.component';

@Component({
  selector: 'orders-view',
  imports: [NotFoundView, OrderCard],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8 text-yellow-900">
      <!-- Header -->
      <div class="mb-6 border-b border-yellow-900/20 pb-4">
        <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50 mb-1">
          Historial
        </p>
        <h2 class="text-2xl font-semibold uppercase tracking-widest">Mis Pedidos</h2>
        <p class="text-sm text-yellow-900/50 mt-1">{{ ordersList.length }} pedidos realizados</p>
      </div>

      <!-- List -->
      <div class="flex flex-col gap-4 overflow-y-auto max-h-[65vh]">
        @for (order of ordersList; track order.orderId) {
          <orders-order-card [order]="order"></orders-order-card>
        } @empty {
          <info-view-not-found [msj]="'Aún no tienes pedidos'"></info-view-not-found>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class Orders {
  ordersList: Order[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe({
      next: res => this.ordersList = res.data
    });
  }
}
