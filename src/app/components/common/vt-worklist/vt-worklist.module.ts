import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VTWorklistComponent } from './vt-worklist.component';
import { AngularSplitModule } from 'angular-split';
import { WorklistModule } from '../worklist/worklist.module';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { GalleriaModule } from 'primeng/galleria';
import { DialogModule } from 'primeng/dialog';
import { KeyImagesModule } from '../key-images/key-images.module';


@NgModule({
  declarations: [
    VTWorklistComponent
  ],
  imports: [
    AngularSplitModule,
    WorklistModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    GalleriaModule,
    DropdownModule,
    DialogModule,
    InputNumberModule,
    KeyImagesModule,
    CommonModule,
  ],
  exports: [
    VTWorklistComponent
  ]
})
export class VTWorklistModule { }
