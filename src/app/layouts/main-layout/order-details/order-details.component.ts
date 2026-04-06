import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../../../core/models/order.model';
import { AlertService } from '../../../core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderProduct } from './order-product/order-product.component';
import { OrderProductList } from './order-product-list/order-product-list.component';
import { ORDER_STATUSES } from '../../../core/models/orderStatuses.model';

@Component({
  selector: 'order-details-view',
  imports: [CommonModule, OrderProductList],
  template: `
  <div class="p-6 max-w-2xl mx-auto space-y-6">
    @if (order) {

      <!-- Header -->
      <div class="flex items-center gap-3">
        <button
          (click)="goToOrders()"
          class="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
          <i class="fa-solid fa-arrow-left fa-lg"></i>
        </button>
        <div>
          <h1 class="text-2xl font-bold">Pedido #{{ order.orderId }}</h1>
          <p class="text-gray-500 text-sm">{{ order.date | date:'mediumDate' }}</p>
        </div>
      </div>

      <!-- Status + Info -->
      <section class="bg-white rounded-2xl border border-[#EFE0C8] shadow-sm p-5 space-y-4">

        <!-- Status + Total -->
        <div class="flex items-center justify-between">
          <span
            class="text-xs px-2.5 py-0.5 rounded-full font-medium"
            [ngClass]="{
              'bg-yellow-100 text-yellow-800': order.status === 'PENDING',
              'bg-blue-100 text-blue-800': order.status === 'IN_PROGRESS',
              'bg-purple-100 text-purple-800': order.status === 'SHIPPED',
              'bg-green-100 text-green-800': order.status === 'DELIVERED',
              'bg-red-100 text-red-800': order.status === 'CANCELED'
            }">
            {{ statusLabel(order.status) }}
          </span>
          <p class="text-lg font-bold text-yellow-700">
            {{ "$" + (order.total | number:'1.0-0') }}
          </p>
        </div>

        <!-- Info grid -->
        <div class="grid grid-cols-2 gap-4 pt-2 border-t border-[#EFE0C8]">
          <div class="flex flex-col gap-1">
            <label class="text-xs text-gray-400 font-medium">Fecha</label>
            <p class="text-sm font-medium text-gray-700">{{ order.date | date:'mediumDate' }}</p>
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs text-gray-400 font-medium">Productos</label>
            <p class="text-sm font-medium text-gray-700">{{ order.products.length }} producto(s)</p>
          </div>
        </div>

      </section>

      <!-- Products -->
      @if (order.products.length > 0) {
        <section class="bg-white rounded-2xl border border-[#EFE0C8] shadow-sm p-5">
          <h2 class="text-base font-medium mb-4">Productos</h2>
          <div class="max-h-72 overflow-y-auto pr-1">
            <order-details-order-product-list [order]="order"></order-details-order-product-list>
          </div>
        </section>
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
      next: (res) => {
        this.order = res.data;
        console.log(this.order);
      },
      error: (err) => this.alertService.error(err.error.error),
    });
  }

  goToOrders() {
    this.router.navigate(['user/orders']);
  }

   statusLabel(status?: string)
    {
      return ORDER_STATUSES.find(o => o.value == status)?.label ?? status;
    }
}
