import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      this.caseStudyForm.reset();
    } else {
      Object.values(this.caseStudyForm.controls).forEach((control) => {
        control.markAsUntouched();
      });
    }
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();
  @Output() onSaveCaseStudy = new EventEmitter<any>();

  _caseStudy: any = {};
  @Input() set caseStudy(data: any) {
    this._caseStudy = data;
    if (!data.caseStudyId) {
      this.addTemporaryCaseStudy();
    } else {
      console.log('caseStudy', data);
      this.caseStudyForm.patchValue({
        id: data.caseStudyId,
        patientId: data.patientId,
        bodyPart: data.bodyPart,
        clinicalDiagnosis: data.clinicalDiagnosis,
        requestType: data.requestType,
        description: data.description,
        sourceHospital: data.sourceHospital,
        specimensCode: data.specimensCode,
        visitCode: data.visitCode,
        createTime: data.createTime,
        modalityCode: data.modalityCode,
        modalityName: data.modalityName,
        expireDateBHYT: data.expireDateBHYT
      });
    }
  }
  get caseStudy() {
    return this._caseStudy;
  }

  @Input() header = '';
  selectedPatient: any = {};
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
      id: [null],
      patientId: [null, [Validators.required]],
      bodyPart: [null],
      clinicalDiagnosis: [null],
      requestType: [null],
      description: [null],
      sourceHospital: [null],
      specimensCode: [null],
      visitCode: [null],
      createTime: [null],
      modalityCode: [null],
      modalityName: [null],
      expireDateBHYT: [null]
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
      if (!this.caseStudy?.caseStudyId) {
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
    this.caseStudyService.update(this.caseStudyForm.value.id, this.caseStudyForm.value).subscribe({
      next: (res) => {
        this.notification.success('Cập nhật thành công', '');
        this.onSaveCaseStudy.emit();
        this.visible = false;
      }
    });
  }

  createCaseStudy() {
    this.caseStudyService.create(this.caseStudyForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm mới thành công', '');
          this.visible = false;
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
