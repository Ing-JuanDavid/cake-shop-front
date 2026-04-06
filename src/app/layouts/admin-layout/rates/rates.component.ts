import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RateService } from '../../main-layout/services/rate.service';
import { Rate } from '../../../core/models/rate.model';
import { AlertService } from '../../../core/services/alert.service';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'admin-rates-view',
  imports: [ReactiveFormsModule],
  templateUrl: './rates.html',
  styles: ``,
})
export class Rates {

  rateService = inject(RateService);
  categoryService =inject(CategoryService);
  productService = inject(ProductService);
  rateservice = inject(RateService)
  alertservice = inject(AlertService);
  fb = inject(FormBuilder);


  rates: Rate[] | null = null;
  products: Product[] | null = null;
  categories: Category[] | null = null;

  rateForm = this.fb.group({
    productId: [0, Validators.min(1)],
    categoryId: [0]
  })

  ngOnInit()
  {
    this.loadCategories();

    this.rateForm.get('categoryId')?.valueChanges.subscribe(value => {
      this.rateForm.get('productId')?.setValue(0);
      if(!value || value == 0) {
        this.products = null;
        return;
      }

      this.loadProducts(value);
    })
  }


  get f()
  {
    return this.rateForm.controls;
  }

  loadCategories()
  {
    this.categoryService.getAllCategories().subscribe(
      {
        next: res=>this.categories = res.data
      }
    );
  }

  loadRates()
  {

    if(this.rateForm.invalid) {
      this.rateForm.markAllAsTouched;
      return;
    }

    const productId = this.rateForm.getRawValue().productId;

    this.rateService.getRatesByProduct(productId!.toString()).subscribe({
      next: res => this.rates = res.data,
      error: err => {
        this.alertservice.error(err.error.error);
        this.alertservice.clear(2000);
      }
    });
  }

  loadProducts(categoryId: number)
  {
    this.productService.getProductsByCategory(categoryId.toString()).subscribe({
      next: res=> {this.products = res.data}
    })
  }

  getProductsByCategory(event: Event)
  {
    const inputSelect = event.target as HTMLInputElement;
    console.log('Category: ', inputSelect.value);
  }

  deleteRate(rateId: number)
  {
    this.rateService.deleteRate(rateId).subscribe(
      {
        next: res=>{
          this.alertservice.success('Calificacion eliminada');
          this.loadRates();
          this.alertservice.clear(2000);
        },
        error: err=>{
          this.alertservice.error(err.error.error);
          this.alertservice.clear(2000);
        }
      }
    )
  }
}
