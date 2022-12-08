import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { INIT_CASE_STUDY } from 'src/app/models/case-study';
import { INIT_REPORT } from 'src/app/models/report';
import { INIT_SEARCH_CASE_STUDY } from 'src/app/models/search-case-study';
import { IViewerTab } from 'src/app/models/viewer-tab';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { KeyImageService } from 'src/app/services/key-image.service';
import { PatientService } from 'src/app/services/patient.service';
import { ReportService } from 'src/app/services/report.service';
import { UserService } from 'src/app/services/user.service';
import { VisitService } from 'src/app/services/visit.service';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
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

  creatingVisit = false;
  editingVisit = false;
  visibleConfirmCancel = false;
  saving = false;
  doctors: any[] = [];

  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;
  
  visiblePrintPreview = false;
  isDirty = {
    patientForm: true,
    caseStudyForm: true,
    reportForm: true,
  }
  currentInfo: any = {};

  visibleConfirmSave = false;
  visibleConfirmUnapprove = false;

  @ViewChild("uploadKeyImageContainer") uploadKeyImageContainer!: ElementRef;
  uploadingKeyImage = false;
  keyImageUploadedPath = '';

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private caseStudyService: CaseStudyService,
    private fileUploadService: FileUploadService,
    private reportService: ReportService,
    private keyImageService: KeyImageService,
    public configService: AppConfigService,
    private authState: AuthStateService,
    public visitService: VisitService,
    private viewerState: ViewerStateService,
    public userService: UserService,
    private notification: NotificationService,
  ) { 
    this._authSubscription = this.authState.subscribe((m: IAuthModel) => {
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
      state: [''],
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
    if (!(this.editingVisit || this.creatingVisit)) {
      this.selectedCaseStudy = data;
      this.getCaseStudyOfPatient();
      this.getPatient();
      this.getCaseStudy();
      this.getCaseStudyReports();
      this.getKeyImages();
    }
  }

  onCreateVisit() {
    if (this.creatingVisit) {
      return;
    } else if (this.editingVisit) {
      this.visibleConfirmSave = true;
    } else {
      this.creatingVisit = true;
      this.resetInfo();
      this.reportForm.controls['readDoctor'].setValue(this.currentUser.userId);
    }
  }

  onEditVisit() {
    if (!(this.creatingVisit || this.editingVisit)) {
      this.editingVisit = true;
      if (this.reportForm.value.readDoctor == '') {
        this.reportForm.controls['readDoctor'].setValue(this.currentUser.userId);
      }
      this.currentInfo = {
        caseStudy: JSON.stringify(this.caseStudyForm.value),
        patient: JSON.stringify(this.patientForm.value),
        report: JSON.stringify(this.reportForm.value),
      };
    }
  }

  checkDirty() {
    if (this.editingVisit) {
      this.isDirty.caseStudyForm = this.currentInfo.caseStudy != JSON.stringify(this.caseStudyForm.value);
      this.isDirty.patientForm = this.currentInfo.patient != JSON.stringify(this.patientForm.value);
      this.isDirty.reportForm = this.currentInfo.report != JSON.stringify(this.reportForm.value);
    } else if (this.creatingVisit) {
      this.isDirty.caseStudyForm = true;
      this.isDirty.patientForm = true;
      this.isDirty.caseStudyForm = true;
    }
  }

  saveVisit(isApprove=false) {
    this.saving = true;
    let state = parseInt(Constants.REPORT_STATES[2].value) 
    if (isApprove || this.reportForm.value.state == Constants.REPORT_STATES[4].value) {
      state = parseInt(Constants.REPORT_STATES[4].value) 
    }
    let payload = {
      caseStudy: { ...this.caseStudyForm.value, isDirty: this.isDirty.caseStudyForm, },
      patient: { ...this.patientForm.value, isDirty: this.isDirty.patientForm, patientType: Constants.PATIENT_TYPES[1].value },
      report: { ...this.reportForm.value, isDirty: this.isDirty.reportForm || isApprove, state: state}
    }
    this.visitService.saveVisit(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          if (this.creatingVisit) {
            this.onSearch(INIT_SEARCH_CASE_STUDY);
            this.notification.success('Tạo ca khám thành công');
          } else {
            this.onSearch(this.searchData);
            this.notification.success('Cập nhật ca khám thành công');
          }
        }
      }
    }).add(() => {
      this.saving = false;
      this.cancelEdit();
      if (this.visibleConfirmSave) {
        this.visibleConfirmSave = false;
        this.creatingVisit = true;
      }
    });
  }

  resetInfo() {
    this.patientForm.reset();
    this.caseStudyForm.reset(INIT_CASE_STUDY);
    this.reportForm.reset(INIT_REPORT);
    this.keyImages = [];
    this.relatedCaseStudies = [];
    this.totalRelated = 0;
  }

  cancelEdit() {
    this.resetInfo();
    this.creatingVisit = false;
    this.editingVisit = false;
    this.visibleConfirmCancel = false;
  }

  onApprove() {
    this.onEditVisit();
    this.onSave(true);
  }

  onUnapprove() {
    this.visibleConfirmUnapprove = true;
  }

  unapprove() {
    this.reportService.unapprove(this.reportForm.value.id).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Bỏ duyệt ca khám thành công');
          this.onEditVisit();
          this.reportForm.controls['state'].setValue(Constants.REPORT_STATES[2].value);
        }
      }
    });
  }

  onSave(isApprove=false) {
    if (this.patientForm.valid) {
      this.checkDirty();
      this.saveVisit(isApprove);
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
        if (res.isValid) {
          if (res.jsonData.length > 0) {
            this.reportForm.patchValue({
              id: res.jsonData[0].id,
              caseStudyId: res.jsonData[0].caseStudyId,
              microbodyDescribe: Utils.extractContent(res.jsonData[0].microbodyDescribe),
              consultation: Utils.extractContent(res.jsonData[0].consultation),
              diagnose: Utils.extractContent(res.jsonData[0].diagnose), 
              readDoctor: res.jsonData[0].readDoctorId, 
              state: res.jsonData[0].state, 
            });
          } else {
            this.reportForm.reset(INIT_REPORT);
          }
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

  uploadKeyImage(event: any) {
    let inputUpload = this.uploadKeyImageContainer.nativeElement.querySelector('#dps-upload-key-image');
    if (inputUpload.files.length > 0) {
      this.uploadingKeyImage = true;
      this.fileUploadService.upload(inputUpload.files[0]).subscribe({
        next: (res) => {
          if (res.isValid) {
            this.keyImageUploadedPath = res.jsonData;
          }
        }
      }).add(() => {
        this.saveKeyImage();
      });
    }
  }

  saveKeyImage() {
    if (this.keyImageUploadedPath) {
      let payload = {
        title: "",
        caseStudyId: this.caseStudyForm.value.id,
        imagePath: this.keyImageUploadedPath,
        note: ""
      }
      this.keyImageService.create(payload).subscribe({
        next: (res) => {
          if (res.isValid) {
            this.getKeyImages();
          }
        }
      }).add(() => {
        this.uploadingKeyImage = false;
      });
    }
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
    } else if (event.action == Constants.CASE_STUDY_ACTIONS.UPLOAD_SLIDE) {
      this.onUploadSlide(event.data);
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

  openViewer() {
    let newTab: IViewerTab = {
      caseStudyId: this.selectedCaseStudy.caseStudyId,
      patientsName: this.selectedCaseStudy.patientsName,
      createdTime: this.selectedCaseStudy.createdTime
    }
    this.viewerState.openTab(newTab);
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
