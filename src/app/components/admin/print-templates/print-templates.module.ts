import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintTemplatesComponent } from './print-templates.component';
import { PrintTemplatesRoutingModule } from './print-templates-routing.module';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PrintTemplatesComponent
  ],
  imports: [
    CommonModule,
    RippleModule,
    ButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MTableModule,
    DialogModule,
    PrintTemplatesRoutingModule
  ]
})
export class PrintTemplatesModule { }
