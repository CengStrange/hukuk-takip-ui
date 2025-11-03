import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.default),
  },

  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.default),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.default),
  },

  {
    path: 'musteriler',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/musteriler/list/list.component').then(m => m.default),
  },
  {
    path: 'musteriler/yeni',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/musteriler/form/form.component').then(m => m.default),
  },
  {
    path: 'musteriler/duzenle/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/musteriler/form/form.component').then(m => m.default),
  },

  {
    path: 'ihtarlar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/ihtarlar/list/list.component').then(m => m.default),
  },
  {
    path: 'ihtarlar/yeni',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/ihtarlar/form/form.component').then(m => m.default),
  },
  {
    path: 'ihtarlar/duzenle/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/ihtarlar/form/form.component').then(m => m.default),
  },

  
  {
    path: 'admin',
    canActivate: [authGuard],
    data: { roles: ['admin'] },
    loadComponent: () =>
      import('./pages/admin/admin.component').then(m => m.default),
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized.component').then(m => m.default),
  },

  {
    path: 'avukatlar',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/avukatlar/avukat-list/avukat-list.component')
            .then(m => m.default),
      },
      {
        path: 'yeni',
        loadComponent: () =>
          import('./pages/avukatlar/avukat-form/avukat-form.component')
            .then(m => m.default),
      },
      {
        path: 'duzenle/:id',
        loadComponent: () =>
          import('./pages/avukatlar/avukat-form/avukat-form.component')
            .then(m => m.default),
      },
    ],
  },
  {
  path: 'icra-dosyalari',
  canActivate: [authGuard], 
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./pages/icra-dosyalari/list/list.component').then(m => m.default)
    },
    {
      path: 'yeni',
      loadComponent: () =>
        import('./pages/icra-dosyalari/form/form.component').then(m => m.default)
    },
    {
      path: ':id/duzenle',
      loadComponent: () =>
        import('./pages/icra-dosyalari/form/form.component').then(m => m.default)
    }
  ]
  },
  {
    path: 'urunler',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/urunler/urun-list/urun-list.component')
            .then(m => m.default),
      },
      {
        path: 'yeni',
        loadComponent: () =>
          import('./pages/urunler/urun-form/urun-form.component')
            .then(m => m.default),
      },
      {
        path: 'duzenle/:id',
        loadComponent: () =>
          import('./pages/urunler/urun-form/urun-form.component')
            .then(m => m.default),
      },
    ],
  },


  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
