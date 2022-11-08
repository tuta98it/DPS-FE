import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserGroupsComponent } from './user-groups.component';
import { UserGroupsRoutingModule } from './user-groups-routing.module';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { ItemService } from 'src/app/services/item.service';
import { InputTextModule } from 'primeng/inputtext';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';

@NgModule({
  declarations: [
    UserGroupsComponent
  ],
  imports: [
    CommonModule,
    UserGroupsRoutingModule,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DialogModule,
    MTableModule
  ],
  providers: [
    ItemService
  ]
})
export class UserGroupsModule { }
