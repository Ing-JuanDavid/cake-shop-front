import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartProduct } from '../../../../core/models/cart.model';
import { Router } from '@angular/router';

@Component({
  selector: 'order-details-product',
  imports: [CommonModule],
  template: `
    <div
      (click)="goToProduct(orderProduct.productId)"
      title="Ir al producto"
      class="flex items-center gap-4 py-3 border-b border-yellow-900/10 hover:bg-yellow-900/5 transition-colors cursor-pointer"

    >

      <!-- Image -->
      <img
        [src]="orderProduct.img"
        [alt]="orderProduct.name"
        class="w-12 h-12 object-cover rounded-lg border border-yellow-900/10 shrink-0" />

      <!-- Name + quantity -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium truncate">{{ orderProduct.name }}</p>
        <p class="text-xs text-yellow-900/50 mt-0.5">
          <i class="fa-solid fa-xmark text-xs"></i> {{ orderProduct.quant }}
        </p>
      </div>

      <!-- Price -->
      <p class="text-sm font-semibold shrink-0">{{ "$" + (orderProduct.price | number:'1.0-0') }}</p>

    </div>
  `,
  styles: ``,
})
export class OrderProduct {
  @Input() orderProduct!: CartProduct;

  constructor(
    private router: Router
  ){}

  goToProduct(productId: number)
  {
    this.router.navigate(['products/'+productId]);
  }
}
