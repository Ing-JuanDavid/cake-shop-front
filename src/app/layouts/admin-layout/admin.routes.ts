import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./admin-layout.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'products',
        loadComponent: ()=> import('./products/product.component').then(m=> m.ProductComponent)
      },
      {
        path: 'categories',
        loadComponent: ()=> import('./categories/categories.component').then(m=> m.Categories)
      },
      {
        path: 'rates',
        loadComponent: ()=> import('./rates/rates.component').then(m=> m.Rates)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users.component').then(m=> m.Users)
      }
    ]
  }
]
