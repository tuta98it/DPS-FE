import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupsComponent } from './user-groups.component';
import { UserGroupsRoutingModule } from './user-groups-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { ItemService } from 'src/app/services/item.service';
import { InputTextModule } from 'primeng/inputtext';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { ListUsersInGroupComponent } from './list-users-in-group/list-users-in-group.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';

@NgModule({
  declarations: [
    UserGroupsComponent,
    ListUsersInGroupComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    ConfirmDialogModule,
    DialogModule,
    MTableModule,
    AutoCompleteModule,
    UserGroupsRoutingModule,
  ],
  providers: [
    ItemService
  ]
})
export class UserGroupsModule { }
