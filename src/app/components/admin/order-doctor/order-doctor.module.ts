import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderDoctorRoutingModule } from './order-doctor-routing.module';
import { OrderDoctorComponent } from './order-doctor.component';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    OrderDoctorComponent
  ],
  imports: [
    CommonModule,
    OrderDoctorRoutingModule,
    RippleModule,
    DialogModule,
    MTableModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    InputTextModule,
  ]
})
export class OrderDoctorModule { }
