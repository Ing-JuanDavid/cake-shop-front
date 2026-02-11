import { Component, EventEmitter, Input, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AsyncPipe,  } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { RateList } from "../rate-list/rate-list.component";
import { SendRate } from "../send-rate/send-rate.component";
import { Response } from '../../../../core/responses/genericResponse.response';
import { Order } from '../../../../core/models/order.model';
import { Rate } from '../../../../core/models/rate.model';
import { SessionService } from '../../../../core/session/session.service';

@Component({
  selector: 'product-details-rate',
  standalone: true,
  imports: [AsyncPipe, RateList, SendRate],
  template: `

  <div class="flex flex-col gap-10">

  @if(orderList$ |async; as orderList) { @if(orderList.data?.length ?? 0 >0) {

      <!-- Make rate component -->
      <rate-send-rate [productId]="productId" (updatedData)="updatedData.emit()"></rate-send-rate>

    } }

    <!-- Rate list component -->
    <rate-rate-list [rateList]="rateList"></rate-rate-list>

  </div>



  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class RateComponent {
  @Input() productId: string = '';
  @Input() rateList: Rate[] | null= null;
  @Output() updatedData = new EventEmitter();
  orderList$!: Observable<Response<Order[] | null>>;



  constructor(
    private orderService: OrderService,
    private sessionService: SessionService,
  ) {}

  ngOnInit() {
    if (this.sessionService.currentUser()) {
      this.orderList$ = this.orderService
        .getOrdersByProductId(this.productId!);
    }
  }


}
