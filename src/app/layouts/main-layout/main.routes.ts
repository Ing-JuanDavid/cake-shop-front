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
      }
    ]

  }
];
