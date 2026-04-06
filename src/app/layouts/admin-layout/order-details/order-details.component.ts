import { CommonModule } from "@angular/common";
import { OrderProductList } from "../../main-layout/order-details/order-product-list/order-product-list.component";
import { Component } from "@angular/core";
import { Order } from "../../../core/models/order.model";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "../../main-layout/services/order.service";
import { AlertService } from "../../../core/services/alert.service";
import { SessionService } from "../../../core/session/session.service";
import { ORDER_STATUSES } from "../../../core/models/orderStatuses.model";

@Component({
  selector: 'order-details-view',
  imports: [CommonModule, OrderProductList],
  template: `
    <div class="p-6 max-w-2xl mx-auto space-y-6">
      @if (order) {

        <!-- Header -->
        <div class="flex items-center gap-3">
          <button
            (click)="goToUserDetails()"
            class="text-gray-400 hover:text-gray-600 cursor-pointer transition-colors">
            <i class="fa-solid fa-arrow-left fa-lg"></i>
          </button>
          <div>
            <h1 class="text-2xl font-bold">Orden #{{ order.orderId }}</h1>
            <p class="text-gray-500 text-sm">{{ order.date | date:'mediumDate' }}</p>
          </div>
        </div>

        <!-- Status + Info -->
        <section class="bg-white shadow-xl rounded-2xl p-6 space-y-4">

          <!-- Status badge -->
          <div class="flex items-center justify-between">
            <span
              class="text-xs px-3 py-1 rounded-full font-medium"
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
              {{"$" + (order.total|number: "1.0-0") }}
            </p>
          </div>

          <!-- Info grid -->
          <div class="grid md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-400 font-medium">Dirección</label>
              <p class="text-sm font-medium">{{ order.address || 'No especificada' }}</p>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs text-gray-400 font-medium">Productos</label>
              <p class="text-sm font-medium">{{ order.products.length }} producto(s)</p>
            </div>
          </div>

          <!-- Change status — admin only -->
          @if (sessionService.currentUser()?.roles?.[0] == 'ROLE_ADMIN') {
            <div class="border-t border-gray-100 pt-4">
              <label class="text-xs text-gray-400 font-medium block mb-2">Cambiar estado</label>
              <div class="flex gap-2 flex-wrap">
                @for (status of statuses; track status.value) {
                  <button
                    (click)="changeStatus(status.value)"
                    [disabled]="order.status === status.value"
                    class="text-xs px-3 py-1.5 rounded-lg border transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    [ngClass]="order.status === status.value
                      ? 'border-yellow-500 text-yellow-700 bg-yellow-50'
                      : 'border-gray-200 text-gray-600 hover:border-yellow-400 hover:text-yellow-600'">
                    {{ status.label }}
                  </button>
                }
              </div>
            </div>
          }

        </section>

        <!-- Products -->
        @if (order.products.length > 0) {
          <section class="bg-white shadow-xl rounded-2xl p-6">
            <h2 class="text-base font-medium mb-4">Productos</h2>
            <div class="max-h-72 overflow-y-auto">
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
  userId!: string;
  orderId!: string;
  order: Order | null = null;
  isAdmin = false; // ← set this based on your auth service

   statuses = ORDER_STATUSES;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private alertService: AlertService,
    protected sessionService: SessionService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId')!;
    this.orderId = this.route.snapshot.paramMap.get('orderId')!;
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (res) => {
        this.order = res.data;
      },
      error: (err) => this.alertService.error(err.error.error),
    });
  }

  changeStatus(status: string) {
    this.orderService.updateOrderStatus(this.orderId, {orderStatus: status}).subscribe(
      {
        next: res => {
          this.alertService.success('Orden actualizada');
          this.loadOrder();
          this.alertService.clear(3000);
        },
        error: err => {
          this.alertService.error(err.error.error);
          this.alertService.clear(3000);
        }
      }
    )
  }

  statusLabel(status: string): string {
    return this.statuses.find(s => s.value === status)?.label ?? status;
  }

  goToUserDetails() {
    this.router.navigate([`admin/users/${this.userId}`]);
  }
}
