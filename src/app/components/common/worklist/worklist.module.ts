import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorklistComponent } from './worklist.component';



@NgModule({
  declarations: [
    WorklistComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WorklistComponent
  ]
})
export class WorklistModule { }
