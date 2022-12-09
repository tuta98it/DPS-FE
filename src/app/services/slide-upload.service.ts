import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INIT_UPLOAD_KEY_IMAGE_DATA } from '../models/upload-key-image-data';
import { AppConfigService } from '../shared/app-config.service';
import { NotificationStateService } from '../shared/app-state/notification-state.service';
import { Constants } from '../shared/constants/constants';
import Utils from '../shared/helpers/utils';
import { NotificationService } from '../shared/notification.service';

const BYTES_PER_CHUNK = 10 * 1024 * 1024; // sample chunk sizes. 10MB

@Injectable({
  providedIn: 'root'
})
export class SlideUploadService {
  baseUrl = '';

  constructor(
    public httpClient: HttpClient,
    protected configService: AppConfigService,
    private notificationState: NotificationStateService,
    private notification: NotificationService,
  ) {
    this.baseUrl = this.configService.getConfig().deepzoom.baseUrl;
  }

  preUpload(fileName: any): Observable<any> {
    return this.httpClient.post(
      `${this.baseUrl}/api/Upload/preUpload`,
      { FileName: fileName },
      {
        headers: {
          contentType: "application/json; charset=utf-8"
        },
      },
    );
  }
  
  upload(fileParam: any, dataParam: any, keyImageData=INIT_UPLOAD_KEY_IMAGE_DATA) {
    let file = new File([fileParam], fileParam.name, { type: fileParam.type });
    let data = JSON.parse(JSON.stringify(dataParam));
    let chunkCount = 0;
    let totalChunk = 0;
    let $this = this;
    let uploadProgress = 0;
    function setUploadProgress(value: number) {
      uploadProgress = value;
      $this.notificationState.updateProgress(data.uploadId, value);
    }
    function uploadFile() {
      let SIZE = file.size;
      let start = 0;
      let end = BYTES_PER_CHUNK;
      chunkCount = 0;
      totalChunk = SIZE % BYTES_PER_CHUNK == 0 ? SIZE / BYTES_PER_CHUNK : Math.floor(SIZE / BYTES_PER_CHUNK) + 1;
      $this.notificationState.addNotification({
        id: data.uploadId,
        patientName: data.patientName,
        fileName: data.fileName,
        fileSize: SIZE,
        fileSizeStr: Utils.humanFileSize(SIZE),
        uploadProgress: 0,
        state: Constants.UPLOAD_STATUS.UPLOADING
      });
      // recursive upload
      uploadOne(start, end);
    }
    function uploadOne(start: number, end: number) {
      let chunk = file.slice(start, end);
      let _xhr = new XMLHttpRequest();
      _xhr.onload = function () {
        chunkCount = chunkCount + 1;
        start = end;
        end = start + BYTES_PER_CHUNK;
        if (chunkCount < totalChunk) {
          uploadOne(start, end);
        } else if (chunkCount == totalChunk) {
          uploadComplete();
        }
      };
      function onProgress(e: any) {
        if (e.lengthComputable) {
          let _loadedAll = chunkCount * BYTES_PER_CHUNK;
          let percentComplete = ((_loadedAll + e.loaded) / file.size) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      };
      _xhr.upload.addEventListener('progress', onProgress, false);
      _xhr.open("POST", `${$this.baseUrl}/Upload/MultiUpload/${data.newFileName}/${chunkCount}`, true);
      _xhr.send(chunk);
    }
    function uploadComplete() {
      let formData = new FormData();
      
      formData.append('fileName', data.newFileName);
      formData.append('originFileName', data.fileName);
      formData.append('fileSize', file.size.toString()); // in byte
      formData.append('completed', 'true');
      formData.append('caseStudyId', data.caseStudyId);
      formData.append('markerType', data.markerType);
      formData.append('isMotic', data.isMotic)
      formData.append('createTime', data.createTime);
      formData.append('userId', data.userId!);
      formData.append('username', data.userName!);
      formData.append('createKeyImage', keyImageData.createKeyImage+'');
      formData.append('isPrintKeyImage', keyImageData.isPrintKeyImage+'');
      formData.append('keyImageTitle', keyImageData.keyImageTitle);
      formData.append('keyImageNote', keyImageData.keyImageNote);
  
      let xhr2 = new XMLHttpRequest();
      xhr2.onreadystatechange = function () {
        if (xhr2.readyState == XMLHttpRequest.DONE) {
          let res = JSON.parse(xhr2.responseText);
          if (res.d.isValid) {
            $this.notification.success('Đã tải lên. Đang đợi server xử lí', '');
            $this.notificationState.updateState(data.uploadId, Constants.UPLOAD_STATUS.PROCESSING);
          }
          else {
            $this.notification.error('Không thể tải lên', res.d.errors[0].errorMessage);
            $this.notificationState.removeNotification(data.uploadId);
          }
        }
      };
      xhr2.open("POST", `${$this.baseUrl}/Upload/UploadComplete`, true); //combine the chunks together
      xhr2.send(formData);
    }
    uploadFile();
  }
}
