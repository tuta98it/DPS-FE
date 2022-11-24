import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkTypesComponent } from './mark-types.component';
import { MarkTypesRoutingModule } from './mark-types-routing.module';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';



@NgModule({
  declarations: [
    MarkTypesComponent
  ],
  imports: [
    RippleModule,
    DialogModule,
    MTableModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    InputTextModule,
    CommonModule,
    MarkTypesRoutingModule
  ]
})
export class MarkTypesModule { }
