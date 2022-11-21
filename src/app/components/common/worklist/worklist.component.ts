import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { INIT_SEARCH_CASE_STUDY } from 'src/app/models/search-case-study';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { Constants } from 'src/app/shared/constants/constants';
import { CaseStudyTableComponent } from './case-study-table/case-study-table.component';

@Component({
  selector: 'app-worklist',
  templateUrl: './worklist.component.html',
  styleUrls: ['./worklist.component.scss']
})
export class WorklistComponent implements OnInit {
  INIT_SEARCH_CASE_STUDY = INIT_SEARCH_CASE_STUDY;
  LAYOUT = Constants.LAYOUT;
  searchData = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
  caseStudies: any = [];
  relatedCaseStudies: any = [];
  totalCaseStudies = 0;
  totalRelated = 0;
  tableHeight = 300;
  relatedTableHeight = 300;
  lastMaxStart = -1;
  loading = false;
  loadingRelated = false;
  isVisibleCaseStudyInfo = false;
  caseStudyInfoHeader = '';
  
  isVisibleSearchCaseStudy = false;
  isVisiblePatientInfo = false;

  REQUEST_TYPES = Constants.REQUEST_TYPES;
  REPORT_STATES = Constants.REPORT_STATES;
  
  requestTypes:any = {};
  reportStates:any = {};
  selectedPatientId = '';
  updatedCaseStudy: any = {};
  selectedCaseStudy: any = {};
  @Input() selectedLayout = Constants.LAYOUT.FULL;
  @ViewChild('caseStudyTable') caseStudyTable!: CaseStudyTableComponent;
  
  constructor(
    private caseStudyService: CaseStudyService
  ) {
    Constants.REQUEST_TYPES.forEach((r: any) => {
      this.requestTypes[r.value] = r.label;
    });
    Constants.REPORT_STATES.forEach((r: any) => {
      this.reportStates[r.value] = r.label;
    });
  }

  ngOnInit(): void {
    this.setTableHeight(33.33, 33.33);
    this.search();
  }

  search() {
    this.loading = true;
    this.caseStudyService.search(this.searchData).subscribe({
      next: (res) => {
        res.d.source.forEach((r: any) => {
          r.stateLabel = this.reportStates[r.state];
          r.requestTypeLabel = this.requestTypes[r.requestType];
        });
        this.caseStudies = [...this.caseStudies, ...res.d.source];
        this.totalRelated = res.d.itemCount;
      }
    }).add(() => {
      this.loading = false;
    });
  }

  getCaseStudyOfPatient() {
    this.loadingRelated = true;
    this.caseStudyService.getCaseStudyOfPatient(this.selectedCaseStudy.patientId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.relatedCaseStudies = res.jsonData;
          this.totalRelated = res.jsonData.length;
        }
      }
    }).add(() => {
      this.loadingRelated = false;
    });
  }

  onSearch(data: any) {
    this.searchData = JSON.parse(JSON.stringify(data));
    this.searchData.page = 0;
    this.caseStudyTable.resetScrollTop();
    this.caseStudyTable.selectedCaseStudy = {};
    this.selectedCaseStudy = {};
    this.relatedCaseStudies = [];
    this.caseStudies = [];
    this.lastMaxStart = -1;
  }

  onSelectCaseStudy(data: any) {
    this.selectedCaseStudy = data;
    this.getCaseStudyOfPatient();
  }

  onCreateCaseStudy() {
    this.caseStudyInfoHeader = 'Thêm ca khám';
    this.updatedCaseStudy = {};
    this.isVisibleCaseStudyInfo = true;
  }

  onEditCaseStudy(data: any) {
    this.caseStudyInfoHeader = 'Sửa thông tin ca khám';
    this.updatedCaseStudy = data;
    this.isVisibleCaseStudyInfo = true;
  }
  
  onEditPatient(event: any) {
    this.selectedPatientId = event.patientId;
    this.isVisiblePatientInfo = true;
  }

  onResizeEnd(event: any) {
    this.setTableHeight(event.sizes[0], event.sizes[1]);
  }

  setTableHeight(worklistSize: number, relatedListSize: number) {
    let fontSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    const headerHeight = 3.5;
    let contentHeight = window.innerHeight - headerHeight*fontSize;
    this.tableHeight = contentHeight*worklistSize/100 - 100;
    this.relatedTableHeight = contentHeight*relatedListSize/100 - 80;
  }

  onLazyLoad(event:any) {
    if (this.lastMaxStart < event.first && !this.loading) {
      this.lastMaxStart = event.first;
      this.searchData.page += 1;
      this.search();
    }
  }
}
