import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { UserGroupsRoutingModule } from './admin-dashboard-routing.module';



@NgModule({
  declarations: [
    AdminDashboardComponent
  ],
  imports: [
    CommonModule,
    UserGroupsRoutingModule
  ]
})
export class AdminDashboardModule { }
