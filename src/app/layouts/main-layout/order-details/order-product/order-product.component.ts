import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartProduct } from '../../../../core/models/cart.model';

@Component({
  selector: 'order-details-product',
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-4 p-4 border-b-2 border-b-zinc-300 rounded-sm bg-white">
          <div class="w-24 h-24 rounded-md overflow-hidden bg-yellow-100 flex orderProducts-center justify-center">
            <img [src]="orderProduct.img" alt="">
          </div>

          <!-- Info producto -->
          <div class="flex flex-col flex-1 text-yellow-900/80">
            <h3 class="text-xl font-semibold">{{ orderProduct.name }}</h3>
            <p class="text-sm">Cantidad: {{ orderProduct.quant }}</p>
            <p class="text-lg font-semibold">
              {{ '$' + (orderProduct.price | number:'1.0-0') }}
            </p>
          </div>
      </div>
  `,
  styles: ``,
})
export class OrderProduct {

  @Input() orderProduct!: CartProduct;

}
