import { Routes } from "@angular/router";
import { MainLayout } from "./main-layout.component";
import { userGuard } from "../../core/guards/user.guard";
import { logedGuard } from "../../core/guards/loged.guard";


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
        path: 'products/search',
        loadComponent: () => import('./product-search/product-search.component').then(m => m.ProductSearch)
      },
      {
        path: 'products/:id',
        loadComponent: ()=> import('./product-detail/product-detail.component').then(m=>m.ProductDetailComponent)
      },
      {
        path: ':category/:id/products',
        loadComponent: ()=> import('./products/products.component').then(m => m.Products)
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
        loadComponent: ()=> import('./user-profile/user-profile.component').then(m=>m.UserProfile),
        canActivate: [logedGuard]
      }
    ]

  }
];
