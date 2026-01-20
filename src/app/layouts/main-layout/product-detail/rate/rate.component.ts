import { Component, EventEmitter, Input, Output } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AsyncPipe,  } from '@angular/common';
import { OrderService } from '../../../../core/services/order.service';
import { UserService } from '../../../../core/user/user.service';
import { RateList } from "../rate-list/rate-list.component";
import { SendRate } from "../send-rate/send-rate.component";
import { Rate, RateService } from '../../../../core/services/rate.service';

@Component({
  selector: 'product-details-rate',
  standalone: true,
  imports: [AsyncPipe, RateList, SendRate],
  template: `

  <div class="flex flex-col gap-10">

  @if(orderList$ |async; as orderList) { @if(orderList.length>0) {

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
  orderList$!: Observable<any>;



  constructor(
    private orderService: OrderService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    if (this.userService.currentUser()) {
      this.orderList$ = this.orderService
        .getOrdersByProductId(this.productId!)
        .pipe(map((res) => res.data));
    }
  }


}
