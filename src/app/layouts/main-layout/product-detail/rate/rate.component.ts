import { Component, Input } from '@angular/core';
import { RateService } from '../../../../core/services/rate.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe, NgClass } from '@angular/common';
import { OrderService } from '../../../../core/services/order.service';
import { UserService } from '../../../../core/user/user.service';
import { SendRate } from "../send-rate/send-rate.component";
import { RateList } from "../rate-list/rate-list.component";

@Component({
  selector: 'product-details-rate',
  imports: [AsyncPipe, SendRate, RateList],
  template: `

  <div class="space-y-4 mt-10">
    @if(orderList$ |async; as orderList) { @if(orderList.length>0) {

      <!-- Make rate component -->
      <rate-send-rate></rate-send-rate>

    } }

    <!-- Rate list component -->

    @if (rateList$ | async; as rateList) {
      <rate-rate-list [rateList]="rateList"></rate-rate-list>
    }

  </div>

  `,
  styles: ``,
})
export class RateComponent {
  @Input() id: string | null = null;
  rateList$!: Observable<any>;
  orderList$!: Observable<any>;



  constructor(
    private rateService: RateService,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.rateList$ = this.rateService.getRatesByProduct(this.id!).pipe(map((rate) => rate.data));
    if (this.userService.currentUser()) {
      this.orderList$ = this.orderService
        .getOrdersByProductId(this.id!)
        .pipe(map((res) => res.data));
    }
  }
}
