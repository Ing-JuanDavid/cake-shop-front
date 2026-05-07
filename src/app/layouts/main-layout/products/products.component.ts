import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, SimpleProduct } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { ProductCardComponent } from "../home/product-card/product-card.component";
import { NotFoundView } from "../../../shared/info-views/not-found/not-found.component";
import { FormsModule, NgModel } from '@angular/forms';


@Component({
  selector: 'main-products',
  imports: [ProductCardComponent, NotFoundView, FormsModule],
  template: `

    <div class="flex flex-col text-yellow-900 gap-15 px-4 py-10 max-w-7xl mx-auto">

      <!-- Header + Filters bar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-yellow-900/20 pb-5">

        <div>
          <h2 class="text-2xl font-semibold uppercase tracking-widest">{{ categoryName }}</h2>
          <p class="text-sm text-yellow-900/50 mt-0.5">{{ products.length }} productos</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">

          <!-- Sort -->
          <div class="flex items-center gap-2 bg-yellow-50 border border-yellow-900/20 rounded-lg px-3 py-2 text-sm">
            <svg class="w-4 h-4 text-yellow-900/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 7h18M6 12h12M10 17h4"/>
            </svg>
            <label for="sort" class="text-yellow-900/60 whitespace-nowrap">Ordenar por</label>
            <select
              id="sort"
              [(ngModel)]="sortOrder"
              (change)="applySort()"
              class="bg-transparent font-medium text-yellow-900 outline-none cursor-pointer">
              <option value="asc">Precio: menor a mayor</option>
              <option value="desc">Precio: mayor a menor</option>
              <option value="name">Nombre A–Z</option>
            </select>
          </div>

          <!-- Grid / List toggle -->
          <div class="flex items-center border border-yellow-900/20 rounded-lg overflow-hidden">
            <button
              (click)="layout = 'grid'"
              [class.bg-yellow-900]="layout === 'grid'"
              [class.text-yellow-50]="layout === 'grid'"
              class="px-3 py-2 transition-colors hover:bg-yellow-900/10"
              title="Vista cuadrícula">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/>
              </svg>
            </button>
            <button
              (click)="layout = 'list'"
              [class.bg-yellow-900]="layout === 'list'"
              [class.text-yellow-50]="layout === 'list'"
              class="px-3 py-2 transition-colors hover:bg-yellow-900/10"
              title="Vista lista">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5h18v2H3zm0 6h18v2H3zm0 6h18v2H3z"/>
              </svg>
            </button>
          </div>

        </div>
      </div>

      <!-- Product grid -->
      <div
        [class]="layout === 'grid'
          ? 'flex flex-wrap gap-8 justify-center'
          : 'flex flex-col gap-4'">

        @for(product of sortedProducts; track product.productId) {
          <home-product-card
            [product]="product"
            (click)="goToProduct(product.productId)">
          </home-product-card>
        } @empty {

            <info-view-not-found [msj]="'Aún no hay nada que mostrar'"></info-view-not-found>

        }

      </div>
    </div>

  `,
  styles: ``,
})
export class Products {

  categoryId: string | null = null;
  categoryName: string | null = null;
  products: SimpleProduct[] = [];
  sortedProducts: SimpleProduct[] = [];
  sortOrder: 'asc' | 'desc' | 'name' = 'asc';
  layout: 'grid' | 'list' = 'grid';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    this.categoryName = this.route.snapshot.paramMap.get('category');

    if (!this.categoryId) return;

    this.productService.getProductsByCategory(this.categoryId).subscribe({
      next: res => {
        this.products = res.data;
        console.log("products:",this.products);
        this.applySort();
      }
    });
  }

  applySort() {
    const copy = [...this.products];
    if (this.sortOrder === 'asc')  this.sortedProducts = copy.sort((a, b) => a.price - b.price);
    if (this.sortOrder === 'desc') this.sortedProducts = copy.sort((a, b) => b.price - a.price);
    if (this.sortOrder === 'name') this.sortedProducts = copy.sort((a, b) => a.name.localeCompare(b.name));
  }

  goToProduct(id: any) {
    this.router.navigate([`/products/${id}`]);
  }
}
