import { EditorModule } from 'primeng/editor';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportTemplatesComponent } from './report-templates.component';
import { ReportTemplatesRoutingModule } from './report-templates-routing.module';
import {TreeModule} from 'primeng/tree';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { ImportTemplatesComponent } from './import-templates/import-templates.component';
import { FileUploadModule } from 'primeng/fileupload';

@NgModule({
  declarations: [
    ReportTemplatesComponent,
    ImportTemplatesComponent
  ],
  imports: [
    CommonModule,
    EditorModule,
    TreeModule,
    ConfirmDialogModule,
    FormsModule,
    DialogModule,
    RippleModule,
    InputTextModule,
    ButtonModule,
    TreeSelectModule,
    ReportTemplatesRoutingModule,
    FileUploadModule
  ]
})
export class ReportTemplatesModule { }
