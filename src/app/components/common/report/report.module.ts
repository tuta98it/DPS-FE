import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportPanelComponent } from './report-panel/report-panel.component';
import { ReportDialogComponent } from './report-dialog/report-dialog.component';
import { ReportEditorComponent } from './report-editor/report-editor.component';
import { ReportActionsComponent } from './report-actions/report-actions.component';
import { NgsContenteditableModule } from '@ng-stack/contenteditable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ReportPanelComponent,
    ReportDialogComponent,
    ReportEditorComponent,
    ReportActionsComponent
  ],
  imports: [
    CommonModule,
    NgsContenteditableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ReportPanelComponent,
    ReportDialogComponent,
    ReportEditorComponent,
    ReportActionsComponent
  ],
})
export class ReportModule { }
