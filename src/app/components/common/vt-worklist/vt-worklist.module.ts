import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VTWorklistComponent } from './vt-worklist.component';
import { AngularSplitModule } from 'angular-split';
import { WorklistModule } from '../worklist/worklist.module';


@NgModule({
  declarations: [
    VTWorklistComponent
  ],
  imports: [
    AngularSplitModule,
    WorklistModule,
    CommonModule,
  ],
  exports: [
    VTWorklistComponent
  ]
})
export class VTWorklistModule { }
