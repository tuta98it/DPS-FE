import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { INIT_SEARCH_CASE_STUDY, SearchCaseStudy } from 'src/app/models/search-case-study';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'study-table-search',
  templateUrl: './study-table-search.component.html',
  styleUrls: ['./study-table-search.component.scss']
})
export class StudyTableSearchComponent implements OnInit {
  @Input() searchData: SearchCaseStudy = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
  @Output() onSearch = new EventEmitter<any>();
  @Input() layoutConfig = Constants.LAYOUT_CONFIG.VT;
  cols!: any[];

  REPORT_STATES = Constants.REPORT_STATES;
  REQUEST_TYPES = Constants.REQUEST_TYPES;
  LAYOUT_CONFIG = Constants.LAYOUT_CONFIG;
  FILTER_STATES_1 = Constants.FILTER_STATES_1;
  FILTER_STATES_2 = Constants.FILTER_STATES_2;
  FILTER_STATES_3 = Constants.FILTER_STATES_3;
  FILTER_STATES_4 = Constants.FILTER_STATES_4;

  constructor() { 
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'createdDate', header: 'Ngày tạo', width: '12rem' },
      { field: 'patientsName', header: 'Tên bệnh nhân', width: '12rem' },
      { field: 'patientCode', header: 'Mã bệnh nhân', width: '10rem' },
      { field: 'createdTime', header: 'Ngày lấy mẫu', width: '10rem' },
      { field: 'specimensCode', header: 'Mã bệnh phẩm', width: '10rem' },
      { field: 'requestTypeLabel', header: 'Loại yêu cầu', width: '10rem' },
      { field: 'slideCount', header: 'Số lam kính', width: '8rem' },
      { field: 'bodyPart', header: 'Vị trí lấy mẫu', width: '10rem' },
      { field: 'sourceHospital', header: 'Nơi gửi', width: '15rem' },
      { field: 'clinicalDiagnosis', header: 'Chẩn đoán', width: '15rem' },
      { field: 'conclusion', header: 'Kết luận', width: '18.5rem' }
    ];
    if (this.layoutConfig==Constants.LAYOUT_CONFIG.VT) {
      this.cols.splice(3, 0, ...[
        { field: 'hasSlide', header: 'Đã chụp', width: '7rem' },
        { field: 'hasConclusion', header: 'Đã đọc', width: '7rem' },
        { field: 'isApprove', header: 'Đã duyệt', width: '7rem' },
        { field: 'isPrint', header: 'Đã in', width: '7rem' },
      ]);
    }
  }

}
