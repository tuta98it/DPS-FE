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
import {ContextMenuModule} from 'primeng/contextmenu';
import { SearchCaseStudyComponent } from './search-case-study/search-case-study.component';

@NgModule({
  declarations: [
    WorklistComponent,
    CaseStudyTableComponent,
    CaseStudyInfoComponent,
    PatientInfoComponent,
    SearchCaseStudyComponent
  ],
  imports: [
    SplitterModule,
    TableModule,
    SkeletonModule,
    DialogModule,
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DropdownModule,
    ContextMenuModule,
    CalendarModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule,
    CommonModule
  ],
  exports: [
    WorklistComponent
  ]
})
export class WorklistModule { }
