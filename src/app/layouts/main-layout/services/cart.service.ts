import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Response } from '../../../core/responses/genericResponse.response';
import { CartProduct, CartProducts } from '../../../core/models/cart.model';
import { filter } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class CartService {

  private baseUrl = 'http://localhost:8080/cart';
  private http = inject(HttpClient);


  private cartSubject = new BehaviorSubject<CartProducts | null>(null);
  cart$ = this.cartSubject.asObservable();
  //.pipe(filter((cart): cart is CartProducts => cart !== null));


  public getCart() {
    return this.cart$;
  }

  public setCart(cart:CartProducts | null) {
    this.cartSubject.next(cart);
  }

  public findProduct(productId: number, products: CartProduct[] | null) : CartProduct | null  {

    return products?.find(p=>p.productId == productId) ?? null;
  }


  //Http requets

  public add(productBody: {productId:number, quant:number}): Observable<Response<CartProduct>> {

    return this.http.post<Response<CartProduct>>(this.baseUrl, productBody);

  }

  public delete(productId: number): Observable<Response<CartProduct>> {
    return this.http.delete<Response<CartProduct>>(`${this.baseUrl}/${productId}`);
  }

  public get(): Observable<Response<CartProducts>> {
    return this.http.get<Response<CartProducts>>(this.baseUrl);
  }

}
