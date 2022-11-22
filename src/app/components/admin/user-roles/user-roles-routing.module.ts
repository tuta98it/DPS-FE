import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserRolesComponent } from './user-roles.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: UserRolesComponent }
	])],
	exports: [RouterModule]
})
export class UserRolesRoutingModule { }
