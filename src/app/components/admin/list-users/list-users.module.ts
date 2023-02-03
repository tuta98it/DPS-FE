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
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { ListGroupOfUsersComponent } from './list-group-of-users/list-group-of-users.component';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
  declarations: [
    ListUsersComponent,
    ListGroupOfUsersComponent,

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
    AutoCompleteModule,
    ConfirmDialogModule
  ]
})
export class ListUsersModule { }
