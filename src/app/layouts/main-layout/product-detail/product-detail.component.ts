import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RateComponent } from "./rate/rate.component";
import { ProductDetails } from "./product-details/product-details.component";

@Component({
  selector: 'product-detail-view',
  standalone: true,
  imports: [CommonModule, RateComponent, ProductDetails],
  template: `

   <div class="pt-10 px-10 md:px-20 min-h-screen bg-white">


      <product-details [id]="id"></product-details>
      <product-details-rate [id]="id"></product-details-rate>

    </div>
  `,
  styles: `
  `,
})
export class ProductDetailComponent {

  id!: string;

  constructor(
    private route : ActivatedRoute,
  ){}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

}
