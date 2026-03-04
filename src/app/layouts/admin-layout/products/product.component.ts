import { Component, inject } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { CategoryService } from '../services/category.service';
import { Category } from '../../../core/models/category.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../main-layout/services/product.service';
import { AlertService } from '../../main-layout/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-product-view',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: 'product.html',
  styles: ``,
})
export class ProductComponent {
  editing = false;
  categories: Category[] | [] = [];
  products: Product[] | null = null;

  fb = inject(FormBuilder);
  categoryService = inject(CategoryService);
  productService = inject(ProductService);
  alertService = inject(AlertService);
  router = inject(Router);


  productForm = this.fb.nonNullable.group({

        productId: [0],

        name: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100)
          ]
        ],

        price: [
          0.01,
          [
            Validators.required,
            Validators.min(0.01)
          ]
        ],

        quant: [
          1,
          [
            Validators.required,
            Validators.min(0)
          ]
        ],

        categoryId: [
          0,
          [
            Validators.min(1),
            Validators.required
          ]
        ],

        description: [
          '',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(500)
          ]
        ],

        img: this.fb.control<null|File>(null,
          [
            Validators.required
          ]
        )

  });


  ngOnInit()
  {
    this.loadData();
  }

  loadData()
  {

    this.categoryService.getCategories().subscribe(
      {next: res=>this.categories=res.data}
    )

    this.loadProducts();

  }

  loadProducts()
  {
    this.productService.getProducts().subscribe(
      {next: res=>this.products = res.data}
    )
  }

 onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const imgControl = this.productForm.get('img');

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

create()
{

  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  const formData = this.getFormData();

  if(!formData) {
    this.alertService.error('Ocurrio un error');
    return;
  };

  this.productService.postProduct(formData).subscribe({
    next: () => {
      this.alertService.success('Producto creado');
      this.loadProducts();
       this.alertService.clear(2000);
    },
    error: err => {
      this.alertService.error(err.error.error);
      this.alertService.clear(2000);
    }
  });
}

edit()
{

  const formData = this.getFormData();

  if(this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  };

  if(!formData) {
    this.alertService.error('Ocurrio un error');
    return;
  };

  this.productService.putProduct(formData, formData.get('productId') as string).subscribe({
    next: () => {
      this.alertService.success('Producto actualizado');
      this.loadProducts();
       this.alertService.clear(2000);
    },
    error: err => {
      this.alertService.error(err.error.error);
      this.alertService.clear(2000);
    }
  });
}

delete(productId: number)
{
  this.productService.deleteProduct(productId).subscribe(
    {next: ()=> {
      this.alertService.success('Producto eliminado');
      this.loadProducts();
      this.alertService.clear(2000);
    },
    error: err => {
      this.alertService.error(err.error.error);
      this.alertService.clear(2000);
    }
  }
  );

}

clearForm()
{
  this.productForm.reset();
  this.editing = false;

}

fillFormToEdit(product: Product)
{
  this.editing = true;
  this.productForm.patchValue({...product, categoryId: this.getCategory(product.categoryName)?.categoryId});

  const element = document.getElementById('form-section');
  element?.scrollIntoView({behavior: 'smooth'})

}

getCategory(categoryName: string)
{
  return this.categories.find(c=>c.name === categoryName);
}

getFormData(): FormData | null
{

  const {productId, ...product} = this.productForm.getRawValue();

  const formData = new FormData();

  if(this.editing) formData.append('productId', productId.toString());

  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price.toString());
  formData.append('quant', product.quant.toString());
  formData.append('categoryId', product.categoryId.toString());


  if (!product.img) {
    return null;
  }

  formData.append('img', product.img);

  return formData;
}

goToProduct(productId:number){
  this.router.navigate([`product/${productId}`]);
}


}
