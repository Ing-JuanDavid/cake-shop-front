import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../core/responses/genericResponse.response';
import { Rate, RateModel } from '../../../core/models/rate.model';


@Injectable({
  providedIn: 'root',
})
export class RateService {
  private baseUrl = 'http://localhost:8080/products';

  http = inject(HttpClient);

  public getRatesByProduct(productId: string) : Observable<Response<Rate[]>>{
    const url = `${this.baseUrl}/${productId}/rates`
    return this.http.get<Response<Rate[]>>(url);
  }

  public sendRate(productId:string, rate:RateModel) : Observable<Response<Rate>>{
    const url = `${this.baseUrl}/${productId}/rates`;
    return this.http.post<Response<Rate>>(url, rate)
  }


  public updateRate(productId:string, rateId:string, rate:RateModel) : Observable<Response<Rate>>{
    const url = `${this.baseUrl}/${productId}/rates/${rateId}`;
    return this.http.put<Response<Rate>>(url, rate)
  }

  public deleteRate(rateId: number) : Observable<Response<Rate>> {
    const url = this.baseUrl.replace('products', 'rates') + `/${rateId}`;
    return this.http.delete<Response<Rate>>(url);
  }

  public getRates(productId : string) : Observable<Response<Rate>> {
    const url = `${this.baseUrl}/${productId}/rate`;
    return this.http.get<Response<Rate>>(url);
  }
}
