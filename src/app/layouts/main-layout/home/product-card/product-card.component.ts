import { Component, Input } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'home-product-card',
  imports: [CommonModule],
  template: `
    <div
      class="w-48 hover:shadow-lg transition-shadow hover:cursor-pointer"
    >
      <!-- Imagen -->
      <div class="w-full h-32">
        <img [src]="product?.imgUrl" alt="{{ product?.name }}" class="w-full h-full object-cover" />
      </div>

      <!-- Cuerpo -->
      <div class="p-3 flex flex-col gap-0 text-yellow-900/80 items-center">
        <h3 class="text-sm tracking-wider">
          {{ product?.name | uppercase}}
        </h3>

        <p class="text-[.9em] ">{{ '$' + (product?.price | number:'1.0-0')}}</p>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProductCardComponent {
  @Input() product: Product | null = null;
}
