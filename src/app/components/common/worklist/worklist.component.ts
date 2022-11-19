import { Component, Input, OnInit } from '@angular/core';
import { INIT_SEARCH_CASE_STUDY } from 'src/app/models/search-case-study';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { Constants } from 'src/app/shared/constants/constants';

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
  totalCaseStudies = 0;
  tableHeight = 300;
  lastMaxStart = -1;
  loading = false;
  isVisibleCaseStudyInfo = false;
  caseStudyInfoHeader = '';
  
  isVisibleSearchCaseStudy = false;
  isVisiblePatientInfo = false;

  REQUEST_TYPES = Constants.REQUEST_TYPES;
  REPORT_STATES = Constants.REPORT_STATES;
  
  requestTypes:any = {};
  reportStates:any = {};
  selectedPatientId = '';
  @Input() selectedLayout = Constants.LAYOUT.FULL;
  
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
    this.setTableHeight(33.33);
    this.search();
  }

  search() {
    this.loading = true;
    this.caseStudyService.search(this.caseStudyService.url+ '/Search', this.searchData).subscribe({
      next: (res) => {
        res.d.source.forEach((r: any) => {
          r.stateLabel = this.reportStates[r.state];
          r.requestType = this.requestTypes[r.requestType];
        });
        this.caseStudies = [...this.caseStudies, ...res.d.source];
        this.totalCaseStudies = res.d.itemCount;
      }
    }).add(() => {
      this.loading = false;
    });
  }

  onSearch(data: any) {
    this.searchData = JSON.parse(JSON.stringify(data));
    this.searchData.page = 0;
    this.caseStudies = [];
    this.lastMaxStart = -1;
  }

  onCreateCaseStudy() {
    this.caseStudyInfoHeader = 'Thêm ca khám';
    this.isVisibleCaseStudyInfo = true;
  }

  onEditCaseStudy(event: any) {
    console.log('onEditCaseStudy', event);
  }
  
  onEditPatient(event: any) {
    console.log('onEditPatient', event);
    this.selectedPatientId = event.patientId;
    this.isVisiblePatientInfo = true;
  }

  onResizeEnd(event: any) {
    this.setTableHeight(event.sizes[0]);
  }

  setTableHeight(worklistSizes: number) {
    let fontSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    const headerHeight = 3.5;
    let contentHeight = window.innerHeight - headerHeight*fontSize;
    this.tableHeight = contentHeight*worklistSizes/100 - 100;
  }

  onLazyLoad(event:any) {
    if (this.lastMaxStart < event.first && !this.loading) {
      this.lastMaxStart = event.first;
      this.searchData.page += 1;
      this.search();
    }
  }
}
