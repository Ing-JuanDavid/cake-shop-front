import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../core/responses/genericResponse.response';
import { Order } from '../../../core/models/order.model';


@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/orders';
  private http = inject(HttpClient);

  public getOrdersByProductId(productId : string):Observable<Response<Order[] | null>>
  {
    const url = `${this.baseUrl}/product/${productId}`;
    return this.http.get<Response<Order[] | null>>(url);
  }

  public makeOrder(): Observable<Response<Order>>
  {
    return this.http.post<Response<Order>>(this.baseUrl,{});
  }

  public getAllOrders(): Observable<Response<Order[]>> {
    return this.http.get<Response<Order[]>>(this.baseUrl);
  }

  public getOrderById(orderId: string): Observable<Response<Order>>
  {
    return this.http.get<Response<Order>>(this.baseUrl+`/${orderId}`);
  }

}
