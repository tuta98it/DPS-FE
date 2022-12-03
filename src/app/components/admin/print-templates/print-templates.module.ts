import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintTemplatesComponent } from './print-templates.component';
import { PrintTemplatesRoutingModule } from './print-templates-routing.module';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { PrintTemplateDetailComponent } from './print-template-detail/print-template-detail.component';

@NgModule({
  declarations: [
    PrintTemplatesComponent,
    PrintTemplateDetailComponent
  ],
  imports: [
    CommonModule,
    RippleModule,
    ButtonModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    FormsModule,
    MTableModule,
    DialogModule,
    PrintTemplatesRoutingModule
  ]
})
export class PrintTemplatesModule { }
