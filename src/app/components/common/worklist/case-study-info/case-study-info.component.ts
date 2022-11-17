import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'case-study-info',
  templateUrl: './case-study-info.component.html',
  styleUrls: ['./case-study-info.component.scss']
})
export class CaseStudyInfoComponent implements OnInit {
  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();
  @Input() header = '';
  selectedPatient: any = {};
  filteredPatients: any[] = [];
  REQUEST_TYPES = Constants.REQUEST_TYPES;
  patientInfoHeader = 'Thêm mới bệnh nhân';
  isVisiblePatientInfo = false;

  constructor() { }

  ngOnInit(): void {
  }

  onUploadSlide() {

  }

  filterPatient(event: any) {

  }
}
