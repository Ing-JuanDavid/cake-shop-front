import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../core/dtos/responses/genericResponse.response';
import { Product } from '../../../core/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class productService {

  baseUrl = 'http://localhost:8080/products';
  http = inject(HttpClient);

  public getProductsByCategory(categoryId: number) : Observable<Response<Product[]>>
  {
    return this.http.get<Response<Product[]>>(`${this.baseUrl}/categories/${categoryId}`);
  }

}
