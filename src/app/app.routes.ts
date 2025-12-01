import { Routes } from '@angular/router';
import { Home } from './home/home';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'form',
    loadComponent: () =>
      import('./forms/forms').then((m) => m.Forms),
  },
];
