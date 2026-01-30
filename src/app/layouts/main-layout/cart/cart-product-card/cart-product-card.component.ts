import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartProduct } from '../../../../core/models/cart.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AlertService } from '../../services/alert.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'cart-product-card',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="flex gap-4 p-4 border-b-2 border-b-yellow-900/30 rounded-sm bg-white">
          <!-- Imagen placeholder (puedes reemplazar con cartProduct.imgUrl si lo tienes en el modelo) -->
          <div class="w-24 h-24 rounded-md overflow-hidden bg-yellow-100 flex cartProducts-center justify-center">
            <img [src]="cartProduct.img" alt="">
          </div>

          <!-- Info producto -->
          <div class="flex flex-col flex-1 text-yellow-900/80">
            <h3 class="text-xl font-semibold">{{ cartProduct.productName }}</h3>
            <p class="text-sm">Stock: {{ cartProduct.stock }}</p>
            <p class="text-lg font-semibold">
              {{ '$' + (cartProduct.price | number:'1.0-0') }}
            </p>
          </div>

          <!-- update quant button -->
           <div class="border-2 rounded-lg border-yellow-900/80 text-yellow-900/80 flex justify-evenly items-center self-center max-w-24 text-3xl">
            <button (click)="decrement()">-</button>
            <input class="w-1/3 text-xl" type="number" [(ngModel)]="cartProduct.quant">
            <button (click)="increment()">+</button>
           </div>

          <!-- Botón eliminar -->
          <button
          (click)="deleteItem.emit(cartProduct)"
            class="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500 transition self-center hover:cursor-pointer"
          >
            Eliminar
          </button>
      </div>
  `,
  styles: ``,
})
export class ProductCart {
  @Input() cartProduct!: CartProduct;
  @Output() deleteItem = new EventEmitter<CartProduct>();
  @Output() updateItem = new EventEmitter<CartProduct>();

  constructor(private alertService: AlertService, private cartService: CartService) {}

  decrement() {
    if(this.cartProduct.quant>1) {
        this.cartProduct.quant--;
        this.updateCart();
    }
  }

  increment(){
    if(this.cartProduct.quant >= this.cartProduct.stock) {
      this.alertService.error('Cantidad fuera de stock');
      setTimeout(()=>this.alertService.clear(),  3000);
      return;
    }
    this.cartProduct.quant++;
    this.updateCart();
  }

  updateCart(){
    this.cartService.add({productId: this.cartProduct.productId,  quant: this.cartProduct.quant}).subscribe(
      {
        next: res=>this.updateItem.emit(this.cartProduct),
        error: err=>this.alertService.error(err.error.error)}
    )
  }
}
