import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { INIT_SEARCH_CASE_STUDY, SearchCaseStudy } from 'src/app/models/search-case-study';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { PrintTemplateService } from 'src/app/services/print-template.service';
import { Constants } from 'src/app/shared/constants/constants';
import { CaseStudyTableComponent } from '../../worklist/case-study-table/case-study-table.component';

@Component({
  selector: 'export-multiple-reports',
  templateUrl: './export-multiple-reports.component.html',
  styleUrls: ['./export-multiple-reports.component.scss']
})
export class ExportMultipleReportsComponent implements OnInit {
  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    if (value) {
      this.isShowSearch = true;
      this.getAllTemplates();
    } else {
      this.searchData = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
      this.caseStudies = [];
    }
    this.visibleChange.emit(value);
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();

  totalCaseStudies = 0;
  loading = false;
  lastMaxStart = -1;

  _searchData = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
  set searchData(value: SearchCaseStudy) {
    this._searchData = value;
    this.searchData.from = this.searchData.from ? new Date(this.searchData.from) : '';
    this.searchData.to = this.searchData.to ? new Date(this.searchData.to) : '';
  }
  get searchData(): SearchCaseStudy {
    return this._searchData;
  }
  isShowSearch = true;
  caseStudies: any = [];

  isSmallScreen = true;
  minusHeight = 185; //px
  tableHeight = 600; 

  requestTypes:any = {};
  reportStates:any = {};

  listPrintTemplates: any[] = [];
  selectedTemplateId: any;

  @ViewChild('caseStudyTable') caseStudyTable!: CaseStudyTableComponent;

  constructor(
    private caseStudyService: CaseStudyService,
    private printTemplateService: PrintTemplateService,
  ) { 
    this.isSmallScreen = window.innerWidth < 1600;
    if(this.isSmallScreen) {
      this.minusHeight = 160;
    }
    this.setTableHeight();
    Constants.REQUEST_TYPES.forEach((r: any) => {
      this.requestTypes[r.value] = r.label;
    });
    Constants.REPORT_STATES.forEach((r: any) => {
      this.reportStates[r.value] = r.label;
    });
  }

  ngOnInit(): void {
  }
  
  search() {
    this.loading = true;
    let datePipe = new DatePipe('en-US');
    this.caseStudyService.search({ ...this.searchData }).subscribe({
      next: (res) => {
        res.jsonData.data.forEach((r: any) => {
          r.stateLabel = this.reportStates[r.state];
          r.requestTypeLabel = this.requestTypes[r.requestType];
          let htmlChecked = '<i class="pi pi-check text-xl text-green-500 font-bold"></i>'
          r.hasSlide = r.slideCount > 0 ? htmlChecked : '';
          r.hasConclusion = (r.conclusion != null && r.conclusion != "") ? htmlChecked : '';
          r.isApprove = r.state == Constants.REPORT_STATES[4].value ? htmlChecked : '';
          r.isPrint = r.isPrint ? htmlChecked : '';
          r.createdDate = r.createdDate ? datePipe.transform(r.createdDate, 'HH:mm dd/MM/yyyy') : '';
        });
        this.caseStudies = [...this.caseStudies, ...res.jsonData.data];
        this.totalCaseStudies = res.jsonData.total;
      }
    }).add(() => {
      this.loading = false;
    });
  }

  onSearch(data: any) {
    this.searchData = JSON.parse(JSON.stringify(data));
    this.searchData.page = 1;
    this.caseStudyTable.selectedCaseStudy = {};
    this.caseStudies = [];
    this.caseStudyTable.resetScrollTop();
    this.lastMaxStart = -1;
    this.search();
  }

  getAllTemplates() {
    this.printTemplateService.searchForms('', 1, 50).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.listPrintTemplates = res.jsonData.data;
          if(this.listPrintTemplates.length > 0) {
            this.selectedTemplateId = this.listPrintTemplates[0].id;
          }
        }
      }
    });
  }

  onLazyLoad(event:any) {
    if (this.lastMaxStart < event.first && !this.loading) {
      this.lastMaxStart = event.first;
      this.searchData.page += 1;
      this.search();
    }
  }

  setTableHeight() {
    let dialogHeight = window.innerHeight*0.9;
    this.tableHeight = dialogHeight - this.minusHeight;
  }
}
