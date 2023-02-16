import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { INIT_CASE_STUDY } from 'src/app/models/case-study';
import { ISlideNotification } from 'src/app/models/slide-notification';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { PatientService } from 'src/app/services/patient.service';
import { NotificationStateService } from 'src/app/shared/app-state/notification-state.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { BodyPartService } from 'src/app/services/body-part.service';

import moment from 'moment';
@Component({
  selector: 'case-study-info',
  templateUrl: './case-study-info.component.html',
  styleUrls: ['./case-study-info.component.scss']
})
export class CaseStudyInfoComponent implements OnInit, OnDestroy {
  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
    if (!value) {
      this.caseStudyForm.reset(INIT_CASE_STUDY);
      this.selectedPatient = {};
      this.slideFiles = [];
      this.nSlideFiles = '0';
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
    if (this.visible) {
      if (data == '' ) {
        this.addTemporaryCaseStudy();
      } else {
        this.getCaseStudy();
        this.getPatient();
      }
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
  bodyParts: any = [];

  visibleConfirmCancel = false;
  textConfirmCancel = '';

  visibleUploadSlide = false;
  uploadedCaseStudyId = new String('');
  protected _notificationsSubscription: Subscription;

  slideFiles: any[] = [];
  slideNotifications: ISlideNotification[] = [];
  UPLOAD_STATUS_LABEL = Constants.UPLOAD_STATUS_LABEL;
  nSlideFiles = '0';
  uploadedPatientName = '';

  currentInfo: any = {};

  constructor(
    private patientService: PatientService,
    private notification: NotificationService,
    private caseStudyService: CaseStudyService,
    private notificationState: NotificationStateService,
    private fb: FormBuilder,
    private bodyPartService: BodyPartService,
  ) {
    Constants.GENDERS.forEach((r: any) => {
      this.genders[r.value] = r.label;
    });
    this.caseStudyForm = this.fb.group({
      id: [''],
      patientId: ['', [Validators.required]],
      bodyPartId: [''],
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
    this._notificationsSubscription = this.notificationState.subscribeNotifications( (notifications: ISlideNotification[]) => {
      this.slideNotifications = notifications;
      this.filterSlideFiles();
    });
    this.getBodyParts();
  }

  ngOnInit(): void {

  }

  public ngOnDestroy(): void {
    this._notificationsSubscription.unsubscribe();
  }

  onUploadSlide() {
    this.visibleUploadSlide = true;
  }

  filterSlideFiles() {
    if (this.caseStudyId == '') {
      this.slideFiles = this.slideNotifications.filter(n => n.caseStudyId == this.uploadedCaseStudyId);
    } else {
      let slideFiles = this.slideNotifications.filter(n => n.caseStudyId == this.caseStudyId);
      for (let i=0; i<slideFiles.length; ++i) {
        let index = this.slideFiles.findIndex(f => f.id == slideFiles[i].id);
        if (index > -1) {
          this.slideFiles[index].state = slideFiles[i].state;
        } else if (slideFiles[i].state==Constants.UPLOAD_STATUS.UPLOADING) {
          this.slideFiles.unshift(slideFiles[i]);
        }
      }
    }
    this.setNSlideFiles();
  }

  setNSlideFiles() {
    if (this.slideFiles.length) {
      let nErrorFiles = this.slideFiles.filter(f => f.state==Constants.UPLOAD_STATUS.ERROR).length;
      this.nSlideFiles = this.slideFiles.filter(f => f.state==Constants.UPLOAD_STATUS.COMPLETED).length + '/'
        + (this.slideFiles.length-nErrorFiles);
      if (nErrorFiles) {
        this.nSlideFiles += `( ${nErrorFiles} thất bại)`;
      }
    } else {
      this.nSlideFiles = '0';
    }
  }

  addTemporaryCaseStudy() {
    this.caseStudyService.addTemporaryCaseStudy().subscribe({
      next: (res) => {
        this.caseStudyForm.controls['id'].setValue(res.d.jsonData);
        this.uploadedCaseStudyId = res.d.jsonData;
      }
    });
  }

  onSave() {
    if (this.caseStudyForm.valid) {
      if (this.caseStudyId == '') {
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
    this.caseStudyService.getCaseStudyInfo(this.caseStudyId+'').subscribe({
      next: (res) => {
        if (res.isValid) {
          this.updatedCaseStudy = res.jsonData;
          this.uploadedCaseStudyId = res.jsonData.caseStudyId;
          this.uploadedPatientName = res.jsonData.patientsName;
          this.caseStudyForm.patchValue({
            ...res.jsonData,
            id: res.jsonData.caseStudyId,
            createTime: moment(res.jsonData.createdTime, "HH:mm:ss DD/MM/YYYY").toDate(),
          });
          this.slideFiles = res.jsonData.slides ?? [];
          this.setNSlideFiles();
          this.currentInfo = {
            caseStudy: JSON.stringify(this.caseStudyForm.value)
          };
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

  getBodyParts() {
    this.bodyPartService.getAll().subscribe({
      next: (res) => {
        if (res.isValid) {
          this.bodyParts = res.jsonData;
        }
      },
    })
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

  isDirty() {
    if (this.caseStudyId == '') {
      return !this.caseStudyForm.pristine || this.selectedPatient.id || this.slideFiles.length > 0;
    } else {
      // return this.currentInfo.caseStudy != JSON.stringify(this.caseStudyForm.value);
      return false;
    }
  }

  onCancel() {
    if (this.isDirty()) {
      this.textConfirmCancel =
      `Đóng cửa sổ sẽ làm mất các nội dung chưa được lưu, bao gồm:<br/>
      Thông tin ca thăm khám<br/>
      Các lam kính vừa tải lên`
      this.visibleConfirmCancel = true;
    } else {
      this.visible = false;
    }
  }

  confirmCancel() {
    this.visibleConfirmCancel = false;
    this.visible = false;
  }
}
