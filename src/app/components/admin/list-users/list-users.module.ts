import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users.component';
import { ListUsersRoutingModule } from './list-users-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { ListGroupInUsersComponent } from './list-group-in-users/list-group-in-users.component';


@NgModule({
  declarations: [
    ListUsersComponent,
    ListGroupInUsersComponent,

  ],
  imports: [
    InputSwitchModule,
    TableModule,
    MTableModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DialogModule,
    CommonModule,
    ListUsersRoutingModule,
    ConfirmDialogModule
  ]
})
export class ListUsersModule { }
