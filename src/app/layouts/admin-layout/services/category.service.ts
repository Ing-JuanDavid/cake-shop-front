import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../core/responses/genericResponse.response';
import { Category } from '../../../core/models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  baseUrl = 'http://localhost:8080/categories';
  http = inject(HttpClient);

  public getCategories(): Observable<Response<Category[]>>
  {
    return this.http.get<Response<Category[]>>(this.baseUrl);
  }

  public postCategory(category: {name: string}) : Observable<Response<Category>>
  {
    return this.http.post<Response<Category>>(this.baseUrl, category);
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
