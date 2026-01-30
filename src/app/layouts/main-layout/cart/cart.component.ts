import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartProduct, CartProducts } from '../../../core/models/cart.model';
import { CommonModule } from '@angular/common';
import { ProductCart } from './cart-product-card/cart-product-card.component';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, ProductCart],
  template: `
    @if (cart && cart.products.length>0) {
      <div class="min-h-screen m-auto px-4 sm:px-6 md:px-10 lg:px-20 max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-10">

          <!-- Cart products -->

          <div class="flex flex-col col-span-1 md:col-span-2 max-h-[400px] overflow-y-auto">
            @for (item of cart.products; track item.productId) {
              <cart-product-card [cartProduct]="item" (deleteItem)="deleteItem($event)" (updateItem)="updateItem($event)"></cart-product-card>
            }
          </div>

          <!-- Shop summary -->
          <div class="flex flex-col col-span-1 gap-2 text-yellow-900/80">
            <h2 class="text-xl font-semibold tracking-wide mb-2 border-b">
              Resumen de compra
            </h2>

            <div class="flex justify-between">
              <p class="text-sm font-semibold">
                # productos:              </p>
              <p class="text-sm font-semibold">
                {{ totalItems}}
              </p>
            </div>

            <div class="flex justify-between">
              <p class="text-2xl font-semibold">
                Total:              </p>
              <p class="text-2xl font-semibold">
                {{ '$' + (cart.cartTotal | number:'1.0-0') }}
              </p>
            </div>

            <button
              class="px-4 py-3 bg-yellow-800 text-white text-sm font-medium
                    rounded-md hover:bg-yellow-700 transition hover:cursor-pointer w-2/4 self-end md:w-full"
            >
              Continuar compra
        </button>
          </div>

        </div>
      </div>
    } @else {
      <div class="px-10 md:px-20 min-h-screen flex items-center justify-center">
        <p class="text-yellow-900/70 text-lg">Tu carrito está vacío</p>
      </div>
    }
  `,
  styles: ``,
})
export class Cart {

  constructor(private cartService: CartService, private alertService: AlertService) {}

   cart: CartProducts | null = null;
    totalItems: number = 0;

  ngOnInit() {
    // Suscribirse al estado compartido del servicio
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.totalItems = cart?.products
        .map(p => p.quant)
        .reduce((acc, val) => acc + val, 0) ?? 0;
    });

    // Cargar datos iniciales desde backend
    this.cartService.get().subscribe({
      next: (res) => {
        this.cartService.setCart(res.data);
      }
    });
  }

  updateItem(product: CartProduct) {
    const item = this.cart?.products.find(i => i.productId === product.productId);
    if (item) {
      item.quant = product.quant;
      this.updateCart();
    }
  }

  updateCart() {
    if (!this.cart) return;

    this.cart.cartTotal = this.cart.products
      .map(p => p.price * p.quant)
      .reduce((acc, val) => acc + val, 0);

    this.totalItems = this.cart.products
      .map(p => p.quant)
      .reduce((acc, val) => acc + val, 0);

    // Actualizar el estado global
    this.cartService.setCart(this.cart);
  }

  deleteItem(product: CartProduct) {
    this.cartService.delete(product.productId).subscribe({
      next: res => {
        this.alertService.success(`${product.productName} eliminado`);
        this.cart!.products = this.cart!.products.filter(p => p.productId != product.productId);
        this.updateCart();
      },
      error: err => {
        this.alertService.error(err.error.error);
      }
    });

    setTimeout(() => this.alertService.clear(), 3000);
  }


}
