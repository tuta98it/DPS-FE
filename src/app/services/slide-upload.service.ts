import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '../shared/app-config.service';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class SlideUploadService {
  baseUrl = '';

  constructor(
    public httpClient: HttpClient,
    protected configService: AppConfigService
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
}
