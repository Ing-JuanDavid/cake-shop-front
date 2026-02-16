import { Component, inject } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { CategoryService } from '../services/category.service';
import { Category } from '../../../core/models/category.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../main-layout/services/product.service';
import { AlertService } from '../../main-layout/services/alert.service';

@Component({
  selector: 'app-product.component',
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
  if (!input.files?.length) return;

  const file = input.files[0];
  const maxSize = 2 * 1024 * 1024;

  const imgControl = this.productForm.get('img');

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
  imgControl?.markAsTouched();
}


get f() {
  return this.productForm.controls;
}

submit() {

  const { productId, ...product } = this.productForm.getRawValue();

  const formData = new FormData();

  formData.append('name', product.name);
  formData.append('description', product.description);
  formData.append('price', product.price.toString());
  formData.append('quant', product.quant.toString());
  formData.append('categoryId', product.categoryId.toString());

  if (!product.img) {
  this.alertService.error('Debe seleccionar una imagen');
  return;
}

formData.append('img', product.img);

  this.productService.postProduct(formData).subscribe({
    next: () => {
      this.alertService.success('Producto creado');
       this.alertService.clear(2000);
       this.loadProducts();
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
      this.alertService.clear(2000);
      this.loadProducts();
    },
    error: err => {
      this.alertService.error(err.error.error);
      this.alertService.clear(2000);
    }
  }
  );

}


}
