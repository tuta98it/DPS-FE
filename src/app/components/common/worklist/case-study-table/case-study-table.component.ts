import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { IViewerTab } from 'src/app/models/viewer-tab';
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
  constructor(
    private viewerState: ViewerStateService,
  ) {
    this.cols = [
      // { field: 'idx', header: 'STT', width: '5rem' },
      // { field: 'state', header: 'Trạng thái', width: '8rem' },
      { field: 'patientsName', header: 'Tên bệnh nhân', width: '12rem' },
      { field: 'patientCode', header: 'Mã bệnh nhân', width: '10rem' },
      { field: 'specimensCode', header: 'Mã bệnh phẩm', width: '10rem' },
      { field: 'createdTime', header: 'Ngày lấy mẫu', width: '10rem' },
      { field: 'requestTypeLabel', header: 'Loại yêu cầu', width: '10rem' },
      { field: 'slideCount', header: 'Số lam kính', width: '10rem' },
      { field: 'bodyPart', header: 'Vị trí lấy', width: '10rem' },
      { field: 'sourceHospital', header: 'Nơi gửi', width: '15rem' },
      { field: 'clinicalDiagnosis', header: 'Chẩn đoán', width: '15rem' },
      { field: 'conclusion', header: 'Kết luận', width: '20rem' }
    ];
  }

  ngOnInit() {
    this.actions = [
      { label: 'Mở SlideViewer', icon: 'pi pi-fw pi-external-link', command: () => this.openViewer(this.selectedCaseStudy) },
      { label: 'Cập nhật worklist', icon: 'pi pi-fw pi-sync', 
        command: () => this.onAction.emit(
          { action: Constants.CASE_STUDY_ACTIONS.REFRESH }
        ),
        visible: !this.isRelatedList },
      { label: 'Sửa chi tiết ca khám', icon: 'pi pi-fw pi-file-edit', 
        command: () => this.onAction.emit(
          { action: Constants.CASE_STUDY_ACTIONS.EDIT, data: this.selectedCaseStudy }
        ) },
      { label: 'Tải lên lam kính', icon: 'pi pi-fw pi-upload', 
        command: () => this.onAction.emit(
          { action: Constants.CASE_STUDY_ACTIONS.UPLOAD_SLIDE, data: this.selectedCaseStudy }
        ) },
      { label: 'Sửa thông tin bệnh nhân', icon: 'pi pi-fw pi-user-edit', 
        command: () => this.onAction.emit(
          { action: Constants.CASE_STUDY_ACTIONS.EDIT_PATIENT, data: this.selectedCaseStudy }
        ) },
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

  onRowSelect(event: any) {
    if (event.originalEvent.detail == 1) {
      this.clickTimer = setTimeout(() => {
        this.selectedCaseStudy = event.data;
        this.onSelectCaseStudy.emit(event.data);
      }, 300)
    }
  }

  resetScrollTop() {
    this.caseStudyTable.resetScrollTop();
  }

  openViewer(caseStudy: any) {
    this.selectedCaseStudy = caseStudy;
    this.onSelectCaseStudy.emit(caseStudy);
    clearTimeout(this.clickTimer);
    console.log('openViewer', caseStudy);

    let newTab: IViewerTab = {
      caseStudyId: caseStudy.caseStudyId,
      patientsName: caseStudy.patientsName,
      createdTime: caseStudy.createdTime
    }
    this.viewerState.openTab(newTab);
  }
}
