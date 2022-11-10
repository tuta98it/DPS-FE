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

@NgModule({
  declarations: [
    ReportTemplatesComponent
  ],
  imports: [
    CommonModule,
    EditorModule,
    TreeModule,
    FormsModule,
    RippleModule,
    InputTextModule,
    ButtonModule,
    TreeSelectModule,
    ReportTemplatesRoutingModule,
  ]
})
export class ReportTemplatesModule { }
