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
    loadChildren: () => import('./layouts/admin-layout/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./layouts/auth-layout/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'unauthorized',
    loadComponent: ()=> import('./shared/unauthorized/unauthorized.component').then(m=> m.Unauthorized)
  },
  {path: '**', redirectTo: '', pathMatch: 'full'},
];
