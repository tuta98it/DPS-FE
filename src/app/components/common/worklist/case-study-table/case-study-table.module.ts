import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseStudyTableComponent } from './case-study-table.component';
import { StudyTableSearchComponent } from './study-table-search/study-table-search.component';
import { TableModule } from 'primeng/table';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';



@NgModule({
  declarations: [
    CaseStudyTableComponent,
    StudyTableSearchComponent,
  ],
  imports: [
    CommonModule,
    TableModule,
    ContextMenuModule,
    FormsModule,
    DropdownModule,
    OverlayPanelModule,
    CalendarModule,
    InputTextModule
  ],
  exports: [
    CaseStudyTableComponent,
  ]
})
export class CaseStudyTableModule { }
