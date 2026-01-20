import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Rate {
  rateId: number;
  userName: string;
  score: number;
  comment: string;
  creationDate: Date;
  productId: number;
  productName:string;
}

export interface RateModel {
  score: number;
  comment: string;
}

export interface SingleRate {
   ok: boolean;
  data : Rate | null;
  error: string | null;
}

export interface RateResponse {
  ok: boolean;
  data : Rate[] | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class RateService {
  private baseUrl = 'http://localhost:8080/products';

  http = inject(HttpClient);

  public getRatesByProduct(productId: string) : Observable<RateResponse>{
    const url = `${this.baseUrl}/${productId}/rates`
    return this.http.get<RateResponse>(url);
  }

  public sendRate(productId:string, rate:RateModel) : Observable<SingleRate>{
    const url = `${this.baseUrl}/${productId}/rates`;
    return this.http.post<SingleRate>(url, rate)
  }


  public updateRate(productId:string, rateId:string, rate:RateModel) : Observable<RateResponse>{
    const url = `${this.baseUrl}/${productId}/rates/${rateId}`;
    return this.http.put<RateResponse>(url, rate)
  }

  public getRates(productId : string) : Observable<SingleRate> {
    const url = `${this.baseUrl}/${productId}/rate`;
    return this.http.get<SingleRate>(url);
  }
}
