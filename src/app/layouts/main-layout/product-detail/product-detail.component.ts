import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RateComponent } from "./rate/rate.component";
import { ProductDetails } from "./product-details/product-details.component";
import { RateService } from '../services/rate.service';
import { ProductService } from '../services/product.service';
import { Product } from '../../../core/models/product.model';
import { Rate } from '../../../core/models/rate.model';

@Component({
  selector: 'product-detail-view',
  standalone: true,
  imports: [CommonModule, RateComponent, ProductDetails],
  template: `

   <div class="pt-5 px-10 md:px-20 min-h-screen">
      <product-details [product]="product"></product-details>
      <product-details-rate [productId]="productId" [rateList]="rateList" (updatedData)="loadData()" class="mt-10"></product-details-rate>
    </div>
  `,
  styles: `
  `,
})
export class ProductDetailComponent {

  productId!: string;
  product: Product | null = null;
  rateList: Rate[] | null = null;


  constructor(
    private route : ActivatedRoute,
    private productService: ProductService,
    private rateService: RateService
  ){}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }



  loadData() {
    this.productService.getProductById(this.productId).subscribe(
      {next: res => {
        this.product = res.data
        this.rateService.getRatesByProduct(this.productId).subscribe(
          {next: res=> {this.rateList = res.data
            console.log('product:', this.product);
            console.log('rates: ', this.rateList);
          }}
        )
      }}
    )
  }
}
