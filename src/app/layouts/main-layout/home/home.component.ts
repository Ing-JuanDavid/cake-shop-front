import { Component } from '@angular/core';
import { UserService } from '../../../core/user/user.service';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ProductCardComponent } from "../home/product-card/product-card.component";
import { Product } from '../../../core/models/product.model';

import { Response } from '../../../core/responses/genericResponse.response';


@Component({
  selector: 'home-view',
  imports: [AsyncPipe, ProductCardComponent],
  template: `

  <div class="pt-5 px-20">

    @if(products$ | async; as products) {
     @if(products.ok) {
      <div class="flex flex-wrap gap-10 justify-center">
         @for(product of products.data; track product.productId) {
          <home-product-card [product]="product" (click)="goToProduct(product.productId)"></home-product-card>
        }@empty {
          <p>Aun no hay nada que mostrar</p>
        }
      </div>

     }
    }

    @if(userService.currentUser()) {
      <button
    class="
      bg-red-500
      text-white f
        ont-bold px-1
        py-1.5 rounded-sm
      hover:bg-red-800
        hover:cursor-pointer"
      (click)="logout()">Logout</button>
    }

    </div>


  `,
  styles: ``,
})
export class HomeComponent {

  public products$!: Observable<Response<Product[] | null>>;

  public constructor(
    public userService: UserService,
    private router:Router,
    private productService: ProductService
  ) {}

  logout() {
    this.userService.setCurrentUser(null);
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }

  goToProduct(id:any){
    this.router.navigate([`/product/${id}`]);
  }

  ngOnInit() {
    this.products$ = this.productService.getProducts();
    console.log('Current user:', this.userService.currentUser());
  }
}
