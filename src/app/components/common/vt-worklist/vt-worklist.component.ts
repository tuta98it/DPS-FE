import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { INIT_CASE_STUDY } from 'src/app/models/case-study';
import { INIT_REPORT } from 'src/app/models/report';
import { INIT_SEARCH_CASE_STUDY, SearchCaseStudy } from 'src/app/models/search-case-study';
import { IUploadKeyImageData } from 'src/app/models/upload-key-image-data';
import { INIT_UPLOAD_SLIDE_DATA } from 'src/app/models/upload-slide-data';
import { IViewerTab } from 'src/app/models/viewer-tab';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { KeyImageService } from 'src/app/services/key-image.service';
import { MarkTypeService } from 'src/app/services/mark-type.service';
import { PatientService } from 'src/app/services/patient.service';
import { ReportTemplateService } from 'src/app/services/report-template.service';
import { ReportService } from 'src/app/services/report.service';
import { SlideUploadService } from 'src/app/services/slide-upload.service';
import { UserService } from 'src/app/services/user.service';
import { VisitService } from 'src/app/services/visit.service';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { Constants, Roles } from 'src/app/shared/constants/constants';
import Utils from 'src/app/shared/helpers/utils';
import { NotificationService } from 'src/app/shared/notification.service';
import { CaseStudyTableComponent } from '../worklist/case-study-table/case-study-table.component';
import { saveAs } from 'file-saver';
import { OrderDoctorService } from 'src/app/services/order-doctor.service';
import { TechnicianService } from 'src/app/services/technician.service';
import { SourceHospitalService } from 'src/app/services/source-hospital.service';

