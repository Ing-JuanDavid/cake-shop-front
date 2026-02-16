import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Product, ProductDto } from '../../../core/models/product.model';
import { Response } from '../../../core/responses/genericResponse.response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/products';

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

  public getProducts() : Observable<Response<Product[] | null>>
  {
    return this.http.get<Response<Product[] | null>>(this.baseUrl)
    .pipe(
      catchError(err => this.handlerError(err)),
    );
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

  public deleteProduct(productId: number): Observable<Response<Product>>
  {
    return this.http.delete<Response<Product>>(`${this.baseUrl}/${productId}`);
  }

}
