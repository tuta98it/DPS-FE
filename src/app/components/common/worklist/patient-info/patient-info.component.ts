import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatientService } from 'src/app/services/patient.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'patient-info',
  templateUrl: './patient-info.component.html',
  styleUrls: ['./patient-info.component.scss']
})
export class PatientInfoComponent implements OnInit {
  GENDERS = Constants.GENDERS;
  PATIENT_TYPES = Constants.PATIENT_TYPES;
  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
    if (!value) {
      this.patientForm.reset();
    } else {
      Object.values(this.patientForm.controls).forEach((control) => {
        control.markAsUntouched();
      });
    }
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();
  _patientId = new String(''); // use String type to trigger setter on the same value
  @Input() set patientId(value: String) {
    this._patientId = value;
    if (value != '') {
      this.getPatient();
    }
  }
  get patientId() {
    return this._patientId;
  }
  @Input() header = '';
  @Output() onSelectPatient = new EventEmitter<any>();
  patientForm: FormGroup;
  visibleDuplicate = false;
  listDuplicate: any[] = [];
  selectedDuplicate: any = {};

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private patientService: PatientService,
  ) { 
    this.patientForm = this.fb.group({
      id: [null],
      patientCode: [null, [Validators.required]],
      patientsName: [null, [Validators.required]],
      patientsSex: [null, [Validators.required]],
      yob: [null, [Validators.required]],
      cmnd: [null],
      phoneNo: [null],
      email: [null],
      address: [null],
      faculty: [null],
      room: [null],
      sickBed: [null],
      patientType: [null, [Validators.required]],
      bhyt: [null],
      validDateBHYT: [null],
      expireDateBHYT: [null]
    });
  }

  ngOnInit(): void {
  }

  getPatient() {
    this.patientService.getById(this.patientId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.patientForm.patchValue(res.jsonData);
        }
      }
    });
  }

  onSave() {
    if (this.patientForm.valid) {
      if (this.patientId == '') {
        this.createPatient();
      } else {
        this.updatePatient();
      }
    } else {
      Object.values(this.patientForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updatePatient() {
    this.patientService.update(this.patientForm.value.id, this.patientForm.value).subscribe({
      next: (res) => {
        this.notification.success('Cập nhật thành công', '');
      }
    }).add(() => {
      this.visible = false;
    });
  }

  createPatient(isCheckDuplicate=true) {
    this.patientService.createPatient(isCheckDuplicate, this.patientForm.value).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Thêm mới thành công', '');
          this.onSelectPatient.emit(this.patientForm.value);
          this.visible = false;
        } else if (Array.isArray(res.jsonData)) {
          this.listDuplicate = [];
          res.jsonData.forEach((p:any) => {
            this.listDuplicate.push({
              id: p.duplicatePatient.id,
              patientsName: p.duplicatePatient.patientsName,
              patientCode: p.duplicatePatient.patientCode,
              cmnd: p.duplicatePatient.cmnd,
              address: p.duplicatePatient.address,
              patientsSex: p.duplicatePatient.patientsSex,
              yob: p.duplicatePatient.yob,
              type: p.type,
            });
          });
          this.visibleDuplicate = true;
        }
      }
    }).add(() => {
      if (!isCheckDuplicate) {
        this.visible = false;
        this.visibleDuplicate = false;
      }
    });
  }

  onUseDuplicate() {
    this.onSelectPatient.emit(this.selectedDuplicate);
    this.visible = false;
    this.visibleDuplicate = false;
  }
}
