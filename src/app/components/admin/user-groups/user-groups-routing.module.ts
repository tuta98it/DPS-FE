import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserGroupsComponent } from './user-groups.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: UserGroupsComponent }
	])],
	exports: [RouterModule]
})
export class UserGroupsRoutingModule { }
