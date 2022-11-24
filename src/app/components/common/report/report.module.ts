import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPanelComponent } from './report-panel/report-panel.component';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { ReportEditorComponent } from './report-editor/report-editor.component';
import { ReportActionsComponent } from './report-actions/report-actions.component';



@NgModule({
  declarations: [
    ReportPanelComponent,
    ReportDialogComponent,
    ReportEditorComponent,
    ReportActionsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ReportPanelComponent,
    ReportDialogComponent,
    ReportEditorComponent,
    ReportActionsComponent
  ],
})
export class ReportModule { }
