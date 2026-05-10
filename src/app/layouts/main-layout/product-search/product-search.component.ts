import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { PaginatedResponse } from '../../../core/dtos/responses/paginatedProduct.response';
import { Product } from '../../../core/models/product.model';
import { NotFoundView } from "../../../shared/info-views/not-found/not-found.component";
import { CommonModule } from '@angular/common';
import { getMainImage } from '../../../core/helpers/ProductImages';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'main-layout-product-search',
  imports: [NotFoundView, CommonModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8 text-yellow-900">

      <!-- Header -->
      <div class="mb-6 border-b border-yellow-900/20 pb-4">
        <p class="text-xs font-semibold uppercase tracking-widest text-yellow-900/50 mb-1">Resultados para</p>
        <h2 class="text-2xl font-semibold uppercase tracking-widest">{{ currentQuery }}</h2>
        <p class="text-sm text-yellow-900/50 mt-1">{{ products.totalElements }} productos encontrados</p>
      </div>

      @if (products.data.length === 0) {
        <info-view-not-found [msj]="'No hay coincidencias'"></info-view-not-found>
      } @else {

        <!-- Table -->
        <table class="w-full text-sm">
          <tbody>
            @for (product of products.data; track product.productId) {
              <tr class="border-b border-yellow-900/10 hover:bg-yellow-900/5 transition-colors cursor-pointer"
              title="Ir al detalle de producto"
                  (click)="goToProduct(product.productId)">
                <td class="py-3 w-16">

                  @if(product?.mainImg?.imageUrl) {
                    <img
                      [src]="product?.mainImg?.imageUrl"
                      [alt]="product.name"
                      class="w-18 h-18 object-cover rounded-lg border border-yellow-900/10"
                    />
                  }
                  @else {
                    <div class="bg-gray-100 h-full w-full flex justify-center items-center p-3">
                      <i class="fa-regular fa-image text-3xl text-gray-400"> </i>
                    </div>
                  }

                </td>
                <td class="py-3 pl-4 font-medium">{{ product.name }}</td>
                <td class="py-3 text-right font-semibold">{{ "$" + (product.price | number:'1.0-1') }}</td>
              </tr>
            }
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-6 pt-4 border-t border-yellow-900/20">

          <p class="text-xs text-yellow-900/50">
            Página {{ products.currentPage }} de {{ products.totalPages }}
          </p>

          <div class="flex items-center gap-2">
            <button
              (click)="changePage(products.currentPage - 1)"
              [disabled]="products.currentPage === 1"
              class="flex items-center gap-1.5 border border-yellow-900/30 px-3 py-1.5 rounded-full text-xs font-semibold
                     hover:bg-yellow-900 hover:text-yellow-50 hover:border-yellow-900 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-yellow-900">
              <i class="fa-solid fa-chevron-left text-xs"></i>
              Anterior
            </button>

            <button
              (click)="changePage(products.currentPage + 1)"
              [disabled]="products.currentPage === products.totalPages"
              class="flex items-center gap-1.5 border border-yellow-900/30 px-3 py-1.5 rounded-full text-xs font-semibold
                     hover:bg-yellow-900 hover:text-yellow-50 hover:border-yellow-900 transition-all
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-yellow-900">
              Siguiente
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </div>

        </div>
      }
    </div>
  `,
  styles: ``,
})
export class ProductSearch {

  products: PaginatedResponse<Product> = {
    currentPage: 1,
    nextPage: 1,
    totalPages: 1,
    data: [],
    pageLength: 5,
    totalElements: 0,
  };

  currentQuery = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const q = params['q'];
      if (!q) {
        this.router.navigate(['/home']);
        return;
      }
      this.currentQuery = q;
      this.searchProduct(q, 1);
    });
  }

  searchProduct(q: string, page: number) {
    this.productService.getProducts(page, 10, { name: q , active: true}).subscribe({
      next: res => {
        res.data.data = res.data.data.map(d =>(
            {
              ...d,
              mainImg: getMainImage(d.images)
            }
          )
        );

        this.products = res.data;
      },
      error: err => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
        this.router.navigate(['/']);
      }
    });
  }

  changePage(page: number) {
    this.searchProduct(this.currentQuery, page);
  }

  goToProduct(id: any) {
    this.router.navigate([`/products/${id}`]);
  }
}
