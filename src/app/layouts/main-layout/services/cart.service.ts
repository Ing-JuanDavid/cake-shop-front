import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../core/responses/genericResponse.response';
import { CartProduct, CartProducts } from '../../../core/models/cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {

  private baseUrl = 'http://localhost:8080/cart';
  private http = inject(HttpClient);

  public addCart(productBody: {productId:number, quant:number}): Observable<Response<CartProduct>> {

    return this.http.post<Response<CartProduct>>(this.baseUrl, productBody);

  }

  public getCart(): Observable<Response<CartProducts>> {
    return this.http.get<Response<CartProducts>>(this.baseUrl);
  }

}
