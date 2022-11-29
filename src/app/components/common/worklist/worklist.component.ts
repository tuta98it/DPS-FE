import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { INIT_SEARCH_CASE_STUDY } from 'src/app/models/search-case-study';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { CaseStudyTableComponent } from './case-study-table/case-study-table.component';

@Component({
  selector: 'app-worklist',
  templateUrl: './worklist.component.html',
  styleUrls: ['./worklist.component.scss']
})
export class WorklistComponent implements OnInit, AfterViewInit {
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
  uploadSlideHeader = '';
  
  isVisibleSearchCaseStudy = false;
  isVisiblePatientInfo = false;
  isVisibleUploadSlide = false;
  isVisibleDeleteCase = false;
  textConfirmDeleteCase = '';
  deletedCaseStudyId = '';

  REQUEST_TYPES = Constants.REQUEST_TYPES;
  REPORT_STATES = Constants.REPORT_STATES;
  
  requestTypes:any = {};
  reportStates:any = {};
  selectedPatientId = new String('');
  updatedCaseStudyId = new String('');
  uploadedCaseStudyId = new String('');
  selectedCaseStudy: any = {};
  @Input() selectedLayout = Constants.LAYOUT.FULL;
  @ViewChild('caseStudyTable') caseStudyTable!: CaseStudyTableComponent;
  isShowRelated = true;
  panelSizes = [100/3, 100/3, 100/3];
  reportPanelHeight = 0;
  isSmallScreen = true;
  constructor(
    private caseStudyService: CaseStudyService,
    private notification: NotificationService,
  ) {
    Constants.REQUEST_TYPES.forEach((r: any) => {
      this.requestTypes[r.value] = r.label;
    });
    Constants.REPORT_STATES.forEach((r: any) => {
      this.reportStates[r.value] = r.label;
    });
    this.isSmallScreen = window.innerWidth < 1600;
  }

  ngOnInit(): void {
    this.setTableHeight(33.33, 33.33);
    this.search();
  }
  ngAfterViewInit() {
    this.toggleRelated();
    this.toggleRelated();
    // setTimeout(() => this.toggleRelated(), 500);
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
        this.totalCaseStudies = res.d.itemCount;
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
    this.searchData.page = 1;
    this.caseStudyTable.selectedCaseStudy = {};
    this.selectedCaseStudy = {};
    this.relatedCaseStudies = [];
    this.caseStudies = [];
    this.caseStudyTable.resetScrollTop();
    this.lastMaxStart = -1;
    this.search();
  }

  onSelectCaseStudy(data: any) {
    this.selectedCaseStudy = data;
    this.getCaseStudyOfPatient();
  }

  onCaseStudyAction(event: any) {
    if (event.action == Constants.CASE_STUDY_ACTIONS.REFRESH) {
      this.onSearch(this.searchData);
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.EDIT) {
      this.onEditCaseStudy(event.data);
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.UPLOAD_SLIDE) {
      this.onUploadSlide(event.data);
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.EDIT_PATIENT) {
      this.onEditPatient(event.data);
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.SHARE) {
      this.onShareCaseStudy(event.data);
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.DELETE) {
      this.onDeleteCaseStudy(event.data);
    }
  }

  onUploadSlide(data: any) {
    this.uploadSlideHeader = `Thêm lam kính - Bệnh nhân ${data.patientsName}`;
    this.uploadedCaseStudyId = new String(data.caseStudyId);
    this.isVisibleUploadSlide = true;
  }

  onCreateCaseStudy() {
    this.caseStudyInfoHeader = 'Thêm ca khám';
    this.updatedCaseStudyId = '';
    this.selectedPatientId = '';
    this.isVisibleCaseStudyInfo = true;
  }

  onEditCaseStudy(data: any) {
    this.caseStudyInfoHeader = 'Sửa thông tin ca khám';
    this.updatedCaseStudyId = new String(data.caseStudyId);
    this.selectedPatientId = data.patientId;
    this.isVisibleCaseStudyInfo = true;
  }
  
  onEditPatient(event: any) {
    this.selectedPatientId = new String(event.patientId);
    this.isVisiblePatientInfo = true;
  }

  onDeleteCaseStudy(data: any) {
    this.deletedCaseStudyId = data.caseStudyId;
    this.textConfirmDeleteCase = `Xác nhận xóa ca khám của bệnh nhân <b>${data.patientsName}</b>?`;
    this.isVisibleDeleteCase = true;
  }

  deleteCaseStudy() {
    this.caseStudyService.deleteById(this.deletedCaseStudyId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Xóa ca khám thành công');
          this.onSearch(this.searchData);
        }
      }
    }).add(() => {
      this.isVisibleDeleteCase = false;
    });
  }

  onShareCaseStudy(data: any) {
    this.notification.warn('Chức năng đang phát triển');
  }

  onResizeEnd(event: any) {
    this.setTableHeight(event.sizes[0], event.sizes[1]);
    this.panelSizes = event.sizes;
  }

  setTableHeight(worklistSize: number, relatedListSize: number) {
    let fontSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    const headerHeight = 3.5;
    let contentHeight = window.innerHeight - headerHeight*fontSize;
    this.tableHeight = contentHeight*worklistSize/100 - 80;
    this.relatedTableHeight = contentHeight*relatedListSize/100 - 60;
    this.reportPanelHeight = contentHeight*(100-worklistSize-relatedListSize)/100 - 50;
  }

  onLazyLoad(event:any) {
    if (this.lastMaxStart < event.first && !this.loading) {
      this.lastMaxStart = event.first;
      this.searchData.page += 1;
      this.search();
    }
  }

  toggleRelated() {
    this.isShowRelated = !this.isShowRelated;
    if (this.isShowRelated) {
      this.panelSizes = [this.panelSizes[0], 20, 80-this.panelSizes[0]];
      this.setTableHeight(this.panelSizes[0], 20);
    } else {
      this.panelSizes = [this.panelSizes[0], 5, 95-this.panelSizes[0]];
      this.setTableHeight(this.panelSizes[0], 5);
    }
  }
}
