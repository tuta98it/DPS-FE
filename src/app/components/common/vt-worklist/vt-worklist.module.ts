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
import { NgsContenteditableModule } from '@ng-stack/contenteditable';
import { TableModule } from 'primeng/table';
import { CaseStudyTableModule } from '../worklist/case-study-table/case-study-table.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';

import { SortEvent } from 'primeng/api';

@NgModule({
  declarations: [
    VTWorklistComponent,
    UploadKeyImageComponent
  ],
  imports: [
    AngularSplitModule,
    WorklistModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
    InputTextModule,
    BadgeModule,
    NgsContenteditableModule,
    CalendarModule,
    GalleriaModule,
    ConfirmDialogModule,
    DropdownModule,
    ContextMenuModule,
    DialogModule,
    InputNumberModule,
    OverlayPanelModule,
    ListboxModule,
    KeyImagesModule,
    ReportModule,
    CaseStudyTableModule,

  ],
  exports: [
    VTWorklistComponent
  ]
})
export class VTWorklistModule { }
