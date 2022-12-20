import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgsContenteditableModule } from '@ng-stack/contenteditable';
import { ListboxModule } from 'primeng/listbox';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { ReportPanelComponent } from './report-panel/report-panel.component';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { ReportEditorComponent } from './report-editor/report-editor.component';
import { ReportActionsComponent } from './report-actions/report-actions.component';
import { PrintPreviewPopupComponent } from './print-preview-popup/print-preview-popup.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    ReportPanelComponent,
    ReportDialogComponent,
    ReportEditorComponent,
    ReportActionsComponent,
    PrintPreviewPopupComponent
  ],
  imports: [
    CommonModule,
    NgsContenteditableModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ListboxModule,
    ButtonModule,
    DropdownModule
  ],
  exports: [
    ReportPanelComponent,
    ReportDialogComponent,
    ReportEditorComponent,
    ReportActionsComponent,
    PrintPreviewPopupComponent
  ],
})
export class ReportModule { }
