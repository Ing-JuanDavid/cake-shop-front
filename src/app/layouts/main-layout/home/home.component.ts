import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductCardComponent } from '../home/product-card/product-card.component';
import { Product } from '../../../core/models/product.model';
import { Response } from '../../../core/dtos/responses/genericResponse.response';
import { SessionService } from '../../../core/session/session.service';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { CategoryCard } from './category-card/category-card.component';

@Component({
  selector: 'home-view',
  imports: [CategoryCard],
  template: `
    <div class="py-10 px-20">

      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        @for (category of categories; track category.categoryId) {
          <home-category-card [category]="category"></home-category-card>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class HomeComponent {
  products$!: Observable<Response<Product[] | null>>;

  categories: Category[] | [] = [];

  public constructor(
    public sessionService: SessionService,
    private router: Router,
    private categoryService: CategoryService,
  ) {}


  ngOnInit() {
    this.loadCategories();
    console.log('Current user:', this.sessionService.currentUser());
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => (this.categories = res.data),
    });
  }

}
