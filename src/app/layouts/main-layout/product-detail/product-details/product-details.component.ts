import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsComponent } from '../stars/stars.component';
import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';
import { AlertService } from '../../../../core/services/alert.service';
import { FormsModule } from '@angular/forms';
import { CartProduct, CartProducts } from '../../../../core/models/cart.model';
import { Router } from '@angular/router';
import { SessionService } from '../../../../core/session/session.service';
import { NotFoundView } from '../../../../shared/info-views/not-found/not-found.component';

@Component({
  selector: 'product-details',
  imports: [StarsComponent, CommonModule, FormsModule, NotFoundView],
  template: `
    @if (product) {
      <!-- Product info component -->

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <!-- Imagen -->
        <div class="w-full flex justify-end">
          <div class="w-120 aspect-square overflow-hidden rounded-lg shadow-md">
            <img [src]="product.imgUrl" [alt]="product.name" class="w-full h-full object-cover" />
          </div>
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-4 text-yellow-900">
          <h1 class="text-3xl font-semibold tracking-wide">
            {{ product.name | uppercase }}
          </h1>

          <div>
            <div class="text-xl font-semibold leading-relaxed flex items-center gap-1">
              <p>{{ product.score || 0 | number: '1.1-1' }}</p>
              <product-details-stars [score]="product.score"></product-details-stars>
            </div>
            <p class="text-sm text-yellow-900/50 leading-relaxed">{{ product.rateNumber }} calificaciones</p>
          </div>

          <p class="text-3xl font-semibold">
            {{ '$' + (product.price | number: '1.0-0') }}
          </p>

          @if (product.quant != 0) {
            <label
              >Cantidad
              <input
                class="block w-20 px-1 py-2 border border-yellow-900 rounded-lg focus:outline-none"
                type="number"
                [(ngModel)]="quant"
                min="1"
              />
            </label>
          }

          <p class="text-sm leading-relaxed text-yellow-900/50">
            Stock disponible:
            <span
              [ngClass]="product.quant == 0 ? 'border border-red-40 text-red-700 font-medium px-2 py-0.5 rounded-xl' : ''"
            >
              {{ product.quant != 0 ? product.quant : 'Agotado' }}
            </span>
          </p>

          @if (product.quant != 0) {
            <button
              (click)="handleCartAction()"
              class="mt-4 md:w-100 text-sm font-semibold text-yellow-900 px-6 py-2 rounded-lg border border-yellow-900 cursor-pointer
                     hover:bg-yellow-900 hover:text-yellow-50 transition-all flex gap-2 items-center justify-center"
            >
              @if(inCart) {
                Ir al carrito
              }
              @else {

                  <i class="fa-solid fa-cart-plus"></i>
                  Agregar al carrito
              }
            </button>
          }

          <h2 class="text-2xl font-semibold tracking-wide">DESCRIPCION</h2>

          <p class="leading-relaxe text-yellow-900/50">
            {{ product.description || 'Este producto es tan bueno que se describe solo' }}
          </p>
        </div>
      </div>
    } @else {
      <!-- Not found component -->
      <info-view-not-found [msj]="'Producto no encontrado'"></info-view-not-found>
    }
  `,
  styles: ``,
})
export class ProductDetails {
  @Input() product: Product | null = null;
  quant: number = 1;
  lastCart: CartProducts | null = null;
  inCart: CartProduct | null = null;
  counter = 0;

  constructor(
    public cartService: CartService,
    private alertService: AlertService,
    private sessionService: SessionService,
    public router: Router,
  ) {}

  ngOnChanges() {
    if (this.lastCart) this.syncCart(this.lastCart);
  }

  ngOnInit() {
    if (!this.sessionService.currentUser() || this.sessionService.currentUser()?.roles[0]!='ROLE_USER') return;

    this.cartService.cart$.subscribe((cart) => {
      if (cart == null) return;

      this.lastCart = cart;
      this.syncCart(cart);
    });

    this.loadCart();
  }

  loadCart() {
    this.cartService.get().subscribe({
      next: (res) => {
        this.cartService.setCart(res.data);
      },
    });
  }

  syncCart(cart: CartProducts) {
    if (!this.product) return;
    this.inCart = this.cartService.findProduct(this.product.productId, cart.products);
    this.quant = this.inCart?.quant ?? 1;
  }

  addToCart() {
    if (!this.product) return;

    if (!this.sessionService.currentUser()) {
      this.alertService.error('Debe iniciar sesion primero');
      this.alertService.clear(3000);
      return;
    }

    this.cartService.add({ productId: this.product.productId, quant: this.quant }).subscribe({
      next: (res) => {
        this.alertService.success(`${this.product?.name} agregado al carrito`);
        this.inCart = res.data;
      },
      error: (err) => {
        this.alertService.error(err.error.error);
      },
    });

    this.alertService.clear(3000);
  }

  handleCartAction() {
    if (this.inCart) {
      // si ya está en el carrito, navegar
      this.router.navigate(['user/cart']);
    } else {
      // si no está, agregar
      this.addToCart();
    }
  }
}
