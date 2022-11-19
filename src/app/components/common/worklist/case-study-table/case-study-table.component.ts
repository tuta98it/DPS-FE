import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
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
  @Output() onLazyLoad = new EventEmitter<any>();
  @Output() onEditCaseStudy = new EventEmitter<any>();
  @Output() onEditPatient = new EventEmitter<any>();
  actions!: MenuItem[];
  selectedCaseStudy: any;
  cols: any[];

  constructor() {
    this.cols = [
      // { field: 'idx', header: 'STT', width: '5rem' },
      // { field: 'state', header: 'Trạng thái', width: '8rem' },
      { field: 'patientsName', header: 'Tên bệnh nhân', width: '12rem' },
      { field: 'patientCode', header: 'Mã bệnh nhân', width: '10rem' },
      { field: 'specimensCode', header: 'Mã bệnh phẩm', width: '10rem' },
      { field: 'createdTime', header: 'Ngày lấy mẫu', width: '10rem' },
      { field: 'requestType', header: 'Loại yêu cầu', width: '10rem' },
      { field: 'slideCount', header: 'Số lam kính', width: '10rem' },
      { field: 'bodyPart', header: 'Vị trí lấy', width: '10rem' },
      { field: 'sourceHospital', header: 'Nơi gửi', width: '15rem' },
      { field: 'clinicalDiagnosis', header: 'Chẩn đoán', width: '15rem' },
      { field: 'conclusion', header: 'Kết luận', width: '20rem' }
    ];
    this.actions = [
      { label: 'Mở SlideViewer', icon: 'pi pi-fw pi-external-link', command: () => {} },
      { label: 'Cập nhật worklist', icon: 'pi pi-fw pi-sync', command: () => {} },
      { label: 'Sửa chi tiết ca khám', icon: 'pi pi-fw pi-file-edit', command: () => this.onEditCaseStudy.emit(this.selectedCaseStudy)},
      { label: 'Tải lên lam kính', icon: 'pi pi-fw pi-upload', command: () => {} },
      { label: 'Sửa thông tin bệnh nhân', icon: 'pi pi-fw pi-user-edit', command: () => this.onEditPatient.emit(this.selectedCaseStudy) },
      { label: 'Share ca khám', icon: 'pi pi-fw pi-share-alt', command: () => {} },
      { label: 'Xóa ca khám', icon: 'pi pi-fw pi-trash', command: () => {} },
    ];
  }

  ngOnInit() {
  }

  onScroll(event: any) {
    
  }
}
