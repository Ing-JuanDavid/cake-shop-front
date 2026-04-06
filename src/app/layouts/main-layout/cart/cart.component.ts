import { Component } from '@angular/core';
import { CartService } from '../../../core/services/cart.service';
import { CartProduct, CartProducts } from '../../../core/models/cart.model';
import { CommonModule } from '@angular/common';
import { ProductCart } from './cart-product-card/cart-product-card.component';
import { AlertService } from '../../../core/services/alert.service';
import { OrderService } from '../services/order.service';
import { NotFoundView } from '../../../shared/info-views/not-found/not-found.component';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, ProductCart, NotFoundView],
  template: `
  @if (cart && cart.products.length > 0) {
    <div class="min-h-screen pt-6 px-4 sm:px-6 md:px-10 lg:px-20 max-w-5xl mx-auto">

      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold">Tu Carrito</h1>
        <p class="text-gray-500 text-sm">{{ totalItems }} producto(s) agregado(s)</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Cart products -->
        <div class="flex flex-col col-span-1 md:col-span-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
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
          <div class="bg-white rounded-xl border border-[#EFE0C8] shadow-sm p-5 space-y-4 sticky top-6">

            <h2 class="text-base font-semibold border-b border-[#EFE0C8] pb-3">
              Resumen de compra
            </h2>

            <div class="space-y-2">
              <div class="flex justify-between text-sm text-gray-500">
                <p>Productos</p>
                <p>{{ totalItems }} item(s)</p>
              </div>
              <div class="flex justify-between text-sm text-gray-500">
                <p>Subtotal</p>
                <p>{{ "$" + (cart.cartTotal | number:'1.0-0') }}</p>
              </div>
            </div>

            <div class="border-t border-[#EFE0C8] pt-3 flex justify-between items-center">
              <p class="text-base font-semibold text-gray-700">Total</p>
              <p class="text-xl font-bold text-yellow-700">{{ "$" + (cart.cartTotal | number:'1.0-0') }}</p>
            </div>

            <button
              (click)="makeOrder()"
              class="w-full flex items-center justify-center gap-2 text-white py-3 rounded-xl text-sm font-medium transition cursor-pointer hover:opacity-90"
              style="background: #D97706;">
              <i class="fa-solid fa-bag-shopping text-xs"></i>
              <span>Continuar compra</span>
            </button>

            <p class="text-xs text-gray-400 text-center">
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

  constructor(
    private cartService: CartService,
    private alertService: AlertService,
    private orderService: OrderService) {}

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
        this.alertService.success(`${product.name} eliminado`);
        this.cart!.products = this.cart!.products.filter(p => p.productId != product.productId);
        this.updateCart();
      },
      error: err => {
        this.alertService.error(err.error.error);
      }
    });

    this.alertService.clear(3000);
  }

  makeOrder() {
    this.orderService.makeOrder().subscribe(
      {
        next: res=>{
          this.alertService.success('Compra realizada');
          this.cartService.setCart(null);
        },
        error: err=>this.alertService.error(err.error.error)
      }
    )
    this.alertService.clear(3000);
  }
}
