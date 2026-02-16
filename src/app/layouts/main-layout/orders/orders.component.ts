import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { Order } from '../../../core/models/order.model';
import { OrderCard } from "./order-card/order-card.component";
import { NotFoundView } from '../info-views/not-found/not-found.component';

@Component({
  selector: 'orders-view',
  imports: [OrderCard, NotFoundView],
  template: `

  <div class="w-3/4 m-auto max-h-dvh overflow-y-auto">
    @for(order of ordersList; track order.orderId) {
      <orders-order-card [order]="order" class="w-3/4"></orders-order-card>
    }
    @empty {
      <info-view-not-found [msj]="'Aún no tienes pedidos'"></info-view-not-found>
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
