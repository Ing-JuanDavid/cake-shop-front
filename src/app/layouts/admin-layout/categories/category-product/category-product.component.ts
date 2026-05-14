import { Component, Input } from '@angular/core';
import { Product, SimpleProduct } from '../../../../core/models/product.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'category-product',
  imports: [CommonModule],
  template: `
    <div
      (click)="goToProductDetails()"
      class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:cursor-pointer transition-shadow w-20"
    >
      <!-- Image -->
      <div class="h-16 bg-gray-100 overflow-hidden">
        @if (product.mainImage.imageUrl) {
          <img [src]="product.mainImage.imageUrl" [alt]="product.name" class="w-full h-full object-cover" />
        } @else {
          <div class="w-full h-full flex items-center justify-center">
            <i class="fa-solid fa-image text-gray-300 text-2xl"></i>
          </div>
        }
      </div>
      <!-- Info -->
      <div class="p-2 space-y-1">
        <p class="text-xs font-medium truncate">{{ product.name }}</p>
        <p class="text-xs text-yellow-700 font-semibold">{{ '$' + (product.price | number: '1.0-0') }}</p>

      </div>
    </div>
  `,
  styles: ``,
})
export class CategoryProduct {
  @Input() product!: SimpleProduct;

  constructor(
    private router: Router
  )
  {}

  goToProductDetails() {
    this.router.navigate(['products/'+this.product.productId]);
  }
}
