import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../../../core/models/order.model';
import { AlertService } from '../../../core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderProductList } from './order-product-list/order-product-list.component';
import { ORDER_STATUSES } from '../../../core/models/orderStatuses.model';

@Component({
  selector: 'order-details-view',
  imports: [CommonModule, OrderProductList],
  template: `
    <div class="max-w-2xl mx-auto px-4 py-8 text-yellow-900">

      @if (order) {

        <!-- Header -->
        <div class="mb-6 border-b border-yellow-900/20 pb-4">
          <button
            (click)="goToOrders()"
            class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-yellow-900/50 hover:text-yellow-700 transition-colors mb-3 cursor-pointer">
            <i class="fa-solid fa-arrow-left text-xs"></i>
            Mis pedidos
          </button>
          <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50 mb-1">Detalle</p>
          <h2 class="text-2xl font-semibold uppercase tracking-widest">Pedido #{{ order.orderId }}</h2>
          <p class="text-sm text-yellow-900/50 mt-1">{{ order.date | date:'mediumDate' }}</p>
        </div>

        <!-- Status + Total -->
        <div class="flex items-center justify-between py-4 border-b border-yellow-900/10">

          <div class="flex flex-col gap-1">
            <p class="text-xs text-center font-semibold uppercase tracking-widest text-yellow-900/50">Estado</p>
            <span class="text-xs px-2.5 py-0.5 rounded-full border font-medium w-fit"
              [ngClass]="{
                'border-yellow-400 text-yellow-700':  order.status === 'PENDING',
                'border-blue-400 text-blue-700':      order.status === 'IN_PROGRESS',
                'border-purple-400 text-purple-700':  order.status === 'SHIPPED',
                'border-green-400 text-green-700':    order.status === 'DELIVERED',
                'border-red-400 text-red-700':        order.status === 'CANCELED'
              }">
              {{ statusLabel(order.status) }}
            </span>
          </div>

          <div class="flex flex-col gap-1 items-center">
            <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50">Productos</p>
            <p class="text-sm font-medium">{{ order.products.length }} producto(s)</p>
          </div>

          <div class="flex flex-col gap-1 items-end">
            <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50">Total</p>
            <p class="text-sm font-semibold">{{ "$" + (order.total | number:'1.0-0') }}</p>
          </div>

        </div>

        <!-- Products -->
        @if (order.products.length > 0) {
          <div class="mt-6">
            <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50 mb-3">Productos</p>
            <div class="max-h-72 overflow-y-auto pr-1">
              <order-details-order-product-list [order]="order"></order-details-order-product-list>
            </div>
          </div>
        }

      }

    </div>
  `,
  styles: ``,
})
export class OrderDetails {
  orderId!: string;
  order: Order | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private alertService: AlertService,
  ) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (res) => this.order = res.data,
      error: (err) => this.alertService.error(err.error.error),
    });
  }

  goToOrders() {
    this.router.navigate(['user/orders']);
  }

  statusLabel(status?: string) {
    return ORDER_STATUSES.find(o => o.value === status)?.label ?? status;
  }
}
