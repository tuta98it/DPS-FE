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
import { TabViewModule } from 'primeng/tabview';
import { KeyImagesModule } from '../key-images/key-images.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { SaveCustomReportComponent } from './save-custom-report/save-custom-report.component';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    ReportPanelComponent,
    ReportDialogComponent,
    ReportEditorComponent,
    ReportActionsComponent,
    PrintPreviewPopupComponent,
    SaveCustomReportComponent
  ],
  imports: [
    CommonModule,
    NgsContenteditableModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    ListboxModule,
    InputTextModule,
    TabViewModule,
    TreeSelectModule,
    ButtonModule,
    KeyImagesModule,
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
