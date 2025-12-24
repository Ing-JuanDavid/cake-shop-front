import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: ()=>
      import('./layouts/main-layout/main.routes').then(m => m.MAIN_ROUTES)
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: 'productos',
        loadComponent: () => import('./layouts/admin-layout/products/product.component').then(m => m.ProductComponent)
      }
    ]
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./layouts/auth-layout/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {path: '**', redirectTo: '', pathMatch: 'full'},
];
