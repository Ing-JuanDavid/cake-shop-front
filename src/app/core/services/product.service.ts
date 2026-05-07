import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Response } from '../dtos/responses/genericResponse.response';
import { Product, SimpleProduct } from '../models/product.model';
import { ProductFilters } from '../dtos/requests/productFilters.request';
import { PaginatedResponse } from '../dtos/responses/paginatedProduct.response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  baseUrl = 'http://localhost:8080/products';
  http = inject(HttpClient);

   private handlerError(error: HttpErrorResponse) {

    if(error.status !== 0) {
      return of({
        ok: false,
        error: error.error.error ?? 'error desconocido',
        data : null
      });
    }

    return of({
      ok: false,
      error: 'No se pudo conectar con el servidor',
      data: null
    });

  }

  public getAllProducts() : Observable<Response<Product[] | null>>
  {
    return this.http.get<Response<Product[] | null>>(this.baseUrl + '/all')
    .pipe(
      catchError(err => this.handlerError(err)),
    );
  }


  public getProducts(
    currentPage: number = 1,
    sizePage: number = 5,
    filters?: ProductFilters
): Observable<Response<PaginatedResponse<Product>>> {

    let params = new HttpParams()
        .set('currentPage', currentPage)
        .set('sizePage', sizePage);

    if (filters?.name)      params = params.set('name', filters.name);
    if (filters?.category)  params = params.set('category', filters.category);
    if (filters?.minPrice)  params = params.set('minPrice', filters.minPrice);
    if (filters?.maxPrice)  params = params.set('maxPrice', filters.maxPrice);
    if (filters?.available != null) params = params.set('available', filters.available);
    if(filters?.active != null) params = params.set("active", filters.active)

      console.log(params);

    return this.http.get<Response<PaginatedResponse<Product>>>(this.baseUrl, { params });
}

  public getProductById(id:string): Observable<Response<Product | null>>
  {
    const url = `${this.baseUrl}/${id}`
    return this.http.get<Response<Product>>(url);
  }

  public postProduct(body: FormData): Observable<Response<Product>>
  {
    return this.http.post<Response<Product>>(this.baseUrl, body);
  }

  public putProduct(body: FormData, productId: string): Observable<Response<Product>>
  {
    return this.http.put<Response<Product>>(`${this.baseUrl}/${productId}`, body);
  }

  public deleteProduct(productId: number): Observable<Response<Product>>
  {
    return this.http.delete<Response<Product>>(`${this.baseUrl}/${productId}`);
  }

  public getProductsByCategory(categoryId: string) : Observable<Response<SimpleProduct[]>>
  {
    return this.http.get<Response<SimpleProduct[]>>(`${this.baseUrl}/categories/${categoryId}`);
  }

}
