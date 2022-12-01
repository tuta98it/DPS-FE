import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRolesComponent } from './user-roles.component';
import { UserRolesRoutingModule } from './user-roles-routing.module';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';


@NgModule({
  declarations: [
    UserRolesComponent,
    
  ],
  imports: [
    MTableModule,
    TableModule,
    InputTextModule,
    RippleModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    UserRolesRoutingModule
  ]
})
export class UserRolesModule { }
