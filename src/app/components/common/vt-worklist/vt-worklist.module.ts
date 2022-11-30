import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VTWorklistComponent } from './vt-worklist.component';
import { AngularSplitModule } from 'angular-split';
import { WorklistModule } from '../worklist/worklist.module';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [
    VTWorklistComponent
  ],
  imports: [
    AngularSplitModule,
    WorklistModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    CommonModule,
  ],
  exports: [
    VTWorklistComponent
  ]
})
export class VTWorklistModule { }
