import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDoctorComponent } from './order-doctor.component';


@NgModule({
  imports: [RouterModule.forChild([
    {path: '', component: OrderDoctorComponent }
  ])],
  exports: [RouterModule]
})
export class OrderDoctorRoutingModule { }
