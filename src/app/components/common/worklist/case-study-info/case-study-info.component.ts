import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { INIT_CASE_STUDY } from 'src/app/models/case-study';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { PatientService } from 'src/app/services/patient.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';

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
    if (!value) {
      this.caseStudyForm.reset(INIT_CASE_STUDY);
      this.selectedPatient = {};
    }
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();
  @Output() onSaveCaseStudy = new EventEmitter<any>();

  _caseStudyId = new String('');
  @Input() set caseStudyId(data: String) {
    this._caseStudyId = data;
    if (data == '') {
      this.addTemporaryCaseStudy();
    } else {
      this.getCaseStudy();
      this.getPatient();
    }
  }
  get caseStudyId() {
    return this._caseStudyId;
  }

  @Input() patientId = '';
  @Input() header = '';
  selectedPatient: any = {};
  updatedCaseStudy: any = {};
  filteredPatients: any[] = [];
  REQUEST_TYPES = Constants.REQUEST_TYPES;
  isVisiblePatientInfo = false;
  genders:any = {};
  caseStudyForm: FormGroup;

  constructor(
    private patientService: PatientService,
    private notification: NotificationService,
    private caseStudyService: CaseStudyService,
    private fb: FormBuilder,
  ) { 
    Constants.GENDERS.forEach((r: any) => {
      this.genders[r.value] = r.label;
    });
    this.caseStudyForm = this.fb.group({
      id: [''],
      patientId: ['', [Validators.required]],
      bodyPart: [''],
      clinicalDiagnosis: [''],
      requestType: [''],
      description: [''],
      sourceHospital: [''],
      specimensCode: [''],
      visitCode: [''],
      createTime: [''],
      modalityCode: [''],
      modalityName: ['']
    });
  }

  ngOnInit(): void {
    
  }

  onUploadSlide() {

  }

  addTemporaryCaseStudy() {
    this.caseStudyService.addTemporaryCaseStudy().subscribe({
      next: (res) => {
        this.caseStudyForm.controls['id'].setValue(res.d.jsonData);
      }
    });
  }

  onSave() {
    if (this.caseStudyForm.valid) {
      if (!this.caseStudyId) {
        this.createCaseStudy();
      } else {
        this.updateCaseStudy();
      }
    } else {
      Object.values(this.caseStudyForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateCaseStudy() {
    let payload = {...this.updatedCaseStudy, ...this.caseStudyForm.value, status: 0, specimensDates: null}
    this.caseStudyService.updateCaseStudy(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Cập nhật thành công', '');
          this.onSaveCaseStudy.emit();
          this.visible = false;
        }
      }
    });
  }

  createCaseStudy() {
    this.caseStudyService.create(this.caseStudyForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.onSaveCaseStudy.emit();
          this.notification.success('Thêm mới thành công', '');
          this.visible = false;
        }
      }
    });
  }

  getCaseStudy() {
    this.caseStudyService.getById(this.caseStudyId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.updatedCaseStudy = res.jsonData;
          this.caseStudyForm.patchValue({
            id: res.jsonData.id,
            patientId: res.jsonData.patientId,
            bodyPart: res.jsonData.bodyPart,
            clinicalDiagnosis: res.jsonData.clinicalDiagnosis,
            requestType: res.jsonData.requestType,
            description: res.jsonData.description,
            sourceHospital: res.jsonData.sourceHospital,
            specimensCode: res.jsonData.specimensCode,
            visitCode: res.jsonData.visitCode,
            createTime: new Date(res.jsonData.createdTime),
            modalityCode: res.jsonData.modalityCode,
            modalityName: res.jsonData.modalityName
          });
        }
      }
    });
  }

  getPatient() {
    this.patientService.getById(this.patientId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.selectedPatient = res.jsonData;
        }
      }
    });
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
    this.caseStudyForm.controls['patientId'].setValue(patient.id);
  }

  onClearPatient() {
    this.selectedPatient = {};
    this.caseStudyForm.controls['patientId'].setValue(null);
  }
}
