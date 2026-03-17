import { Routes } from "@angular/router";
import { MainLayout } from "./main-layout.component";
import { userGuard } from "../../core/guards/user.guard";


export const MAIN_ROUTES: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
          loadComponent: ()=> import('./home/home.component').then(m=>m.HomeComponent)
      },
      {
        path: 'product/:id',
        loadComponent: ()=> import('./product-detail/product-detail.component').then(m=>m.ProductDetailComponent)
      },
      {
        path: 'user/cart',
        loadComponent: ()=>import('./cart/cart.component').then(m=>m.Cart),
        canActivate: [userGuard]
      },
      {
        path: 'user/orders',
        loadComponent: ()=>import('./orders/orders.component').then(m=> m.Orders),
        canActivate: [userGuard]
      },
      {
        path: 'user/orders/:id',
        loadComponent: ()=>import('./order-details/order-details.component').then(m=>m.OrderDetails),
        canActivate: [userGuard]
      },
      {
        path: 'user/profile',
        loadComponent: ()=> import('./user-profile/user-profile.component').then(m=>m.UserProfile)
      }
    ]

  }
];
