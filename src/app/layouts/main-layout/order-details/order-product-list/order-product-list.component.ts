import { Component, Input } from '@angular/core';
import { Order } from '../../../../core/models/order.model';
import { OrderProduct } from '../order-product/order-product.component';

@Component({
  selector: 'order-details-order-product-list',
  imports: [OrderProduct],
  template: `
    @for (product of order.products; track product.productId) {
      <order-details-product [orderProduct]="product"></order-details-product>
    }
  `,
  styles: ``,
})
export class OrderProductList {
  @Input() order!: Order;
}
