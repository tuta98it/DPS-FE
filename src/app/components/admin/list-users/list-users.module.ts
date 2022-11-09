import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users.component';
import { ListUsersRoutingModule } from './list-users-routing.module';



@NgModule({
  declarations: [
    ListUsersComponent,
  ],
  imports: [
    CommonModule,
    ListUsersRoutingModule
  ]
})
export class ListUsersModule { }
