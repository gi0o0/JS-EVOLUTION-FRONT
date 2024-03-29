import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { RegisterUserComponent } from './views/registeruser/registeruser.component';
import { CheckUserComponent } from './views/checkuser/checkuser.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',

    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'register-user',
    component: RegisterUserComponent,
    data: {
      title: 'register-user'
    }
  },
  {
    path: 'check-user',
    component: CheckUserComponent,
    data: {
      title: 'check-user'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'queries_reports',
        loadChildren: () => import('./views/queries_reports/queries_reports.module').then(m => m.BaseModule)
      },
      {
        path: 'maintenance',
        loadChildren: () => import('./views/maintenance/maintenance.module').then(m => m.BaseModule)
      },
      {
        path: 'request',
        loadChildren: () => import('./views/request/request.module').then(m => m.BaseModule)
      },   
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true },) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
