import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService extends BaseService {
  override url = '/FileUpload';
  upload(fileParam: Blob): Observable<any> {
    let file = new Blob([fileParam], { type: fileParam.type })
    const formData: FormData = new FormData();
    formData.append('FormFile', file, 'temp.png');

    return this.post(`${this.url}/Upload`, formData);
  }
}
