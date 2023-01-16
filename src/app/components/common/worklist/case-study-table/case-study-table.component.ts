import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import { INIT_SEARCH_CASE_STUDY, SearchCaseStudy } from 'src/app/models/search-case-study';
import { IViewerTab } from 'src/app/models/viewer-tab';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
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
  cols!: any[];
  @ViewChild('caseStudyTable') caseStudyTable!: Table;
  clickTimer: any;

  layoutConfig = '';
  REPORT_STATES = Constants.REPORT_STATES;
  REQUEST_TYPES = Constants.REQUEST_TYPES;
  LAYOUT_CONFIG = Constants.LAYOUT_CONFIG;
  FILTER_STATES_1 = Constants.FILTER_STATES_1;
  FILTER_STATES_2 = Constants.FILTER_STATES_2;
  FILTER_STATES_3 = Constants.FILTER_STATES_3;
  FILTER_STATES_4 = Constants.FILTER_STATES_4;
  
  @Input() searchData: SearchCaseStudy = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
  @Output() onSearch = new EventEmitter<any>();

  isSearchTable = false;
  isShowSearch = false;

  @ViewChild("sltDateRange") sltDateRange!: OverlayPanel;

  constructor(
    private viewerState: ViewerStateService,
    private notification: NotificationService,
    public configService: AppConfigService,
  ) {
    this.layoutConfig = this.configService.getConfig().layout;
    if (this.layoutConfig==Constants.LAYOUT_CONFIG.DEFAULT) {
      this.cols = [
        { field: 'createdDate', header: 'Ngày tạo', width: '12rem' },
        { field: 'patientsName', header: 'Tên bệnh nhân', width: '12rem' },
        { field: 'patientCode', header: 'Mã bệnh nhân', width: '10rem' },
        { field: 'createdTime', header: 'Ngày lấy mẫu', width: '10rem' },
        { field: 'specimensCode', header: 'Mã bệnh phẩm', width: '10rem' },
        { field: 'requestTypeLabel', header: 'Loại yêu cầu', width: '10rem' },
        { field: 'slideCount', header: 'Số lam kính', width: '8rem' },
        { field: 'bodyPart', header: 'Vị trí lấy', width: '10rem' },
        { field: 'sourceHospital', header: 'Nơi gửi', width: '15rem' },
        { field: 'clinicalDiagnosis', header: 'Chẩn đoán', width: '15rem' },
        { field: 'conclusion', header: 'Kết luận', width: '18.5rem' }
      ];
    } else if (this.layoutConfig==Constants.LAYOUT_CONFIG.VT) {
      this.cols = [
        { field: 'createdDate', header: 'Ngày tạo', width: '12rem' },
        { field: 'patientsName', header: 'Tên bệnh nhân', width: '12rem' },
        { field: 'patientCode', header: 'Mã bệnh nhân', width: '10rem' },
        { field: 'hasSlide', header: 'Đã chụp', width: '10rem' },
        { field: 'hasConclusion', header: 'Đã đọc', width: '10rem' },
        { field: 'isApprove', header: 'Đã duyệt', width: '10rem' },
        { field: 'isPrint', header: 'Đã in', width: '10rem' },
        { field: 'createdTime', header: 'Ngày lấy mẫu', width: '10rem' },
        { field: 'specimensCode', header: 'Mã bệnh phẩm', width: '10rem' },
        { field: 'requestTypeLabel', header: 'Loại yêu cầu', width: '10rem' },
        { field: 'slideCount', header: 'Số lam kính', width: '8rem' },
        { field: 'bodyPart', header: 'Vị trí lấy', width: '10rem' },
        { field: 'sourceHospital', header: 'Nơi gửi', width: '15rem' },
        { field: 'clinicalDiagnosis', header: 'Chẩn đoán', width: '15rem' },
        { field: 'conclusion', header: 'Kết luận', width: '18.5rem' }
      ];
    }
  }

  ngOnInit() {
    this.isSearchTable = !this.isRelatedList && this.layoutConfig==Constants.LAYOUT_CONFIG.VT;
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
    if (caseStudy.slideCount) {
      // this.selectedCaseStudy = caseStudy;
      // this.onSelectCaseStudy.emit(caseStudy);
      clearTimeout(this.clickTimer);
  
      let newTab: IViewerTab = {
        caseStudyId: caseStudy.caseStudyId,
        patientsName: caseStudy.patientsName,
        createdTime: caseStudy.createdTime
      }
      this.viewerState.openTab(newTab);
    } else {
      this.notification.warn('Chưa có lam kính cho ca khám này')
    }
  }
}
