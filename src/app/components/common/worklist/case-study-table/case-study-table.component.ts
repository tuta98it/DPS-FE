import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { INIT_SEARCH_CASE_STUDY, SearchCaseStudy } from 'src/app/models/search-case-study';
import { IViewerTab } from 'src/app/models/viewer-tab';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { Constants } from 'src/app/shared/constants/constants';
@Component({
  selector: 'case-study-table',
  templateUrl: './case-study-table.component.html',
  styleUrls: ['./case-study-table.component.scss']
})
export class CaseStudyTableComponent implements OnInit {
  @Input() caseStudies: any[] = [];
  @Input() tableHeight = 300;
  @Input() rows = 0;
  @Input() loading = false;
  @Input() isRelatedList = false;
  @Output() onLazyLoad = new EventEmitter<any>();

  @Output() onAction = new EventEmitter<any>();

  @Output() onSelectCaseStudy = new EventEmitter<any>();
  actions!: MenuItem[];
  selectedCaseStudy: any = {};
  cols: any[];
  @ViewChild('caseStudyTable') caseStudyTable!: Table;
  clickTimer: any;

  layoutConfig = '';
  REPORT_STATES = Constants.REPORT_STATES;
  REQUEST_TYPES = Constants.REQUEST_TYPES;
  LAYOUT_CONFIG = Constants.LAYOUT_CONFIG;
  
  searchData: any = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
  @Output() onSearch = new EventEmitter<any>();

  constructor(
    private viewerState: ViewerStateService,
    public configService: AppConfigService,
  ) {
    this.cols = [
      // { field: 'idx', header: 'STT', width: '5rem' },
      // { field: 'state', header: 'Trạng thái', width: '8rem' },
      { field: 'createdTime', header: 'Ngày lấy mẫu', width: '12rem' },
      { field: 'patientsName', header: 'Tên bệnh nhân', width: '12rem' },
      { field: 'patientCode', header: 'Mã bệnh nhân', width: '10rem' },
      { field: 'specimensCode', header: 'Mã bệnh phẩm', width: '10rem' },
      { field: 'requestTypeLabel', header: 'Loại yêu cầu', width: '10rem' },
      { field: 'slideCount', header: 'Số lam kính', width: '8rem' },
      { field: 'bodyPart', header: 'Vị trí lấy', width: '10rem' },
      { field: 'sourceHospital', header: 'Nơi gửi', width: '15rem' },
      { field: 'clinicalDiagnosis', header: 'Chẩn đoán', width: '15rem' },
      { field: 'conclusion', header: 'Kết luận', width: '19rem' }
    ];
    this.layoutConfig = this.configService.getConfig().layout;
  }

  ngOnInit() {
    this.actions = [
      { label: 'Mở SlideViewer', icon: 'pi pi-fw pi-external-link', command: () => this.openViewer(this.selectedCaseStudy) },
      { 
        label: 'Cập nhật worklist', icon: 'pi pi-fw pi-sync', 
        command: () => this.onAction.emit(
          { action: Constants.CASE_STUDY_ACTIONS.REFRESH }
        ),
        visible: !this.isRelatedList 
      },
      { 
        label: 'Sửa chi tiết ca khám', icon: 'pi pi-fw pi-file-edit', 
        command: () => this.onAction.emit(
          { action: Constants.CASE_STUDY_ACTIONS.EDIT, data: this.selectedCaseStudy }
        ),
        visible: this.layoutConfig == Constants.LAYOUT_CONFIG.DEFAULT
      },
      { label: 'Tải lên lam kính', icon: 'pi pi-fw pi-upload', 
        command: () => this.onAction.emit(
          { action: Constants.CASE_STUDY_ACTIONS.UPLOAD_SLIDE, data: this.selectedCaseStudy }
        ) },
      { 
        label: 'Sửa thông tin bệnh nhân', icon: 'pi pi-fw pi-user-edit', 
        command: () => this.onAction.emit(
          { action: Constants.CASE_STUDY_ACTIONS.EDIT_PATIENT, data: this.selectedCaseStudy }
        ),
        visible: this.layoutConfig == Constants.LAYOUT_CONFIG.DEFAULT
      },
      { label: 'Share ca khám', icon: 'pi pi-fw pi-share-alt', 
        command: () => this.onAction.emit(
          { action: Constants.CASE_STUDY_ACTIONS.SHARE, data: this.selectedCaseStudy }
        ) },
      { label: 'Xóa ca khám', icon: 'pi pi-fw pi-trash', 
        command: () => this.onAction.emit(
          { action: Constants.CASE_STUDY_ACTIONS.DELETE, data: this.selectedCaseStudy }
        ) },
    ];
  }

  onRowSelect(event: any, data: any) {
    if (event.detail == 1) {
      this.clickTimer = setTimeout(() => {
        this.selectedCaseStudy = data;
        this.onSelectCaseStudy.emit(data);
      }, 300)
    }
  }

  resetScrollTop() {
    this.caseStudyTable.resetScrollTop();
  }

  openViewer(caseStudy: any) {
    // this.selectedCaseStudy = caseStudy;
    // this.onSelectCaseStudy.emit(caseStudy);
    clearTimeout(this.clickTimer);

    let newTab: IViewerTab = {
      caseStudyId: caseStudy.caseStudyId,
      patientsName: caseStudy.patientsName,
      createdTime: caseStudy.createdTime
    }
    this.viewerState.openTab(newTab);
  }
}
