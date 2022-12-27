import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SourceHospitalComponent } from './source-hospital.component';

//const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: SourceHospitalComponent }
])],
  exports: [RouterModule]
})
export class SourceHospitalRoutingModule { }