@Component({
  selector: 'vt-worklist',
  templateUrl: './vt-worklist.component.html',
  styleUrls: ['./vt-worklist.component.scss']
})
export class VTWorklistComponent implements OnInit, OnDestroy {
  caseStudies: any = [];
  totalCaseStudies = 0;
  loading = false;
  lastMaxStart = -1;
  INIT_SEARCH_CASE_STUDY = { ...JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY)), from: new Date().setHours(0, 0, 0, 0) };
  _searchData = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
  set searchData(value: SearchCaseStudy) {
    this._searchData = value;
    this.searchData.from = this.searchData.from ? new Date(this.searchData.from) : '';
    this.searchData.to = this.searchData.to ? new Date(this.searchData.to) : '';
    
  }
  get searchData(): SearchCaseStudy {
    return this._searchData;
  }

  currentSearchData:SearchCaseStudy|null = null;
  _isVisibleSearchCaseStudy = false;
  set isVisibleSearchCaseStudy(value: boolean) {
    this._isVisibleSearchCaseStudy = value;
    if (value) {
      this.searchData = { ...this.searchData };
      this.currentSearchData = JSON.parse(JSON.stringify(this.searchData));
    }
  }
  get isVisibleSearchCaseStudy(): boolean {
    return this._isVisibleSearchCaseStudy;
  }

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
  relatedCaseStudies: any = [];

  //UI default sizes
  tableHeight = 200; //pixel
  relatedTableHeight = 100; //pixel
  isSmallScreen = true;
  INIT_WORKLIST_HEIGHT = 30; //percentage
  INIT_WORKLIST_MIN = 30; //percentage

  GENDERS = Constants.GENDERS;

  patientForm!: FormGroup;
  caseStudyForm!: FormGroup;
  reportForm!: FormGroup;

  keyImages: any[] = [];
  FILE_URL = '';
  visibleKeyImages = false;
  printedKeyImages: any[] = [];

  creatingVisit = false;
  editingVisit = false;
  visibleConfirmCancel = false;
  saving = false;
  doctors: any[] = [];
  reportTemplates: any[] = [];

  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;

  visiblePrintPreview = false;
  isDirty = {
    patientForm: true,
    caseStudyForm: true,
    reportForm: true,
  }
  currentInfo: any = {};
  visibleConfirmUnapprove = false;

  @ViewChild("liveCam") liveCam!: ElementRef;
  keyImageUploadedPath = '';
  visibleUploadKeyImage = false;
  currentReportTemplate = '';
  
  cameras: MenuItem[] = [];
  selectedCameraId = '';
  stream!: MediaStream;
  canvas: any;
  loadingCamera = false;

  _isShowLiveCam = false;
  set isShowLiveCam(value: boolean) {
    this._isShowLiveCam = value;
    if (value) {
      this.showLiveCam();
    } else {
      this.stopLiveCam();
    }
  }
  get isShowLiveCam(): boolean {
    return this._isShowLiveCam;
  }
  markTypes: any[] = [];
  selectedMarkType = '';
  uploadingKeyImage = false;
  isLiveCamFullScreen = false;
  activeKeyImageIndex = 0;

  loadingExport = false;

  visibleSharedCaseStudy = false;
  sharedCaseStudyId = '';

  orderDoctors: any[] = [];
  technicians: any[] = [];
  sourceHospitals: any[] = [];

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private caseStudyService: CaseStudyService,
    private reportService: ReportService,
    private keyImageService: KeyImageService,
    public configService: AppConfigService,
    private authState: AuthStateService,
    public visitService: VisitService,
    private viewerState: ViewerStateService,
    private markTypeService: MarkTypeService,
    private slideUploadService: SlideUploadService,
    private userService: UserService,
    private orderDoctorService: OrderDoctorService,
    private technicianService: TechnicianService,
    private sourceHospitalService: SourceHospitalService,
    private reportTemplateService: ReportTemplateService,
    private notification: NotificationService,
    private ref: ChangeDetectorRef,
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
    this.searchData = JSON.parse(JSON.stringify(this.INIT_SEARCH_CASE_STUDY));
    this.isSmallScreen = window.innerWidth < 1600;
    if(!this.isSmallScreen) {
      this.INIT_WORKLIST_HEIGHT = 35;
    }
    this.initForm();
    this.FILE_URL = this.configService.getConfig().api.fileUrl;
    this.getDoctors();
    this.getTechnicians();
    this.getOrderDoctors();
    this.getSourceHospitals();
    this.getReportTemplates();
    this.cameras = [
      { id: '', label: 'Đang kết nối thiết bị', visible: true },
      { id: '', label: 'Không tìm thấy thiết bị thiết bị', visible: false },
    ];
    this.canvas = document.createElement('canvas');
  }

  ngOnInit(): void {
    this.setTableHeight(this.INIT_WORKLIST_HEIGHT);
    this.search();
    this.initCamera();
    this.getMarkTypes();
  }

  public ngOnDestroy(): void {
    this._authSubscription.unsubscribe();
  }

  initCamera(){
    navigator.mediaDevices.getUserMedia({video: true}).then(stream => {
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          devices.forEach(
            device => {
              if (device.kind === 'videoinput') {
                this.cameras.push({ 
                  id: device.deviceId, 
                  label: device.label,
                  command: (event) => this.selectCamera(event.item.id),
                });
              }
            }
          );
          // stop track after get list camera devices
          let track = stream.getTracks()[0];
          if (track) {
            track.stop();
          }
        })
        .catch(err => console.log(err))
        .finally(() => { 
          this.cameras[0].visible = false;
          if (this.cameras.length == 2) {
            this.cameras[1].visible = true;
          }
          this.cameras = [...this.cameras];
          if (this.cameras.length > 2) {
            this.selectedCameraId = this.cameras[2].id ?? '';
            if (this.isShowLiveCam) {
              this.showLiveCam();
            }
          }
        });
    });
  }

  showLiveCam() {
    if (this.selectedCameraId) {
      this.loadingCamera = true;
      const vgaConstraints = {
        video: {
          deviceId: this.selectedCameraId
        }
      };
      navigator.mediaDevices.getUserMedia(vgaConstraints)
        .then((stream: any) => {
          this.stream = stream;
          this.loadingCamera = false;
        }).catch(err => console.log(err));
    }
  }

  stopLiveCam() {
    this.stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  selectCamera(id: string) {
    this.selectedCameraId = id;
    this.showLiveCam();
  }

  captureImage(event: any) {
    event.preventDefault();
    if (!this.loadingCamera && this.selectedCameraId) {
      if (!this.selectedMarkType) {
        return this.notification.warn('Vui lòng chọn phương pháp nhuộm');
      }
      let video = this.liveCam.nativeElement;
      this.canvas.width = video.videoWidth;
      this.canvas.height = video.videoHeight;
      let ctx = this.canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);
      this.canvas.toBlob((blob:any) => this.preUploadKeyImage(blob), 'image/png');
      this.notification.success('Đang tải file lên hệ thống');
    }
  }
  
  preUploadKeyImage(imgBlob: any) {
    this.uploadingKeyImage = true;
    this.ref.detectChanges();
    let ext = '.png';
    let uploadId = new Date().getTime() * 1000 + '';
    this.slideUploadService.preUpload(uploadId + ext).subscribe({
      next: (res) => {
        if (res.d.isValid) {
          this.uploadKeyImage(imgBlob, uploadId, res.d.jsonData);
        }
      }
    }).add(() => {
      this.uploadingKeyImage = false;
      // this.loadingCamera = false;
    });
  }

  uploadKeyImage(file: any, uploadId:string, newFileName: string) {
    let now = new Date();
    let datePipe = new DatePipe('en-US');
    let createdTime = datePipe.transform(now, 'HH:mm:ss dd/MM/yyyy');
    let fileName = 'livecam_' + datePipe.transform(now, 'ddMMyyyyHHmmss') +'.png';

    let uploadSlideData = INIT_UPLOAD_SLIDE_DATA;
    uploadSlideData.uploadId = uploadId;
    uploadSlideData.fileName = fileName;
    uploadSlideData.newFileName = newFileName;
    uploadSlideData.patientName = this.patientForm.value.patientsName;
    uploadSlideData.caseStudyId = this.caseStudyForm.value.id;
    uploadSlideData.markerType = this.selectedMarkType;
    uploadSlideData.isMotic = Constants.MACHINE_TYPES[2].value;
    uploadSlideData.createTime = now;
    uploadSlideData.userId = this.currentUser.userId!;
    uploadSlideData.userName = this.currentUser.userName!;

    let uploadKeyImageData : IUploadKeyImageData = {
      createKeyImage: true,
      isPrintKeyImage: true,
      keyImageTitle: `Live Cam - ${createdTime}`,
      keyImageNote: '',
    }
    this.slideUploadService.upload(file, uploadSlideData, uploadKeyImageData);
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
      sourceHospitalId: [''],
      modalityDoctorId: [''],
      technicianId: [''],
      specimensCode: [''],
      visitCode: [''],
      quantity: [''],
      numberOfSlideManual: [0],
      createTime: [null],
      specimensDate: [null],
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
    this.loading = true;
    this.caseStudyService.search({ ...this.searchData }).subscribe({
      next: (res) => {
        res.jsonData.data.forEach((r: any) => {
          r.stateLabel = this.reportStates[r.state];
          r.requestTypeLabel = this.requestTypes[r.requestType];
          let htmlChecked = '<i class="pi pi-check text-xl text-green-500 font-bold"></i>'
          r.hasSlide = r.slideCount > 0 ? htmlChecked : '';
          r.hasConclusion = (r.conclusion != null && r.conclusion != "") ? htmlChecked : '';
          r.isApprove = r.state == Constants.REPORT_STATES[4].value ? htmlChecked : '';
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
    } else {
      this.notification.warn('Bạn đang nhập dữ liệu', 'Vui lòng Lưu hoặc Hủy trước khi chuyển sang ca bệnh khác');
    }
  }

  onCreateVisit() {
    this.creatingVisit = true;
    this.resetInfo();
    this.reportForm.controls['readDoctor'].setValue(this.currentUser.userId);
    this.currentReportTemplate = '';
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
    this.currentReportTemplate = '';
  }

  checkDirty() {
    if (this.editingVisit) {
      this.isDirty.caseStudyForm = this.currentInfo.caseStudy != JSON.stringify(this.caseStudyForm.value);
      this.isDirty.patientForm = this.currentInfo.patient != JSON.stringify(this.patientForm.value);
      this.isDirty.reportForm = this.currentInfo.report != JSON.stringify(this.reportForm.value);
    } else if (this.creatingVisit) {
      this.isDirty.caseStudyForm = true;
      this.isDirty.patientForm = true;
      this.isDirty.reportForm = true;
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
            this.onSearch(this.INIT_SEARCH_CASE_STUDY);
            this.notification.success('Tạo ca khám thành công');
          } else {
            this.onSearch(this.searchData);
            this.notification.success('Cập nhật ca khám thành công');
          }
          this.patientForm.patchValue(res.jsonData.patient);
          this.caseStudyForm.patchValue({
            ...res.jsonData.caseStudy,
            createTime: new Date(res.jsonData.caseStudy.createdTime),
            specimensDate: res.jsonData.caseStudy.specimensDate ?
              new Date(res.jsonData.caseStudy.specimensDate) : null,
          });
          this.reportForm.patchValue(res.jsonData.report);
          this.selectedCaseStudy = {
            caseStudyId: res.jsonData.caseStudy.id
          };
        }
      }
    }).add(() => {
      this.saving = false;
      this.creatingVisit = false;
      this.editingVisit = false;
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
          // this.onEditVisit();
          this.reportForm.controls['state'].setValue(Constants.REPORT_STATES[2].value);
        }
      }
    }).add(() => {
      this.visibleConfirmUnapprove = false;
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
            specimensDate: res.jsonData.specimensDate ?
              new Date(res.jsonData.specimensDate) : null,
          });
          this.printedKeyImages = res.jsonData.printKeyImages ?? [];
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
    let caseStudyId = this.selectedCaseStudy.caseStudyId ?
      new String(this.selectedCaseStudy.caseStudyId) : this.caseStudyForm.value.id;
    if (caseStudyId) {
      this.keyImageService.getCaseStudyKeyImages(caseStudyId+'').subscribe({
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
    this.searchData.page = 1;
    this.caseStudyTable.selectedCaseStudy = {};
    this.selectedCaseStudy = {};
    this.caseStudies = [];
    this.relatedCaseStudies = [];
    this.caseStudyTable.resetScrollTop();
    this.lastMaxStart = -1;
    this.search();
  }

  onCancelSearch() {
    this.searchData = this.currentSearchData!;
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

  onCreateKeyImage() {
    this.uploadPatientName = this.patientForm.value.patientsName;
    this.uploadedCaseStudyId = new String(this.caseStudyForm.value.id);
    this.visibleUploadKeyImage = true;
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
    let datePipe = new DatePipe('en-US');
    let createdTime = datePipe.transform(new Date(this.caseStudyForm.value.createTime), 'HH:mm:ss dd/MM/yyyy');
    let newTab: IViewerTab = {
      caseStudyId: this.caseStudyForm.value.id,
      patientsName: this.patientForm.value.patientsName,
      createdTime: createdTime!
    }
    this.viewerState.openTab(newTab);
  }

  onShareCaseStudy(data: any) {
    this.sharedCaseStudyId = data.caseStudyId;
    this.visibleSharedCaseStudy = true;
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
            if (d.roles && d.roles.includes(Roles.DOCTOR_READ)) {
              this.doctors.push({
                username: d.username,
                fullname: d.fullname,
                id: d.id
              });
            }
          });
        }
      }
    });
  }

  getOrderDoctors() {
    this.orderDoctorService.getAll().subscribe({
      next: (res) => {
        if (res.isValid) {
          this.orderDoctors = res.jsonData;
        }
      }
    });
  }

  getTechnicians() {
    this.technicianService.getAll().subscribe({
      next: (res) => {
        if (res.isValid) {
          this.technicians = res.jsonData;
        }
      }
    });
  }

  getSourceHospitals() {
    this.sourceHospitalService.getAll().subscribe({
      next: (res) => {
        if (res.isValid) {
          this.sourceHospitals = res.jsonData;
        }
      }
    });
  }

  getReportTemplates() {
    this.reportTemplateService.getList().subscribe({
      next: (res) => {
        if (res.isValid) {
          this.reportTemplates = res.jsonData;
          this.reportTemplates.forEach(t => {
            t.label = t.code + ' - ' + t.templateName;
          });
        }
      }
    });
  }

  setReportTemplate(event:any) {
    let id = event.value;
    if (id) {
      let reportTemplate = this.reportTemplates.find(t => t.id == id);
      if (reportTemplate) {
        this.reportForm.controls['microbodyDescribe'].setValue(Utils.extractContent(reportTemplate.microbodyDescrible));
        this.reportForm.controls['consultation'].setValue(Utils.extractContent(reportTemplate.consultation));
        this.reportForm.controls['diagnose'].setValue(Utils.extractContent(reportTemplate.diagnose));
      }
    }
  }
  
  getMarkTypes() {
    this.markTypeService.getAll().subscribe({
      next: (res) => {
        if (res.isValid) {
          this.markTypes = res.jsonData;
        }
      }
    });
  }

  openKeyImage(index=0) {
    this.activeKeyImageIndex = index;
    this.visibleKeyImages = true;
  }

  exportReport() {
    this.loadingExport = true;
    this.caseStudyService.exportReport(this.searchData).subscribe({
      next: (res) => {
        if (res.body) {
          let now = new Date();
          let datePipe = new DatePipe('en-US');
          let createdTime = datePipe.transform(now, 'HHmmss_ddMMyyyy');
          let fileName = `Bao-cao-DPS-${createdTime}.xlsx`;
          saveAs(res.body, fileName);
        }
      }
    }).add(() => {
      this.loadingExport = false;
    });
  }

  removePrintedKeyImage(id: string) {
    let i = this.printedKeyImages.indexOf(id);
    if (i > -1) {
      this.printedKeyImages.splice(i, 1);
      this.savePrintedKeyImages();
    }
  }

  addPrintedKeyImage(id: string) {
    if (this.printedKeyImages.indexOf(id)==-1) {
      this.printedKeyImages.push(id);
      this.savePrintedKeyImages();
    }
  }

  savePrintedKeyImages() {
    let payload = {
      caseStudyId: this.caseStudyForm.value.id,
      keyImageIds: this.printedKeyImages
    };
    this.caseStudyService.savePrintedKeyImages(payload).subscribe({
      next: (res) => {
      }
    });
  }
}
