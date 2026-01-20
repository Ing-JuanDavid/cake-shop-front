import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsComponent } from "../stars/stars.component";
import { Product } from '../../../../core/services/product.service';

@Component({
  selector: 'product-details',
  imports:[StarsComponent, CommonModule],
  template: `
     @if(product) {

<!-- Product info component -->

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

           <!-- Imagen -->
          <div class="w-full flex justify-end">
            <div class="w-120 aspect-square overflow-hidden rounded-lg shadow-md">
              <img
                [src]="product.imgUrl"
                [alt]="product.name"
                class="w-full h-full object-cover"
              />
            </div>
          </div>


          <!-- Info -->
          <div class="flex flex-col gap-4 text-yellow-900/80">

            <h1 class="text-3xl font-semibold tracking-wide">
              {{ product.name | uppercase }}
            </h1>

            <div>
              <div class="text-xl font-semibold leading-relaxed flex items-center gap-1">
                <p>{{ (product.score ?? 0) | number:'1.1-1' }}</p>
                <product-details-stars [score]="product.score"></product-details-stars>
              </div>
              <p class="text-sm leading-relaxed">{{product.rateNumber}} calificaciones</p>
            </div>

            <p class="text-3xl font-semibold">
              {{ product.price | currency:'':'symbol':'1.0-0' }}
            </p>

            <label>Cantidad
              <input class="block w-20 px-1 py-2 border border-yellow-900/80 rounded-lg focus:outline-none" type="number" name="quant" [value]="quant"
              min="1"
              >
            </label>
            <p class="text-sm leading-relaxed">stock disponible: {{product.quant}}</p>
            <button
              class="mt-4 md:w-100 bg-yellow-900 text-white px-6 py-2 rounded-md hover:cursor-pointer
                     hover:bg-yellow-800 transition">
              Agregar al carrito
            </button>

            <h2 class="text-2xl font-semibold tracking-wide">
              DESCRIPCION
            </h2>

             <p class="leading-relaxe">
              {{ product.description || 'Este producto es tan bueno que se describe solo' }}
            </p>



          </div>

        </div>

      }
      @else {
        <!-- Not found component -->
        <p>Producto no encontrado!</p>
      }
  `,
  styles: ``,
})
export class ProductDetails {
  @Input() product: Product  | null = null;
  quant : number = 1;
}
