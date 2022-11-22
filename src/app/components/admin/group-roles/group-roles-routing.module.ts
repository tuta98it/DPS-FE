import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GroupRolesComponent } from './group-roles.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: GroupRolesComponent }
	])],
	exports: [RouterModule]
})
export class GroupRolesRoutingModule { }
