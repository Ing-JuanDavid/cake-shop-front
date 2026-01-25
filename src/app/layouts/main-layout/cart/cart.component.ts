import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartProducts } from '../../../core/models/cart.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  template: `
  @if(cartProduct) {
  <div class="pt-5 px-10 md:px-20 min-h-screen">
    <h2 class="text-3xl font-semibold tracking-wide text-yellow-900/80 mb-6">
      Carrito de compras
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      @for(item of cartProduct.products; track item.productId) {
        <div class="flex items-center gap-4 p-4 border border-yellow-900/30 rounded-lg shadow-md bg-white">
          <!-- Imagen placeholder (puedes reemplazar con item.imgUrl si lo tienes en el modelo) -->
          <div class="w-24 h-24 rounded-md overflow-hidden bg-yellow-100 flex items-center justify-center">
            <img [src]="item.img" alt="">
          </div>

          <!-- Info producto -->
          <div class="flex flex-col flex-1 text-yellow-900/80">
            <h3 class="text-xl font-semibold">{{ item.productName }}</h3>
            <p class="text-sm">Cantidad: {{ item.quant }}</p>
            <p class="text-lg font-bold">
              {{ item.price | currency:'':'symbol':'1.0-0' }}
            </p>
          </div>

          <!-- Botón eliminar -->
          <button
            class="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500 transition"
          >
            Eliminar
          </button>
        </div>
      }
    </div>

    <!-- Total -->
    <div class="mt-8 flex justify-end">
      <p class="text-2xl font-bold text-yellow-900/80">
        Total: {{ cartProduct.cartTotal | currency:'':'symbol':'1.0-0' }}
      </p>
    </div>
  </div>
}
@else {
  <div class="pt-5 px-10 md:px-20 min-h-screen flex items-center justify-center">
    <p class="text-yellow-900/70 text-lg">Tu carrito está vacío</p>
  </div>
}

  `,
  styles: ``,
})
export class Cart {

  cartProduct: CartProducts | null = null;

  constructor(private cartService: CartService){}

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: res=>{
        this.cartProduct = res.data;
        console.log(res.data);
      }
    })
  }
}
