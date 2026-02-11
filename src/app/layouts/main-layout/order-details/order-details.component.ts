import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../../../core/models/order.model';
import { AlertService } from '../services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderProduct } from './order-product/order-product.component';
import { OrderProductList } from './order-product-list/order-product-list.component';

@Component({
  selector: 'order-details-view',
  imports: [CommonModule, OrderProductList],
  template: `
    <div
      class="flex flex-col gap-4 p-6 border border-zinc-300 rounded-md shadow-sm max-w-lg mx-auto"
    >
      @if (order) {
        <!-- Header -->
        <div class="border-b border-zinc-300 pb-2 text-yellow-900/70">
          <h2 class="text-xl font-semibold">Detalles de la Orden</h2>
          <p class="text-s">Fecha: {{ order.date | date: 'mediumDate' }}</p>
        </div>

        <!-- Order Info -->
        <div class="text-yellow-900/70 flex flex-col gap-2">
          <p class="font-medium">
            Estado: <span class="font-normal">{{ order.status }}</span>
          </p>
          <p class="text-sm">Productos: {{ order.products.length }}</p>
          <p class="font-semibold text-lg">Total: {{ '$' + (order.total | number: '1.0-0') }}</p>
        </div>

        <!-- Products List -->

        @if (order.products.length > 0) {
          <div class="border-t border-zinc-300 pt-3">
            <h3 class="text-yellow-900/70 text-md font-medium mb-2">Productos</h3>

            <div class="flex flex-col gap-1 text-sm text-zinc-700 max-h-72 overflow-y-auto">
              <order-details-order-product-list [order]="order"></order-details-order-product-list>
            </div>
          </div>
        }

        <!-- Action -->
        <div class="flex justify-end">
          <button
            (click)="goToOrders()"
            class="mt-4 bg-yellow-900 text-white px-6 py-2 rounded-md hover:cursor-pointer
                     hover:bg-yellow-800 transition"
          >
            Volver
          </button>
        </div>
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
}
