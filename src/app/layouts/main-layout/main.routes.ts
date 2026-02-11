import { Routes } from "@angular/router";
import { MainLayout } from "./main-layout.component";

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
        loadComponent: ()=>import('./cart/cart.component').then(m=>m.Cart)
      },
      {
        path: 'user/orders',
        loadComponent: ()=>import('./orders/orders.component').then(m=> m.Orders)
      },
      {
        path: 'user/orders/:id',
        loadComponent: ()=>import('./order-details/order-details.component').then(m=>m.OrderDetails)
      },
      {
        path: 'user/profile',
        loadComponent: ()=> import('./user-profile/user-profile.component').then(m=>m.UserProfile)
      }
    ]

  }
];
