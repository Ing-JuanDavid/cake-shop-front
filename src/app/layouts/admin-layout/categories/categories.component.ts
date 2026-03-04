import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../services/category.service';
import { AlertService } from '../../main-layout/services/alert.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'admin-categories-view',
  imports: [ReactiveFormsModule],
  templateUrl: './categories.html',
  styles: ``,
})
export class Categories {

  editing = false;
  fb = inject(FormBuilder);
  categoryService = inject(CategoryService);
  alertService = inject(AlertService);

  categories : Category[] | null = null;

  categoryForm = this.fb.nonNullable.group(
    {
      categoryId: [0],
      name: ['', [Validators.required, Validators.maxLength(20)]]
    }
  )

  ngOnInit()
  {
    this.loadData();
  }


  fillFormToEdit(category: Category)
  {
    this.editing = true;

    const {productsNumber, ...formCategory} = category;

    this.categoryForm.patchValue(formCategory);

    const element = document.getElementById('form-section');
    element?.scrollIntoView({behavior: 'smooth'})
  }

  clearForm()
  {
    this.categoryForm.reset();
    this.editing = false;
  }

   get f()
  {
    return this.categoryForm.controls;
  }

  create()
  {
    if(this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const {categoryId, ...category} = this.categoryForm.getRawValue();

    this.categoryService.postCategory(category).subscribe(
      {
        next: res=>{
          this.clearForm();
          this.alertService.success('Categoria creada');
          this.loadData();
          this.alertService.clear(2000);
        },
        error: err=> {
          this.alertService.error(err.error.error);
          this.alertService.clear(2000);
        }
      }
    );

  }

  edit()
  {
     if(this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const {categoryId, ...category} = this.categoryForm.getRawValue();

    this.categoryService.putCategory(category, categoryId).subscribe(
      {
        next: res=>{
          this.clearForm();
          this.alertService.success('Categoria actualizada');
          this.loadData();
          this.alertService.clear(2000);
        },
        error: err=> {
          this.alertService.error(err.error.error);
          this.alertService.clear(2000);
        }
      }
    );

  }

  delete(categoryId: number)
  {
    this.categoryService.delteCategory(categoryId).subscribe(
      {
        next: res=> {
          this.clearForm();
          this.alertService.success('Categoria eliminada');
          this.loadData();
          this.alertService.clear(2000);
        }
      }
    )
  }


  loadData()
  {
    this.categoryService.getCategories().subscribe(
      {
        next: res=> this.categories = res.data
      }
    )
  }



}
