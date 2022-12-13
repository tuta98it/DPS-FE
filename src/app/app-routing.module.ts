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
          path: '',
          loadChildren: () =>
            import(
              './components/common/common-layout/common-layout.module'
            ).then((m) => m.CommonLayoutModule),
          canActivate: [AuthGuard],
        },
        { path: '**', redirectTo: 'login' },
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
