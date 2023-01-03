import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './shared/auth-guard.service';
import { Roles } from './shared/constants/constants';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          loadChildren: () =>
            import(
              './components/admin/admin-layout/admin.layout.module'
            ).then((m) => m.AdminLayoutModule),
          canActivate: [AuthGuard],
          data: { role: Roles.ADMIN },
        },
        {
          path: 'login',
          loadChildren: () =>
            import('./components/login/login.module').then(
              (m) => m.LoginModule
            ),
        },
        {
          path: '404',
          loadChildren: () =>
            import('./components/not-found/not-found.module').then(
              (m) => m.NotFoundModule
            ),
        },
        {
          path: '403',
          loadChildren: () =>
            import('./components/no-permission/no-permission.module').then(
              (m) => m.NoPermissionModule
            ),
        },
        {
          path: '',
          loadChildren: () =>
            import(
              './components/common/common-layout/common-layout.module'
            ).then((m) => m.CommonLayoutModule),
          canActivate: [AuthGuard],
        },
        { path: '**', redirectTo: '404' },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
