import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
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


export interface rateResponse {
  ok: boolean;
  data : Rate[] | null;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class RateService {
  private baseUrl = 'http://localhost:8080/products/';

  http = inject(HttpClient);

  public getRatesByProduct(productId: string) : Observable<rateResponse>{
    const url = `${this.baseUrl}${productId}/rates`
    return this.http.get<rateResponse>(url);
  }
}
