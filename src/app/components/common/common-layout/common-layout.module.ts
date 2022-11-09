import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonLayoutComponent } from './common-layout/common-layout.component';
import { RouterModule } from '@angular/router';
import { CommonLayoutRoutingModule } from './common-layout-routing.module';



@NgModule({
  declarations: [
    CommonLayoutComponent
  ],
  imports: [
    CommonModule,
    CommonLayoutRoutingModule,
    RouterModule
  ]
})
export class CommonLayoutModule { }
