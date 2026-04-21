import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../dtos/responses/genericResponse.response';
import { Address } from '../models/address.model';
import { AddressDto } from '../models/addressDto.model';


@Injectable({
  providedIn: 'root',
})
export class AddressService {

  private baseUrl = 'http://localhost:8080/addresses';
  private http = inject(HttpClient);

  public createAddress(address: AddressDto): Observable<Response<Address>>
  {
    return this.http.post<Response<Address>>(this.baseUrl, address);
  }

  public getAddresses() : Observable<Response<Address[]>>
  {
    const url = `${this.baseUrl}/user/all`;
    return this.http.get<Response<Address[]>>(url);
  }

  public setDefaultAddress(addressId: number) : Observable<Response<Address>>
  {
    const url = `${this.baseUrl}/user/default/set/${addressId}`;
    return this.http.get<Response<Address>>(url);
  }

  public deleteAddress(addressId: number): Observable<any>
  {
    const url = `${this.baseUrl}/${addressId}`;
    return this.http.delete<any>(url);
  }
}
