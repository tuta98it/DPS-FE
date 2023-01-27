import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorklistComponent } from './worklist.component';
import { SplitterModule } from 'primeng/splitter';
import { TableModule } from 'primeng/table';
import { CaseStudyTableComponent } from './case-study-table/case-study-table.component';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CaseStudyInfoComponent } from './case-study-info/case-study-info.component';
import { PatientInfoComponent } from './patient-info/patient-info.component';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ContextMenuModule } from 'primeng/contextmenu';
import { SearchCaseStudyComponent } from './search-case-study/search-case-study.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { UploadSlideComponent } from './upload-slide/upload-slide.component';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { ReportModule } from '../report/report.module';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { AngularSplitModule } from 'angular-split';
import { SharedCaseStudyComponent } from './shared-case-study/shared-case-study.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { StudyTableSearchComponent } from './case-study-table/study-table-search/study-table-search.component';

@NgModule({
  declarations: [
    WorklistComponent,
    CaseStudyTableComponent,
    CaseStudyInfoComponent,
    PatientInfoComponent,
    SearchCaseStudyComponent,
    UploadSlideComponent,
    SharedCaseStudyComponent,
    StudyTableSearchComponent
  ],
  imports: [
    SplitterModule,
    ProgressBarModule,
    TableModule,
    SkeletonModule,
    DialogModule,
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DropdownModule,
    InputNumberModule,
    ContextMenuModule,
    CalendarModule,
    ReactiveFormsModule,
    FormsModule,
    RadioButtonModule,
    OverlayPanelModule,
    ReportModule,
    TooltipModule,
    ConfirmDialogModule,
    AngularSplitModule,
    FileUploadModule,
    HttpClientModule,
    CommonModule
  ],
  exports: [
    WorklistComponent,
    CaseStudyTableComponent,
    UploadSlideComponent,
    SearchCaseStudyComponent,
    SharedCaseStudyComponent
  ]
})
export class WorklistModule { }
