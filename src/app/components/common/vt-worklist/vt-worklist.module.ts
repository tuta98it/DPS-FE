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
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { ReportModule } from '../report/report.module';
import { UploadKeyImageComponent } from './upload-key-image/upload-key-image.component';
import { ContextMenuModule } from 'primeng/contextmenu';
import { BadgeModule } from 'primeng/badge';

@NgModule({
  declarations: [
    VTWorklistComponent,
    UploadKeyImageComponent
  ],
  imports: [
    AngularSplitModule,
    WorklistModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    BadgeModule,
    CalendarModule,
    GalleriaModule,
    ConfirmDialogModule,
    DropdownModule,
    ContextMenuModule,
    DialogModule,
    InputNumberModule,
    KeyImagesModule,
    ReportModule,
    CommonModule,
  ],
  exports: [
    VTWorklistComponent
  ]
})
export class VTWorklistModule { }
