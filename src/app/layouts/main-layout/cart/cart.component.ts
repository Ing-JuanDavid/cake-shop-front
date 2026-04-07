import { Component } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CartProduct, CartProducts } from '../../../core/models/cart.model';
import { ProductCart } from './cart-product-card/cart-product-card.component';
import { AlertService } from '../../../core/services/alert.service';
import { OrderService } from '../services/order.service';
import { NotFoundView } from '../../../shared/info-views/not-found/not-found.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [ CommonModule, ProductCart, NotFoundView],
  template: `
    @if (cart && cart.products.length > 0) {
      <div class="max-w-5xl mx-auto px-4 py-8 text-yellow-900">

        <!-- Header -->
        <div class="mb-6 border-b border-yellow-900/20 pb-4">
          <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50 mb-1">Compras</p>
          <h2 class="text-2xl font-semibold uppercase tracking-widest">Tu Carrito</h2>
          <p class="text-sm text-yellow-900/50 mt-1">{{ totalItems }} producto(s) agregado(s)</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

          <!-- Cart products -->
          <div class="col-span-1 md:col-span-2 flex flex-col max-h-[60vh] overflow-y-auto pr-1">
            @for (item of cart.products; track item.productId) {
              <cart-product-card
                [cartProduct]="item"
                (deleteItem)="deleteItem($event)"
                (updateItem)="updateItem($event)">
              </cart-product-card>
            }
          </div>

          <!-- Summary -->
          <div class="col-span-1">
            <div class="sticky top-6 flex flex-col gap-4">

              <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50">Resumen</p>

              <!-- Rows -->
              <div class="flex flex-col gap-3 border-b border-yellow-900/10 pb-4">
                <div class="flex justify-between text-sm">
                  <span class="text-yellow-900/50">Productos</span>
                  <span>{{ totalItems }} item(s)</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-yellow-900/50">Subtotal</span>
                  <span>{{ "$" + (cart.cartTotal | number:'1.0-0') }}</span>
                </div>
              </div>

              <!-- Total -->
              <div class="flex justify-between items-center">
                <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50">Total</p>
                <p class="text-lg font-semibold">{{  "$" + (cart.cartTotal | number:'1.0-0') }}</p>
              </div>

              <!-- CTA -->
              <button
                (click)="makeOrder()"
                class="w-full flex items-center justify-center gap-2 border border-yellow-900 text-yellow-900 py-2.5 rounded-full text-sm font-semibold
                       hover:bg-yellow-900 hover:text-yellow-50 transition-all cursor-pointer">
                <i class="fa-solid fa-bag-shopping text-xs"></i>
                Continuar compra
              </button>

              <p class="text-xs text-yellow-900/30 text-center">
                <i class="fa-solid fa-lock text-xs mr-1"></i>
                Compra segura y protegida
              </p>

            </div>
          </div>

        </div>
      </div>

    } @else {
      <info-view-not-found [msj]="'Tu carrito está vacío'"></info-view-not-found>
    }
  `,
  styles: ``,
})
export class Cart {

  cart: CartProducts | null = null;
  totalItems: number = 0;

  constructor(
    private cartService: CartService,
    private alertService: AlertService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
      this.totalItems = cart?.products
        .map(p => p.quant)
        .reduce((acc, val) => acc + val, 0) ?? 0;
    });

    this.cartService.get().subscribe({
      next: (res) => this.cartService.setCart(res.data)
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

    this.cartService.setCart(this.cart);
  }

  deleteItem(product: CartProduct) {
    this.cartService.delete(product.productId).subscribe({
      next: () => {
        this.alertService.success(`${product.name} eliminado`);
        this.cart!.products = this.cart!.products.filter(p => p.productId !== product.productId);
        this.updateCart();
      },
      error: err => this.alertService.error(err.error.error)
    });
    this.alertService.clear(3000);
  }

  makeOrder() {
    this.orderService.makeOrder().subscribe({
      next: () => {
        this.alertService.success('Compra realizada');
        this.cartService.setCart(null);
      },
      error: err => this.alertService.error(err.error.error)
    });
    this.alertService.clear(3000);
  }
}
