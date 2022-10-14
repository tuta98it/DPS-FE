import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupsComponent } from './user-groups.component';
import { UserGroupsRoutingModule } from './user-groups-routing.module';



@NgModule({
  declarations: [
    UserGroupsComponent
  ],
  imports: [
    CommonModule,
    UserGroupsRoutingModule
  ]
})
export class UserGroupsModule { }
