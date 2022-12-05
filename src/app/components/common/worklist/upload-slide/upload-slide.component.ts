import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { MarkTypeService } from 'src/app/services/mark-type.service';
import { SlideUploadService } from 'src/app/services/slide-upload.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { NotificationStateService } from 'src/app/shared/app-state/notification-state.service';
import { Constants } from 'src/app/shared/constants/constants';
import Utils from 'src/app/shared/helpers/utils';
import { NotificationService } from 'src/app/shared/notification.service';
const BYTES_PER_CHUNK = 10 * 1024 * 1024; // sample chunk sizes. 10MB

@Component({
  selector: 'upload-slide',
  templateUrl: './upload-slide.component.html',
  styleUrls: ['./upload-slide.component.scss']
})
export class UploadSlideComponent implements OnInit {
  MACHINE_TYPES = Constants.MACHINE_TYPES;

  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
    if (value) {
      this.uploadForm.controls['createTime'].setValue(new Date());
    } else {
      // this.uploadForm.reset();
      this.uploadForm.markAsPristine();
    }
  }
  get visible() {
    return this._visible;
  }

  _patientName = '';
  @Input() set patientName(value: string) {
    this._patientName = value;
    this.header = `Thêm lam kính - Bệnh nhân ${this.patientName}`;
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
  newFileName = '';
  file: any = null;
  chunkCount = 0;
  totalChunk = 0;
  uploadId = '';
  _uploadProgress = 0;
  set uploadProgress(value: number) {
    this._uploadProgress = value;
    this.notificationState.updateProgress(this.uploadId, value);
  }
  get uploadProgress() {
    return this._uploadProgress;
  }
  @ViewChild("uploadSlideContainer") uploadSlideContainer!: ElementRef;
  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private uploadService: SlideUploadService,
    private notificationState: NotificationStateService,
    private authState: AuthStateService,
    private markTypeService: MarkTypeService,
  ) { 
    this.uploadForm = this.fb.group({
      createTime: [new Date(), [Validators.required]],
      markerType: ['', [Validators.required]],
      isMotic: ['', [Validators.required]],
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
    let ext = this.fileName.slice(this.fileName.lastIndexOf("."));
    if (ext != '') {
      ext = ext.toLocaleLowerCase();
    }
    this.uploadId = new Date().getTime() * 1000 + '';
    this.newFileName = this.uploadId + ext;
    this.uploadService.preUpload(this.newFileName).subscribe({
      next: (res) => {
        if (res.d.isValid) {
          this.newFileName = res.d.jsonData;
          this.uploadFile();
        }
      }
    });
  }

  uploadFile() {
    let SIZE = this.file.size;
    let start = 0;
    let end = BYTES_PER_CHUNK;
    this.chunkCount = 0;
    this.totalChunk = SIZE % BYTES_PER_CHUNK == 0 ? SIZE / BYTES_PER_CHUNK : Math.floor(SIZE / BYTES_PER_CHUNK) + 1;
    this.notificationState.addNotification({
      id: this.uploadId,
      patientName: this.patientName,
      fileName: this.fileName,
      fileSize: SIZE,
      fileSizeStr: Utils.humanFileSize(SIZE),
      uploadProgress: 0,
      state: Constants.UPLOAD_STATUS.UPLOADING
    });
    // recursive upload
    this.uploadOne(start, end);
  }

  uploadOne(start: number, end: number) {
    let chunk = this.file.slice(start, end);
    let _xhr = new XMLHttpRequest();
    let $this = this;
    _xhr.onload = function () {
      $this.chunkCount = $this.chunkCount + 1;
      start = end;
      end = start + BYTES_PER_CHUNK;
      if ($this.chunkCount < $this.totalChunk) {
        $this.uploadOne(start, end);
      } else if ($this.chunkCount == $this.totalChunk) {
        $this.uploadComplete();
      }
    };
    function onProgress(e: any) {
      if (e.lengthComputable) {
        let _loadedAll = $this.chunkCount * BYTES_PER_CHUNK;
        let percentComplete = ((_loadedAll + e.loaded) / $this.file.size) * 100;
        
        $this.uploadProgress = Math.round(percentComplete);
      }
    };
    _xhr.upload.addEventListener('progress', onProgress, false);
    _xhr.open("POST", `${this.uploadService.baseUrl}/Upload/MultiUpload/${this.newFileName}/${this.chunkCount}`, true);
    _xhr.send(chunk);
  }

  uploadComplete() {
    let formData = new FormData();
    
    formData.append('fileName', this.newFileName);
    formData.append('originFileName', this.fileName);
    formData.append('fileSize', this.file.size); // in byte
    formData.append('completed', 'true');
    formData.append('caseStudyId', this.caseStudyId.toString());
    formData.append('markerType', this.uploadForm.value.markerType);
    formData.append('isMotic', this.uploadForm.value.isMotic)
    formData.append('createTime', this.uploadForm.value.createTime);
    formData.append('userId', this.currentUser.userId!);
    formData.append('username', this.currentUser.userName!);

    let $this = this;
    let xhr2 = new XMLHttpRequest();
    xhr2.onreadystatechange = function () {
        if (xhr2.readyState == XMLHttpRequest.DONE) {
            let res = JSON.parse(xhr2.responseText);
            if (res.d.isValid) {
              $this.notification.success('Đã tải lên. Đang đợi server xử lí', '');
              $this.visible = false;
              $this.notificationState.updateState($this.uploadId, Constants.UPLOAD_STATUS.PROCESSING);
            }
            else {
              $this.notification.error('Không thể tải lên', res.d.errors[0].errorMessage);
              $this.notificationState.removeNotification($this.uploadId);
            }
        }
    };
    xhr2.open("POST", `${this.uploadService.baseUrl}/Upload/UploadComplete`, true); //combine the chunks together
    xhr2.send(formData);
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
  }
}
