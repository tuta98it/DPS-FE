import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupRolesComponent } from './group-roles.component';
import { GroupRolesRoutingModule } from './group-roles-routing.module';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    GroupRolesComponent
  ],
  imports: [
    TableModule,
    InputTextModule,
    RippleModule,
    ButtonModule,
    FormsModule,
    CommonModule,
    GroupRolesRoutingModule
  ]
})
export class GroupRolesModule { }
