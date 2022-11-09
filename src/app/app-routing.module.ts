import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

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
