import { Component, Input } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'product-details',
  imports: [AsyncPipe, CommonModule],
  template: `
     @if(product$ | async; as product) {

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

            <p class="text-2xl font-bold">
              {{ product.price | currency:'':'symbol':'1.0-0' }}
            </p>

            <label>Cantidad
              <input class="block w-20 px-1 py-2 border border-yellow-900/80 rounded-lg focus:outline-none" type="number" name="quant" [value]="quant"
              min="1"
              >
            </label>


            <button
              class="mt-4 w-100 bg-yellow-900 text-white px-6 py-2 rounded-md hover:cursor-pointer
                     hover:bg-yellow-800 transition">
              Agregar al carrito
            </button>

             <p class="leading-relaxe">
              {{ product.description || 'Este producto es tan bueno que se describe solo 😌' }}
            </p>

            <p class="text-sm leading-relaxed">
              {{ product.score || '0' }}
            </p>

          </div>

        </div>

      }
      @else {
        <p>Producto no encontrado!</p>
      }
  `,
  styles: ``,
})
export class ProductDetails {
  @Input() id!:string;
  product$!: Observable<any>;
  quant : number = 1;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit()
  {
    this.product$ = this.productService.getProductById(this.id).pipe(
      map(product=>product.data)
    );
  }

}
