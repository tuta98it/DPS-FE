import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { IUploadKeyImageData } from 'src/app/models/upload-key-image-data';
import { INIT_UPLOAD_SLIDE_DATA } from 'src/app/models/upload-slide-data';
import { MarkTypeService } from 'src/app/services/mark-type.service';
import { SlideUploadService } from 'src/app/services/slide-upload.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'upload-key-image',
  templateUrl: './upload-key-image.component.html',
  styleUrls: ['./upload-key-image.component.scss']
})
export class UploadKeyImageComponent implements OnInit {
  MACHINE_TYPES = Constants.MACHINE_TYPES;

  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
    if (value) {
      this.uploadForm.controls['createTime'].setValue(new Date());
      this.uploading = false;
      this.isPrintKeyImage = true;
    } else {
      this.resetUploadForm();
    }
  }
  get visible() {
    return this._visible;
  }

  _patientName = '';
  @Input() set patientName(value: string) {
    this._patientName = value;
    this.header = `Thêm hình ảnh - Bệnh nhân ${this.patientName}`;
  }
  get patientName() {
    return this._patientName;
  }
  @Output() visibleChange = new EventEmitter<any>();
  header = '';
  @Input() caseStudyId = new String('');

  uploadForm: FormGroup;
  markTypes: any[] = [];
  fileName = '';
  file: any = null;
  @ViewChild("uploadSlideContainer") uploadSlideContainer!: ElementRef;
  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;

  uploading = false;

  isPrintKeyImage = true;

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private uploadService: SlideUploadService,
    private authState: AuthStateService,
    private markTypeService: MarkTypeService,
  ) { 

    this.uploadForm = this.fb.group({
      createTime: [new Date(), [Validators.required]],
      markerType: ['', [Validators.required]],
      title: ['', [Validators.required]],
      note: [''],
    });
    
    this._authSubscription = this.authState.subscribe( (m: IAuthModel) => {
      this.currentUser = m;
    });
  }

  ngOnInit(): void {
    this.getMarkTypes();
  }

  onSave() {
    if (this.uploadForm.valid) {
      if (!this.fileName) {
        this.notification.error('Vui lòng chọn file');
      } else {
        this.notification.success('Đang tải file lên hệ thống');
        this.preUpload();
      }
    } else {
      Object.values(this.uploadForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  preUpload() {
    this.uploading = true;
    let ext = this.fileName.slice(this.fileName.lastIndexOf("."));
    if (ext != '') {
      ext = ext.toLocaleLowerCase();
    }
    let uploadId = new Date().getTime() * 1000 + '';
    this.uploadService.preUpload(uploadId + ext).subscribe({
      next: (res) => {
        if (res.d.isValid) {
          this.upload(uploadId, res.d.jsonData);
        }
      }
    }).add(() => {
      this.visible = false;
      this.uploading = false;
    });
  }

  upload(uploadId:string, newFileName: string) {
    let uploadSlideData = INIT_UPLOAD_SLIDE_DATA;
    uploadSlideData.uploadId = uploadId;
    uploadSlideData.fileName = this.fileName;
    uploadSlideData.newFileName = newFileName;
    uploadSlideData.patientName = this.patientName;
    uploadSlideData.caseStudyId = this.caseStudyId.toString();
    uploadSlideData.markerType = this.uploadForm.value.markerType;
    uploadSlideData.isMotic = this.MACHINE_TYPES[2].value;
    uploadSlideData.createTime = this.uploadForm.value.createTime;
    uploadSlideData.userId = this.currentUser.userId!;
    uploadSlideData.userName = this.currentUser.userName!;

    let uploadKeyImageData : IUploadKeyImageData = {
      createKeyImage: true,
      isPrintKeyImage: this.isPrintKeyImage,
      keyImageTitle: this.uploadForm.value.title,
      keyImageNote: this.uploadForm.value.note,
    }
    this.uploadService.upload(this.file, uploadSlideData, uploadKeyImageData);
    this.resetUploadForm();
  }

  resetUploadForm() {
    this.uploadForm.reset();
    this.uploadForm.controls['createTime'].setValue(new Date());
    this.uploadForm.markAsPristine();
    this.file = null;
    this.fileName = '';
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

  onUpload(event: any) {
    let inputUpload = this.uploadSlideContainer.nativeElement.querySelector('#dps-upload-slide');
    if (inputUpload.files.length > 0) {
      this.file = inputUpload.files[0];
      this.fileName = this.file.name;
    }
    // inputUpload.value = null;
  }
}
