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
    InputTextModule,
    CommonModule,
    MarkTypesRoutingModule
  ]
})
export class MarkTypesModule { }
