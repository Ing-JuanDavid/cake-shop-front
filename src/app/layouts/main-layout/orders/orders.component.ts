import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../../../core/models/order.model';
import { OrderCard } from "./order-card/order-card.component";

@Component({
  selector: 'orders-view',
  imports: [OrderCard],
  template: `

  @if(ordersList.length == 0) {
    <div class="px-10 md:px-20 min-h-screen flex items-center justify-center">
        <p class="text-yellow-900/70 text-lg">Aun no tienes pedidos</p>
    </div>
  }

  <div class="w-3/4 m-auto max-h-dvh overflow-y-auto">
    @for(order of ordersList; track order.orderId) {
      <orders-order-card [order]="order" class="w-3/4"></orders-order-card>
    }

  </div>


  `,
  styles: `
  `,
})
export class Orders {

  ordersList: Order[] | [] = [];

constructor(
  private orderService: OrderService
){}

  ngOnInit(){
    this.orderService.getAllOrders().subscribe(
      {
        next: res=> this.ordersList = res.data.map(order=> ({...order, date: new Date(order.date)}))
                                              .sort((a,b)=>b.date.getTime() - a.date.getTime())
      }
    )
  }
}
