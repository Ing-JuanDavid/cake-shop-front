import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
('../../../core/dtos/responses/paginatedProduct.response');
import { ProductFilters } from '../../../core/dtos/requests/productFilters.request';
import { PaginatedResponse } from '../../../core/dtos/responses/paginatedProduct.response';
import { productService } from '../../../core/services/product.service';

@Component({
  selector: 'admin-product-view',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: 'product.html',
  styles: ``,
})
export class ProductComponent {
  editing = false;
  categories: Category[] | [] = [];
  currentPage = 1;
  sizePage = 5;
  filters: ProductFilters = {};

  page: PaginatedResponse<Product> = {
    currentPage: 1,
    pageLength: 0,
    nextPage: 1,
    data: [],
    totalPages: 1,
    totalElements: 0,
  };

  fb = inject(FormBuilder);
  categoryService = inject(CategoryService);
  productService = inject(productService);
  alertService = inject(AlertService);
  router = inject(Router);

  // Drawner
  drawerOpen = false;
  drawerAnimated = false; // ← nuevo flag


  // Filters variables
  @ViewChild('nameFilter') nameFilter! : ElementRef;
  @ViewChild('categoryFilter') categoryFilter! : ElementRef;
  @ViewChild('availableFilter') availableFilter! : ElementRef;
  @ViewChild('minPriceFilter') minPriceFilter! : ElementRef;
  @ViewChild('maxPriceFilter') maxPriceFilter! : ElementRef;

  productForm = this.fb.nonNullable.group({
    productId: [0],

    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],

    price: [0.01, [Validators.required, Validators.min(0.01)]],

    quant: [1, [Validators.required, Validators.min(0)]],

    categoryId: [0, [Validators.min(1), Validators.required]],

    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],

    img: this.fb.control<null | File>(null),
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.categoryService.getAllCategories().subscribe({ next: (res) => (this.categories = res.data) });

    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.currentPage, this.sizePage, this.filters).subscribe({
      next: (res) => {
        this.page = res.data;
      },
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const imgControl = this.productForm.get('img');

    if (this.editing && !input.files?.length) {
      imgControl?.setErrors(null);
      return;
    }

    imgControl?.addValidators(Validators.required);
    imgControl?.markAsTouched();

    if (!input.files?.length) {
      imgControl?.setErrors({ required: true });
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

  get f() {
    return this.productForm.controls;
  }

  create() {
    this.productForm.get('img')?.addValidators(Validators.required);
    this.productForm.get('img')?.updateValueAndValidity();

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = this.getFormData();

    if (!formData) {
      this.alertService.error('Ocurrio un error');
      return;
    }

    this.productService.postProduct(formData).subscribe({
      next: () => {
        this.alertService.success('Producto creado');
        this.loadProducts();
        this.alertService.clear(2000);
      },
      error: (err) => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      },
    });
    this.closeDrawer();
    this.clearForm();
  }

  edit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = this.getFormData();

    if (!formData) {
      this.alertService.error('Ocurrio un error');
      return;
    }

    this.productService.putProduct(formData, formData.get('productId') as string).subscribe({
      next: () => {
        this.alertService.success('Producto actualizado');
        this.loadProducts();
        this.alertService.clear(2000);
      },
      error: (err) => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      },
    });
    this.closeDrawer();
    this.clearForm();
  }

  delete(productId: number) {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.alertService.success('Producto eliminado');
        this.loadProducts();
        this.alertService.clear(2000);
      },
      error: (err) => {
        this.alertService.error(err.error.error);
        this.alertService.clear(2000);
      },
    });
  }

  clearForm() {
    this.productForm.reset();
    this.editing = false;
  }

  fillFormToEdit(product: Product) {
    this.editing = true;
    this.productForm.reset();
    this.productForm.patchValue({
      ...product,
      categoryId: this.getCategory(product.categoryName)?.categoryId,
    });
    this.openDrawer();
  }

  getCategory(categoryName: string) {
    return this.categories.find((c) => c.name === categoryName);
  }

  getFormData(): FormData | null {
    const { productId, ...product } = this.productForm.getRawValue();

    const formData = new FormData();

    if (this.editing) formData.append('productId', productId.toString());

    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('quant', product.quant.toString());
    formData.append('categoryId', product.categoryId.toString());

    if (product.img && !this.editing) {
      console.log('adding img');
      formData.append('img', product.img);
    }

    return formData;
  }

  goToProduct(productId: number) {
    this.router.navigate([`product/${productId}`]);
  }

  applyFilters(filters: ProductFilters) {
    this.filters = filters;
    this.currentPage = 1; // reset to first page when filtering
    this.loadProducts();
  }

  cleanFilters()
  {
    this.applyFilters({});
    this.nameFilter.nativeElement.value = '';
    this.categoryFilter.nativeElement.value = '';
    this.availableFilter.nativeElement.value = '';
    this.minPriceFilter.nativeElement.value = '';
    this.maxPriceFilter.nativeElement.value = '';

  }

  changePage(page: number) {
    this.currentPage = page;
    this.loadProducts();
  }

  // Drawner
  openDrawer() {
    this.drawerAnimated = true;
    this.drawerOpen = true;
  }

  closeDrawer() {
    this.drawerOpen = false;
  }
}
