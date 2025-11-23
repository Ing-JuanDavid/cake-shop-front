import { Component, Input } from '@angular/core';
import { Product } from '../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-product',
  imports: [CommonModule],
  template: `
    <div
      class="w-48 overflow-hidden hover:shadow-lg transition-shadow hover:cursor-pointer"
    >
      <!-- Imagen -->
      <div class="w-full h-32 overflow-hidden">
        <img [src]="product?.imgUrl" alt="{{ product?.name }}" class="w-full h-full object-cover" />
      </div>

      <!-- Cuerpo -->
      <div class="p-3 flex flex-col gap-0 text-yellow-900/80 items-center">
        <h3 class="text-md tracking-wider">
          {{ product?.name | uppercase}}
        </h3>

        <p class="text-[.9em] ">{{ product?.price | currency:'':'symbol':'1.0-0'}}</p>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProductComponent {
  @Input() product: Product | null = null;
}
