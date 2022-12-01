import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListUsersComponent } from './list-users.component';
import { ListUsersRoutingModule } from './list-users-routing.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';


@NgModule({
  declarations: [
    ListUsersComponent,
  ],
  imports: [
    InputSwitchModule,
    TableModule,
    MTableModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DialogModule,
    CommonModule,
    ListUsersRoutingModule
  ]
})
export class ListUsersModule { }
