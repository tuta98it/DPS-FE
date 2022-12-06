import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { INIT_SEARCH_CASE_STUDY } from 'src/app/models/search-case-study';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { KeyImageService } from 'src/app/services/key-image.service';
import { PatientService } from 'src/app/services/patient.service';
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';
import { VisitService } from 'src/app/services/visit.service';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { Constants, Roles } from 'src/app/shared/constants/constants';
import Utils from 'src/app/shared/helpers/utils';
import { NotificationService } from 'src/app/shared/notification.service';
import { CaseStudyTableComponent } from '../worklist/case-study-table/case-study-table.component';

@Component({
  selector: 'vt-worklist',
  templateUrl: './vt-worklist.component.html',
  styleUrls: ['./vt-worklist.component.scss']
})
export class VTWorklistComponent implements OnInit, OnDestroy {
  caseStudies: any = [];
  totalCaseStudies = 0;
  loading = false;
  tableHeight = 200;
  lastMaxStart = -1;
  INIT_SEARCH_CASE_STUDY = INIT_SEARCH_CASE_STUDY;
  searchData = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
  isVisibleSearchCaseStudy = false;

  REQUEST_TYPES = Constants.REQUEST_TYPES;
  REPORT_STATES = Constants.REPORT_STATES;
  requestTypes:any = {};
  reportStates:any = {};

  selectedCaseStudy: any = {};

  @ViewChild('caseStudyTable') caseStudyTable!: CaseStudyTableComponent;

  uploadPatientName = '';
  uploadedCaseStudyId = new String('');
  isVisibleUploadSlide = false;
  
  caseStudyInfoHeader = '';
  updatedCaseStudyId = new String('');
  isVisibleCaseStudyInfo = false;
  
  selectedPatientId = new String('');
  isVisiblePatientInfo = false;

  deletedCaseStudyId = '';
  textConfirmDeleteCase = '';
  isVisibleDeleteCase = false;
  
  totalRelated = 0;
  loadingRelated = false;
  relatedTableHeight = 200;
  relatedCaseStudies: any = [];

  isSmallScreen = true;
  INIT_WORKLIST_SIZE = 30;

  GENDERS = Constants.GENDERS;

  patientForm!: FormGroup;
  caseStudyForm!: FormGroup;
  reportForm!: FormGroup;

  keyImages: any[] = [];
  FILE_URL = '';
  visibleKeyImages = false;

