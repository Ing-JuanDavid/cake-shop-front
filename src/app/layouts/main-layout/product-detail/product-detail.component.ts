import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RateListComponent } from "./rate-list/rate-list.component";
import { ProductDetails } from "./product-details/product-details.component";

@Component({
  selector: 'product-detail-view',
  standalone: true,
  imports: [CommonModule, RateListComponent, ProductDetails],
  template: `

   <div class="pt-10 px-20 min-h-screen bg-white">


      <product-details [id]="id"></product-details>
      <rate-list [id]="id"></rate-list>

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
