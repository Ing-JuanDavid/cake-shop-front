import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertService } from '../../../core/services/alert.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
('../../../core/dtos/responses/paginatedProduct.response');
import { ProductFilters } from '../../../core/dtos/requests/productFilters.request';
import { PaginatedResponse } from '../../../core/dtos/responses/paginatedProduct.response';
import { ProductService } from '../../../core/services/product.service';
import { SpinnerComponent } from "../../../shared/spinner/spinner.component";
import { ProductImage } from '../../../core/models/productImage.model';
import { ProductImageService } from '../../../core/services/product-image.service';
import { ProductImagePicker } from "./image-picker/image-picker.component";

@Component({
  selector: 'admin-product-view',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SpinnerComponent, ProductImagePicker],
  templateUrl: 'product.html',
  styles: ``,
})
export class ProductComponent {
  editing = false;
  loading = false;
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
  productService = inject(ProductService);
  imageService = inject(ProductImageService);
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

    isActive: [true, [Validators.required]],

    overWriteImages: false,

    images: this.fb.control<null | File[]>(null),
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

        res.data.data = res.data.data.map(d=>(
          {  ...d,
            mainImg: this.getMainImage(d.images)
          }));
        this.page = res.data;
      },
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const imagesControl = this.productForm.get('images');

    if (!imagesControl) return;

    imagesControl.markAsTouched(); // 👈

    if (!input.files?.length) {
      imagesControl.setValue(null);
      imagesControl.setErrors(null);
      return;
    }

    if(input.files.length > 4) {
      imagesControl.setErrors({ maxFiles: true});
      return;
    }


    const files: File[] = Array.from(input.files);

     const maxFileSize = 3 * 1024 * 1024;
     const maxTotalFileSize = 20 * 1024 * 1024;
     let totalFileSize = 0;

    for (let file of files) {

      if (!file.type.startsWith('image/')) {
        imagesControl?.setErrors({ invalidType: true });
        return;
      }

      if (file.size > maxFileSize) {
        imagesControl?.setErrors({ maxSize: true });
        return;
      }

      totalFileSize += file.size;

      if(totalFileSize > maxTotalFileSize) {
        imagesControl?.setErrors({ maxTotalSize: true });
        return;
      }

    }

    imagesControl?.setErrors(null);
    imagesControl?.setValue(files);
  }

  get f() {
    return this.productForm.controls;
  }

  create() {
    this.updateImageValidators();

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = this.getFormData();

    if (!formData) {
      this.alertService.error('Ocurrio un error');
      return;
    }

    this.loading = true;

    this.productService.postProduct(formData).subscribe({
      next: () => {
        this.alertService.success('Producto creado');
        this.loading = false;
        this.clearForm();
        this.loadProducts();
        this.closeDrawer();
        this.alertService.clear(2000);
      },
      error: (err) => {
        this.alertService.error(err.error.error);
        this.closeDrawer();
        this.alertService.clear(2000);
      },
    });
  }

  edit() {

    this.updateImageValidators();

    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }


    const formData = this.getFormData();

    if (!formData) {
      this.alertService.error('Ocurrio un error');
      return;
    }

    this.loading = true;

    this.productService.putProduct(formData, formData.get('productId') as string).subscribe({
      next: () => {
        this.alertService.success('Producto actualizado');
        this.loading = false;
        this.clearForm();
        this.loadProducts();
        this.closeDrawer();
        this.alertService.clear(2000);
      },
      error: (err) => {
        this.alertService.error(err.error.error);
        this.loading = false;
        this.closeDrawer();
        this.alertService.clear(2000);
      },
    });
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
      images: null,
      isActive: product.active,
      categoryId: this.getCategory(product.categoryName)?.categoryId,
    });
    this.openDrawer();
  }

  getCategory(categoryName: string) {
    return this.categories.find((c) => c.name === categoryName);
  }

  getFormData(): FormData | null {
    const { productId, overWriteImages, ...product } = this.productForm.getRawValue();

    const formData = new FormData();

    if (this.editing) formData.append('productId', productId.toString());

    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price.toString());
    formData.append('quant', product.quant.toString());
    formData.append('categoryId', product.categoryId.toString());
    formData.append('isActive', product.isActive ? "true": "false");

    if(overWriteImages) formData.append("overWriteImages", overWriteImages ? "true" : "false");

    if (product.images?.length) {
      console.log('adding img');

      product.images.forEach(image => {
        formData.append('images', image);
      })

    }

    return formData;
  }

  goToProduct(productId: number) {
    this.router.navigate([`products/${productId}`]);
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

    if(this.editing) {
      this.clearForm();
    }

    this.drawerOpen = false;
  }

  updateImageValidators()
  {
    const imagesControl = this.productForm.get('images');

    if (!this.editing) {
      imagesControl?.setValidators(Validators.required);
    } else {
      imagesControl?.clearValidators();
    }

    }

    changeMainImg(img : ProductImage)
    {

      this.imageService.updateImageProduct(img.imageId, true).subscribe(
        {
          next: res => {
            this.alertService.success("Imagen principal actualizada");
            this.alertService.clear(2000);
            this.loadProducts()
          },
          error: err => {
            this.alertService.error(err.error.error);
            this.alertService.clear(2000);
          }
        }
      )

    }


    getMainImage(images: ProductImage[]) : ProductImage | null
    {


      if(images.length == 0) {
        return null;
      }

      return images.find(i => i.isMain) ?? null;

    }

}
