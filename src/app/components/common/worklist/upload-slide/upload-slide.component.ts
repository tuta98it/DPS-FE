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
  @Input() caseStudyId = '';

  uploadForm: FormGroup;
  markTypes: any[] = [];
  fileName: any = null;
  file: any = null;
  lastChunkCount = 0;
  totalChunk = 0;

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
//     const BYTES_PER_CHUNK = 1024 * 1024 * 1024; // sample chunk sizes. 1Gb
//     let SIZE = this.file.size;
//     //upload content
//     let start = 0;
//     let end = BYTES_PER_CHUNK;
//     this.lastChunkCount = 0;
//     this.totalChunk = SIZE % BYTES_PER_CHUNK == 0 ? SIZE / BYTES_PER_CHUNK : Math.floor(SIZE / BYTES_PER_CHUNK) + 1;
   
//     //upload đệ quy
//     uploadOne(start, end);
//   }

//   uploadOne(start: number, end: number) {
//     let chunk = this.file.slice(start, end);
//     let _xhr = new XMLHttpRequest();
//     let $this = this;
//     _xhr.onload = function () {
//         $this.lastChunkCount = $this.lastChunkCount + 1;
//         start = end;
//         end = start + BYTES_PER_CHUNK;
//         console.log("x:", $this.lastChunkCount);
//         if ($this.lastChunkCount < count) {
//             uploadOne(blob, start, end, caseId, fileName);
//         } else if ($this.lastChunkCount == count) {
//             uploadComplete(blob, caseId, fileName);
//         }
//     };
//     _xhr.upload.addEventListener('progress', onProgress, false);
//     _xhr.open("POST", `/Upload/MultiUpload/${fileName}/${this.lastChunkCount}`, true);
//     _xhr.send(chunk);
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
      this.file = inputUpload.files[0];
      this.fileName = this.file.name;
    }
    console.log('onUpload', event, inputUpload.files);
  }
}