  editableVisit = false;
  visibleConfirmCancel = false;
  saving = false;
  doctors: any[] = [];

  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;
  
  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private caseStudyService: CaseStudyService,
    private reportService: ReportService,
    private keyImageService: KeyImageService,
    public configService: AppConfigService,
    private authState: AuthStateService,
    public visitService: VisitService,
    public userService: UserService,
    private notification: NotificationService,
  ) { 
    this._authSubscription = this.authState.subscribe( (m: IAuthModel) => {
      this.currentUser = m;
    });
    Constants.REQUEST_TYPES.forEach((r: any) => {
      this.requestTypes[r.value] = r.label;
    });
    Constants.REPORT_STATES.forEach((r: any) => {
      this.reportStates[r.value] = r.label;
    });
    this.isSmallScreen = window.innerWidth < 1600;
    this.initForm();
    this.FILE_URL = this.configService.getConfig().api.fileUrl; 
    this.getDoctors();
  }

  ngOnInit(): void {
    this.setTableHeight(this.INIT_WORKLIST_SIZE);
    this.search();
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }

  initForm() {
    this.patientForm = this.fb.group({
      id: [''],
      patientCode: [null, [Validators.required]],
      patientsName: [null, [Validators.required]],
      patientsSex: [null, [Validators.required]],
      yob: [null, [Validators.required]],
      email: [null],
      address: [null]
    });
    this.caseStudyForm = this.fb.group({
      id: [''],
      patientId: ['', [Validators.required]],
      bodyPart: [''],
      clinicalDiagnosis: [''],
      requestType: [''],
      description: [''],
      sourceHospital: [''],
      staff: [''],
      specimensCode: [''],
      visitCode: [''],
      quantity: [''],
      numberOfSlideManual: [0],
      createTime: [null],
      modalityCode: [''],
      modalityName: ['']
    });
    this.reportForm = this.fb.group({
      id: [''],
      caseStudyId: [''],
      microbodyDescribe: [''],
      consultation: [''],
      diagnose: [''],
      readDoctor: [''],
    });
  }

  search() {
    // AnhHT: maybe better if search in CaseStudyTableComponent
    this.loading = true;
    this.caseStudyService.search(this.searchData).subscribe({
      next: (res) => {
        res.jsonData.data.forEach((r: any) => {
          r.stateLabel = this.reportStates[r.state];
          r.requestTypeLabel = this.requestTypes[r.requestType];
        });
        this.caseStudies = [...this.caseStudies, ...res.jsonData.data];
        this.totalCaseStudies = res.jsonData.total;
      }
    }).add(() => {
      this.loading = false;
    });
  }

  onSelectCaseStudy(data: any) {
    this.selectedCaseStudy = data;
    if (!this.editableVisit) {
      this.getCaseStudyOfPatient();
      this.getPatient();
      this.getCaseStudy();
      this.getCaseStudyReports();
      this.getKeyImages();
    }
  }

  onCreateVisit() {
    this.editableVisit = true;
    this.reportForm.controls['readDoctor'].setValue(this.currentUser.userId);
  }

  saveVisit() {
    this.saving = true;
    let payload = {
      caseStudy: { ...this.caseStudyForm.value, isDirty: true },
      patient: { ...this.patientForm.value, isDirty: true, patientType: Constants.PATIENT_TYPES[1].value },
      report: { ...this.reportForm.value, isDirty: true }
    }
    this.visitService.saveVisit(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Tạo ca khám thành công');
          this.onSearch(INIT_SEARCH_CASE_STUDY);
        }
      }
    }).add(() => {
      this.saving = false;
    });
  }

  resetInfo() {
    this.patientForm.reset();
    this.caseStudyForm.reset();
    this.reportForm.reset();
    this.keyImages = [];
    this.relatedCaseStudies = [];
    this.totalRelated = 0;
  }

  cancelEdit() {
    this.resetInfo();
    this.editableVisit = false;
    this.visibleConfirmCancel = false;
  }

  onSave() {
    if (this.patientForm.valid) {
      this.saveVisit();
    } else {
      Object.values(this.patientForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.notification.warn('Chưa nhập đủ dữ liệu!');
    }
  }

  getCaseStudy() {
    this.caseStudyService.getById(this.selectedCaseStudy.caseStudyId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.caseStudyForm.patchValue({
            ...res.jsonData,
            createTime: new Date(res.jsonData.createdTime),
          });
        }
      }
    });
  }

  getCaseStudyReports() {
    this.reportService.getCaseStudyReports(this.selectedCaseStudy.caseStudyId).subscribe({
      next: (res) => {
        if (res.isValid && res.jsonData.length > 0) {
          this.reportForm.patchValue({
            id: res.jsonData[0].id,
            caseStudyId: res.jsonData[0].caseStudyId,
            microbodyDescribe: Utils.extractContent(res.jsonData[0].microbodyDescribe),
            consultation: Utils.extractContent(res.jsonData[0].consultation),
            diagnose: Utils.extractContent(res.jsonData[0].diagnose), 
          });
        }
      }
    });
  }

  getKeyImages() {
    this.keyImageService.getCaseStudyKeyImages(this.selectedCaseStudy.caseStudyId).subscribe({
      next: (res) => {
        if (res.isValid) {
          res.jsonData.forEach((i:any) => {
            i.src = `${this.FILE_URL}/${i.imagePath}`;
          });
          this.keyImages = res.jsonData;
        }
      }
    });
  }

  getCaseStudyOfPatient() {
    this.loadingRelated = true;
    this.caseStudyService.getCaseStudyOfPatient(this.selectedCaseStudy.patientId).subscribe({
      next: (res) => {
        if (res.isValid) {
          res.jsonData.forEach((r: any) => {
            r.stateLabel = this.reportStates[r.state];
            r.requestTypeLabel = this.requestTypes[r.requestType];
          });
          this.relatedCaseStudies = res.jsonData;
          this.totalRelated = res.jsonData.length;
        }
      }
    }).add(() => {
      this.loadingRelated = false;
    });
  }

  onSearch(data: any) {
    this.searchData = JSON.parse(JSON.stringify(data));
    this.searchData.from = this.searchData.from ? new Date(this.searchData.from) : '';
    this.searchData.to = this.searchData.to ? new Date(this.searchData.to) : '';
    this.searchData.page = 1;
    this.caseStudyTable.selectedCaseStudy = {};
    this.selectedCaseStudy = {};
    this.caseStudies = [];
    this.relatedCaseStudies = [];
    this.caseStudyTable.resetScrollTop();
    this.lastMaxStart = -1;
    this.search();
  }

  dragEnd(event: any) {
    this.setTableHeight(event.sizes[1]);
  }

  setTableHeight(worklistSize: number) {
    let fontSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    const headerHeight = 3.5;
    let contentHeight = window.innerHeight - headerHeight*fontSize;
    this.tableHeight = contentHeight*worklistSize/100 - 70;
  }

  onCaseStudyAction(event: any) {
    if (event.action == Constants.CASE_STUDY_ACTIONS.REFRESH) {
      this.onSearch(this.searchData);
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.EDIT) {
      this.onEditCaseStudy(event.data);
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.UPLOAD_SLIDE) {
      this.onUploadSlide(event.data);
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.EDIT_PATIENT) {
      this.onEditPatient(event.data);
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.SHARE) {
      this.onShareCaseStudy(event.data);
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.DELETE) {
      this.onDeleteCaseStudy(event.data);
    }
  }

  onUploadSlide(data: any) {
    this.uploadPatientName = data.patientsName;
    this.uploadedCaseStudyId = new String(data.caseStudyId);
    this.isVisibleUploadSlide = true;
  }

  onEditCaseStudy(data: any) {
    this.caseStudyInfoHeader = 'Sửa thông tin ca khám';
    this.updatedCaseStudyId = new String(data.caseStudyId);
    this.selectedPatientId = data.patientId;
    this.isVisibleCaseStudyInfo = true;
  }
  
  onEditPatient(event: any) {
    this.selectedPatientId = new String(event.patientId);
    this.isVisiblePatientInfo = true;
  }

  onDeleteCaseStudy(data: any) {
    this.deletedCaseStudyId = data.caseStudyId;
    this.textConfirmDeleteCase = `Xác nhận xóa ca khám của bệnh nhân <b>${data.patientsName}</b>?`;
    this.isVisibleDeleteCase = true;
  }

  deleteCaseStudy() {
    this.caseStudyService.deleteById(this.deletedCaseStudyId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Xóa ca khám thành công');
          this.onSearch(this.searchData);
        }
      }
    }).add(() => {
      this.isVisibleDeleteCase = false;
    });
  }

  onShareCaseStudy(data: any) {
    this.notification.warn('Chức năng đang phát triển');
  }

  onLazyLoad(event:any) {
    if (this.lastMaxStart < event.first && !this.loading) {
      this.lastMaxStart = event.first;
      this.searchData.page += 1;
      this.search();
    }
  }
  
  getPatient() {
    this.patientService.getById(this.selectedCaseStudy.patientId).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.patientForm.patchValue(res.jsonData);
        }
      }
    });
  }

  getDoctors() {
    let payload = {
      take: 1000,
      skip: 0,
      keyword: ''
    };
    this.userService.getUserRoles(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          res.jsonData.data.forEach((d:any) => {
            if (d.roles.includes(Roles.DOCTOR_READ)) {
              this.doctors.push({
                username: d.username,
                fullname: d.fullname,
                id: d.id
              });
            }
          });
        }
      }
    }).add(() => {
      this.loading = false
    });
  }
}
