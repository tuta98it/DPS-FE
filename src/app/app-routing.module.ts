import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AppLayoutComponent } from './components/layout/app.layout.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: 'crud', loadChildren: () => import('./components/crud/crud.module').then(m => m.CrudModule) },
                    { path: 'users', loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule) },
                ],
            },
            { path: 'login', loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule) },
            // { path: 'pages/notfound', component: NotfoundComponent },
            // { path: '**', redirectTo: 'pages/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
