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
      }
    ]


  }
]
