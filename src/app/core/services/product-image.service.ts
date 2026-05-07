import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../dtos/responses/genericResponse.response';
import { ProductImage } from '../models/productImage.model';

@Injectable({
  providedIn: 'root',
})
export class ProductImageService {

  private baseUrl = 'http://localhost:8080/images';
  private http = inject(HttpClient);

  public updateImageProduct(imageId: number, isMain: boolean): Observable<Response<ProductImage>>
  {
    const url = `${this.baseUrl}/${imageId}`;
    let params = new HttpParams().set('isMain', isMain ? 'true' : 'false');
    return this.http.put<Response<ProductImage>>(url, {}, {params});
  }

}
