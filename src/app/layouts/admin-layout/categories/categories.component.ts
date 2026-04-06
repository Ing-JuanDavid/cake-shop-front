import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { AlertService } from '../../../core/services/alert.service';
import { Category } from '../../../core/models/category.model';
import { CategoryFilters } from '../../../core/dtos/requests/categoryFilters.request';
import { PaginatedResponse } from '../../../core/dtos/responses/paginatedProduct.response';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { CategoryProduct } from "./category-product/category-product.component";

@Component({
  selector: 'admin-categories-view',
  imports: [ReactiveFormsModule, CategoryProduct],
  templateUrl: './categories.html',
  styles: ``,
})
export class Categories {
  editing = false;
  showModal = false;

  fb = inject(FormBuilder);
  categoryService = inject(CategoryService);
  alertService = inject(AlertService);
  productService = inject(ProductService);

  currentPage = 1;
  sizePage = 5;
  filters: CategoryFilters = {};

  expandedCategoryId: number | null = null;
  categoryProducts: Product[] = [];
  loadingProducts = false;

  page: PaginatedResponse<Category> = {
    currentPage: 1,
    pageLength: 0,
    nextPage: 1,
    data: [],
    totalPages: 1,
    totalElements: 0,
  };

  categoryForm = this.fb.nonNullable.group({
    categoryId: [0],
    name: ['', [Validators.required, Validators.maxLength(20)]],
    img: this.fb.control<null | File>(null)
  });

  // filters variables
  @ViewChild('nameFilter') nameFilter! : ElementRef;
  @ViewChild('minProductsFilter') minProductaFilter! : ElementRef;
  @ViewChild('maxProductsFilter') maxProductaFilter! : ElementRef;

  ngOnInit() {
    this.loadCategories();
  }

    onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const imgControl = this.f.img;

    // if (this.editing && !input.files?.length) {
    //   imgControl?.setErrors(null);
    //   return;
    // }

    // imgControl?.addValidators(Validators.required);
    imgControl?.markAsTouched();

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];
    const maxSize = 2 * 1024 * 1024;

    if (!file.type.startsWith('image/')) {
      imgControl?.setErrors({ invalidType: true });
      return;
    }

    if (file.size > maxSize) {
      imgControl?.setErrors({ maxSize: true });
      return;
    }

    imgControl?.setErrors(null);
    imgControl?.setValue(file);
  }

  fillFormToEdit(category: Category) {
    this.editing = true;
    this.showModal = true;

    const { productsNumber, ...formCategory } = category;

    this.categoryForm.patchValue(formCategory);

    const element = document.getElementById('form-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

  clearForm() {
    this.categoryForm.reset();
    this.editing = false;
    this.showModal = false;
  }

  get f() {
    return this.categoryForm.controls;
  }

  create() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }


    const formData = new FormData;

    const data = this.categoryForm.getRawValue();
    formData.append('name', data.name);
    if(data.img != null) formData.append('img', data.img);

    this.categoryService.postCategory(formData).subscribe({
      next: (res) => {
        this.clearForm();
        this.alertService.success('Categoria creada');
        this.loadCategories();
        this.alertService.clear(2000);
      },
      error: (err) => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      },
    });
  }

  edit() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const { categoryId, ...category } = this.categoryForm.getRawValue();

    this.categoryService.putCategory(category, categoryId).subscribe({
      next: (res) => {
        this.clearForm();
        this.alertService.success('Categoria actualizada');
        this.loadCategories();
        this.alertService.clear(2000);
      },
      error: (err) => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      },
    });
  }

  delete(categoryId: number) {
    this.categoryService.delteCategory(categoryId).subscribe({
      next: (res) => {
        this.clearForm();
        this.alertService.success('Categoria eliminada');
        this.loadCategories();
        this.alertService.clear(2000);
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories(this.currentPage, this.sizePage, this.filters).subscribe({
      next: (res) => (this.page = res.data),
    });
  }

  applyFilters(filters: CategoryFilters) {
    this.filters = filters;
    this.currentPage = 1; // reset to first page when filtering
    this.loadCategories();
  }

  cleanFilters()
  {
    this.applyFilters({});
    this.nameFilter.nativeElement.value = '';
    this.minProductaFilter.nativeElement.value = '';
    this.maxProductaFilter.nativeElement.value = '';
  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadCategories();
  }

  toggleCategory(category: Category) {
    if (this.expandedCategoryId === category.categoryId) {
        this.expandedCategoryId = null;  // collapse
        return;
    }
    this.expandedCategoryId = category.categoryId;
    this.loadingProducts = true;
    this.productService.getProductsByCategory(category.categoryId.toString()).subscribe(
      {
        next: res => {
          this.categoryProducts = res.data;
          this.loadingProducts = false;
        },
        error: err => {
          this.alertService.error(err.error.error);
          this.alertService.clear(3000);
          }
      }
    )
}
}
