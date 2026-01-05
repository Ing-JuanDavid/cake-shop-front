import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Product } from './product.service';
import { Observable } from 'rxjs';

export interface Order {
  products : Product[],
  total: number,
  status: string,
  date: Date,
  orderId: number
}


export interface OrderResponse {
  ok: boolean;
  data: Order[] | null;
  error: string | null;

}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/orders';
  private http = inject(HttpClient);

  public getOrdersByProductId(productId : string):Observable<OrderResponse>
  {
    const url = `${this.baseUrl}/product/${productId}`;
    return this.http.get<OrderResponse>(url);
  }

}
