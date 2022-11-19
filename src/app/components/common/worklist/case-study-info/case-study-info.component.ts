import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PatientService } from 'src/app/services/patient.service';
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
  isVisiblePatientInfo = false;
  genders:any = {};

  constructor(
    private patientService: PatientService,
  ) { 
    Constants.GENDERS.forEach((r: any) => {
      this.genders[r.value] = r.label;
    });
  }

  ngOnInit(): void {
  }

  onUploadSlide() {

  }

  filterPatient(data: any) {
    let payload = {
      skip: 0,
      take: 10,
      keyword: data.query
    }
    this.patientService.search(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.filteredPatients = res.jsonData;
        }
      }
    });
  }

  onSelectPatient(patient: any) {
    this.selectedPatient = patient;
  }
}
