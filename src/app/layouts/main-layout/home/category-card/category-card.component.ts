import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { Category } from '../../../../core/models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'home-category-card',
  standalone: true,
  imports: [],
  template: `
    <div class="relative w-full aspect-4/3 overflow-hidden cursor-pointer group" (click)="goToCategory()">
      <!-- Image (only if exists) -->

      @if (category.imgUrl) {
        <img
          [src]="category.imgUrl"
          [alt]="category.name"
          class="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
      }
      @else {
         <div class="w-full h-full bg-linear-to-br from-stone-200 via-amber-50 to-stone-300 group-hover:from-stone-300 group-hover:to-amber-100 transition-all duration-700"></div>
      }

      <!-- Subtle dark vignette always present -->
      <div class="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"></div>

      <!-- Hover tint -->
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500"
      ></div>

      <!-- Label bottom-left -->
      <div class="absolute bottom-0 left-0 p-5">
        <span
          class="block text-white text-xl font-light tracking-widest uppercase drop-shadow-lg transition-all duration-300 group-hover:tracking-[0.2em]"
        >
          {{ category.name }}
        </span>
        <div
          class="mt-2 h-px w-6 bg-white/70 group-hover:w-16 transition-all duration-500 ease-out"
        ></div>
      </div>
    </div>
  `,
})
export class CategoryCard {
  @Input() category!: Category;

  constructor(
    private router: Router
  ){}

  goToCategory()
  {
    this.router.navigate([`${this.category.name}/${this.category.categoryId}/products`]);
  }
}
