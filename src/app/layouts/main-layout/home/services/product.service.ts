import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

export interface Product {
  productId: number;
  name: string;
  price: number;
  quant: number;
  categoryName: string;
  score: number;
  imgUrl: string;
}

export interface ProductResponse {
  ok: boolean;
  data: Product[] | null;
  error: string | null;
}


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
        fieldErrors: error.error.fieldErrors ?? null,
        data : null
      });
    }

    return of({
      ok: false,
      error: 'No se pudo conectar con el servidor',
      fieldErrors: null,
      data: null
    });

  }

  public getProducts() : Observable<ProductResponse>
  {
    return this.http.get<ProductResponse>(this.baseUrl)
    .pipe(
      catchError(err => this.handlerError(err)),
    );
  }

}
