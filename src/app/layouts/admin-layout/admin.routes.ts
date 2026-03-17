import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AdminGuard } from "../../core/guards/admin.guard";

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
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
        path: 'rates',
        loadComponent: ()=> import('./rates/rates.component').then(m=> m.Rates),
        canActivate: [AdminGuard]
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m=> m.Users),
        canActivate: [AdminGuard]
      }
    ]
  }
]
