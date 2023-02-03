import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BodyPartsComponent } from './body-parts.component';
import { BodyPartsRoutingModule } from './body-parts-routing.module';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { MTableModule } from 'src/app/shared/components/m-table/m-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';



@NgModule({
  declarations: [
    BodyPartsComponent
  ],
  imports: [
    InputSwitchModule,
    RippleModule,
    DialogModule,
    TableModule,
    MTableModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    BodyPartsRoutingModule
  ]
})
export class BodyPartsModule { }
