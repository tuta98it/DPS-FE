import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin.layout.component';

@NgModule({
	imports: [RouterModule.forChild([
		{
			path: '', 
			component: AdminLayoutComponent,
			children: [
				{ path: 'users', loadChildren: () => import('../list-users/list-users.module').then(m => m.ListUsersModule) },
				{ path: 'user-groups', loadChildren: () => import('../user-groups/user-groups.module').then(m => m.UserGroupsModule) },
				{ path: 'crud', loadChildren: () => import('../crud/crud.module').then(m => m.CrudModule) },
				{ path: '', redirectTo: 'user-groups', pathMatch: 'full' },
			]
		},
	])],
	exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
