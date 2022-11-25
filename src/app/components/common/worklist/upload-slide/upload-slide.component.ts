import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarkTypeService } from 'src/app/services/mark-type.service';
import { SlideUploadService } from 'src/app/services/slide-upload.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';

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
      this.uploadForm.reset();
    }
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();
  @Input() header = '';

  uploadForm: FormGroup;
  markTypes: any[] = [];
  fileName: any = null;
  file: any = null;
  @ViewChild("uploadSlideContainer") uploadSlideContainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private uploadService: SlideUploadService,
    private markTypeService: MarkTypeService,
  ) { 
    this.uploadForm = this.fb.group({
      createTime: [new Date(), [Validators.required]],
      markerType: ['', [Validators.required]],
      isMotic: ['', [Validators.required]],
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

    let newFileName = new Date().getTime() * 1000 + ext;
    this.uploadService.preUpload(newFileName).subscribe({
      next: (res) => {
        if (res.isValid) {
          
        }
      }
    });
  }

//   uploadFiles() {
//     var blob = file;
//     var SIZE = blob.size;
//     FILE_SIZE = blob.size;
//     //upload content
//     var start = 0;
//     var end = BYTES_PER_CHUNK;
//     completed = 0;
//     count = SIZE % BYTES_PER_CHUNK == 0 ? SIZE / BYTES_PER_CHUNK : Math.floor(SIZE / BYTES_PER_CHUNK) + 1;
//     // cập nhật id file đó cho _currentUploading File
//     _currentUploadingFile = fileName.slice(0, 16);

//     //upload đệ quy
//     uploadOne(blob, start, end, caseId, fileName);
//     //hiển thị file đó trong tiến trình
//     shiftQueueElm(_pendingUploadList);
// }

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
      this.fileName = inputUpload.files[0].name;
    }
    console.log('onUpload', event, inputUpload.files);
  }
}
