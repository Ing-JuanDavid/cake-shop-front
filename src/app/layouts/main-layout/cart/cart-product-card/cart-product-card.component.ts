import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartProduct } from '../../../../core/models/cart.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AlertService } from '../../../../core/services/alert.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'cart-product-card',
  imports: [CommonModule, FormsModule],
  standalone: true,
  template: `
    <div class="flex items-center gap-4 py-3 border-b border-yellow-900/10 hover:bg-yellow-900/5 transition-colors">

      <!-- Image -->
      <img
        [src]="cartProduct.img"
        [alt]="cartProduct.name"
        class="w-12 h-12 object-cover rounded-lg border border-yellow-900/10 shrink-0" />

      <!-- Info -->
      <div class="flex flex-col flex-1 min-w-0">
        <p class="text-sm font-medium truncate">{{ cartProduct.name }}</p>
        <p class="text-xs text-yellow-900/50 mt-0.5">
          <i class="fa-solid fa-box text-xs"></i> Stock: {{ cartProduct.stock }}
        </p>
        <p class="text-sm font-semibold mt-0.5">{{ "$" + (cartProduct.price | number:'1.0-0') }}</p>
      </div>

      <!-- Quantity controls -->
      <div class="flex items-center gap-1 border border-yellow-900/30 rounded-full px-2 py-1">
        <button
          (click)="decrement()"
          class="w-6 h-6 flex items-center justify-center text-yellow-900/60 hover:text-yellow-900 transition-colors disabled:opacity-30"
          [disabled]="cartProduct.quant <= 1">
          <i class="fa-solid fa-minus text-xs"></i>
        </button>
        <input
          type="number"
          [(ngModel)]="cartProduct.quant"
          class="w-8 text-center text-sm font-medium bg-transparent outline-none text-yellow-900" />
        <button
          (click)="increment()"
          class="w-6 h-6 flex items-center justify-center text-yellow-900/60 hover:text-yellow-900 transition-colors disabled:opacity-30"
          [disabled]="cartProduct.quant >= cartProduct.stock">
          <i class="fa-solid fa-plus text-xs"></i>
        </button>
      </div>

      <!-- Delete -->
      <button
        (click)="deleteItem.emit(cartProduct)"
        class="text-yellow-900/30 hover:text-red-400 transition-colors shrink-0"
        title="Eliminar">
        <i class="fa-solid fa-trash text-sm"></i>
      </button>

    </div>
  `,
  styles: ``,
})
export class ProductCart {
  @Input() cartProduct!: CartProduct;
  @Output() deleteItem = new EventEmitter<CartProduct>();
  @Output() updateItem = new EventEmitter<CartProduct>();

  constructor(
    private alertService: AlertService,
    private cartService: CartService
  ) {}

  decrement() {
    if (this.cartProduct.quant > 1) {
      this.cartProduct.quant--;
      this.updateCart();
    }
  }

  increment() {
    if (this.cartProduct.quant >= this.cartProduct.stock) {
      this.alertService.error('Cantidad fuera de stock');
      this.alertService.clear(3000);
      return;
    }
    this.cartProduct.quant++;
    this.updateCart();
  }

  updateCart() {
    this.cartService.add({ productId: this.cartProduct.productId, quant: this.cartProduct.quant }).subscribe({
      next: () => this.updateItem.emit(this.cartProduct),
      error: err => this.alertService.error(err.error.error)
    });
  }
}
