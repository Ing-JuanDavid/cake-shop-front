import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../core/dtos/responses/genericResponse.response';
import { Order } from '../../../core/models/order.model';
import { orderDto } from '../../../core/dtos/requests/order.request';
import { PaginatedResponse } from '../../../core/dtos/responses/paginatedProduct.response';


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

  public getOrdersByUser(nip: number, currentPage: number, pageSize: number):Observable<Response<PaginatedResponse<Order>>>
  {
    let params = new HttpParams()
        .set('currentPage', currentPage)
        .set('pageSize', pageSize);
    return this.http.get<Response<PaginatedResponse<Order>>>(`${this.baseUrl}/users/${nip}`, {params:  params});
  }

  public updateOrderStatus(orderId: string, order: orderDto): Observable<Response<Order>>
  {
    return this.http.put<Response<Order>>(`${this.baseUrl}/${orderId}`, order);
  }

}
