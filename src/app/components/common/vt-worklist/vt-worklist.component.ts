import { Component, OnInit, ViewChild } from '@angular/core';
import { INIT_SEARCH_CASE_STUDY } from 'src/app/models/search-case-study';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { CaseStudyTableComponent } from '../worklist/case-study-table/case-study-table.component';

@Component({
  selector: 'vt-worklist',
  templateUrl: './vt-worklist.component.html',
  styleUrls: ['./vt-worklist.component.scss']
})
export class VTWorklistComponent implements OnInit {
  caseStudies: any = [];
  totalCaseStudies = 0;
  loading = false;
  tableHeight = 300;
  lastMaxStart = -1;
  searchData = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));

  REQUEST_TYPES = Constants.REQUEST_TYPES;
  REPORT_STATES = Constants.REPORT_STATES;
  requestTypes:any = {};
  reportStates:any = {};

  selectedCaseStudy: any = {};

  @ViewChild('caseStudyTable') caseStudyTable!: CaseStudyTableComponent;

  uploadSlideHeader = '';
  uploadedCaseStudyId = new String('');
  isVisibleUploadSlide = false;
  
  caseStudyInfoHeader = '';
  updatedCaseStudyId = new String('');
  isVisibleCaseStudyInfo = false;
  
  selectedPatientId = new String('');
  isVisiblePatientInfo = false;

  deletedCaseStudyId = '';
  textConfirmDeleteCase = '';
  isVisibleDeleteCase = false;


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
  }

  ngOnInit(): void {
    this.setTableHeight(30);
  }

  search() {
    // AnhHT: maybe better if search in CaseStudyTableComponent
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

  onSelectCaseStudy(data: any) {
    this.selectedCaseStudy = data;
  }

  onSearch(data: any) {
    this.searchData = JSON.parse(JSON.stringify(data));
    this.searchData.page = 1;
    this.caseStudyTable.selectedCaseStudy = {};
    this.selectedCaseStudy = {};
    this.caseStudies = [];
    this.caseStudyTable.resetScrollTop();
    this.lastMaxStart = -1;
    this.search();
  }

  dragEnd(event: any) {
    console.log('onResizeEnd', event);
    this.setTableHeight(event.sizes[1]);
  }

  setTableHeight(worklistSize: number) {
    let fontSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    const headerHeight = 3.5;
    let contentHeight = window.innerHeight - headerHeight*fontSize;
    this.tableHeight = contentHeight*worklistSize/100 - 20;
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

  onLazyLoad(event:any) {
    if (this.lastMaxStart < event.first && !this.loading) {
      this.lastMaxStart = event.first;
      this.searchData.page += 1;
      this.search();
    }
  }
}
