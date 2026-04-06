import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../dtos/responses/genericResponse.response';
import { Category } from '../models/category.model';
import { CategoryFilters } from '../dtos/requests/categoryFilters.request';
import { PaginatedResponse } from '../dtos/responses/paginatedProduct.response';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  baseUrl = 'http://localhost:8080/categories';
  http = inject(HttpClient);

  public getAllCategories(): Observable<Response<Category[]>>
  {
    return this.http.get<Response<Category[]>>(this.baseUrl+'/all');
  }

  public getCategories(
    currentPage: number =1,
    sizePage: number = 5,
    filters?: CategoryFilters
  ): Observable<Response<PaginatedResponse<Category>>>
  {

    let params = new HttpParams()
      .set('currentPage', currentPage)
      .set('sizePage', sizePage);;

    if(filters?.name) params = params.set('name', filters.name);
    if(filters?.minProducts) params = params.set('minProducts', filters.minProducts);
    if(filters?.maxProducts) params = params.set('maxProducts', filters.maxProducts);

    return this.http.get<Response<PaginatedResponse<Category>>>(this.baseUrl, {params});
  }

  public postCategory(data: FormData) : Observable<Response<Category>>
  {
    return this.http.post<Response<Category>>(this.baseUrl, data);
  }

  public putCategory(category: {name: string}, categoryId: number) : Observable<Response<Category>>
  {
    return this.http.put<Response<Category>>(`${this.baseUrl}/${categoryId}`, category);
  }

  public delteCategory(categoryId: number) : Observable<Response<Category>>
  {
    return this.http.delete<Response<Category>>(`${this.baseUrl}/${categoryId}`);
  }
}
