import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', loadChildren: () => import('./list-users/list-users.module').then(m => m.ListUsersModule) },
        { path: 'user-groups', loadChildren: () => import('./user-groups/user-groups.module').then(m => m.UserGroupsModule) },
    ])],
    exports: [RouterModule]
})
export class UsersRoutingModule { }
