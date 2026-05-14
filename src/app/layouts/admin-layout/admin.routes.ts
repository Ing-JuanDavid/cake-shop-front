import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AdminGuard } from "../../core/guards/admin.guard";

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: ()=> import('./dashboard/dashboard.component').then(m=>m.Dashboard),
        canActivate: [AdminGuard]
      },
      {
        path: 'products',
        loadComponent: ()=> import('./products/product.component').then(m=> m.ProductComponent),
        canActivate: [AdminGuard]
      },
      {
        path: 'categories',
        loadComponent: ()=> import('./categories/categories.component').then(m=> m.Categories),
        canActivate: [AdminGuard]
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m=> m.Users),
        canActivate: [AdminGuard]
      },
      {
        path: 'users/:userId',
        loadComponent: ()=> import('./user-details/user-details.component').then(m => m.UserDetails),
        canActivate: [AdminGuard]
      },
      {
        path: 'users/:userId/orders/:orderId',
        loadComponent: ()=> import('./order-details/order-details.component').then(m => m.OrderDetails),
      }
    ]
  }
]
