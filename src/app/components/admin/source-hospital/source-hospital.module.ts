import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceHospitalComponent } from './source-hospital.component';
import { SourceHospitalRoutingModule } from './source-hospital-routing.module';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';


@NgModule({
  declarations: [
    SourceHospitalComponent
  ],
  imports: [
    CommonModule,
    DialogModule,
    MTableModule,
    RippleModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    SourceHospitalRoutingModule
  ]
})
export class SourceHospitalModule { }
