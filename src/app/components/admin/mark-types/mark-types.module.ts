import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkTypesComponent } from './mark-types.component';
import { MarkTypesRoutingModule } from './mark-types-routing.module';



@NgModule({
  declarations: [
    MarkTypesComponent
  ],
  imports: [
    CommonModule,
    MarkTypesRoutingModule
  ]
})
export class MarkTypesModule { }
