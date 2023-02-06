import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class CaseStudyService extends BaseService {
  override url = '/CaseStudy';
  listSlideUrl = '/Slide' + this.url;
  listKeyImageUrl = '/KeyImage/Slide';

  addTemporaryCaseStudy() {
    return this.post(`${this.url}/AddTemporaryCaseStudy`, '');
  }

  getCaseStudyOfPatient(patientId: string) {
    return this.get(`${this.url}/Patient/${patientId}`);
  }

  updateCaseStudy(data: any) {
    return this.put(`${this.url}`, data);
  }

  getCaseStudyInfo(studyId: string) {
    return this.get(`${this.url}/${studyId}/info`);
  }

  getCaseStudyReportInfo(reportId: string) {
    return this.get(`${this.url}/Report/${reportId}`);
  }

  getListSlideOfCaseStudy(studyId: string) {
    return this.get(`${this.listSlideUrl}/${studyId}`);
  }
  
  getPrintedKeyImages(studyId: string) {
    return this.get(`${this.url}/PrintKeyImage/${studyId}`);
  }

  getListKeyImageOfSlide(slideId: string) {
    return this.get(`${this.listKeyImageUrl}/${slideId}`);
  }

  deleteKeyImage(keyImageId: string) {
    return this.delete(`/KeyImage/`, keyImageId);
  }

  exportReport(data: any): Observable<HttpResponse<Blob>> {
    return this.httpClient.post<Blob>(`${this.baseUrl+this.url}/Export`, data, { observe: 'response', responseType: 'blob' as 'json' });
  }

  savePrintedKeyImages(data: any) {
    return this.post(`${this.url}/PrintKeyImages`, data);
  }

  markAsPrinted(studyId: string) {
    return this.get(`${this.url}/Print/${studyId}`);
  }

  //for shared token
  getCaseStudyInfoByToken(studyId: string, sharedToken: string) {
    return this.get(`${this.url}/${sharedToken}/InfoByToken`);
  }
  getListKeyImageOfSlideByToken(slideId: string, sharedToken: string) {
    return this.get(`${this.listKeyImageUrl}/Share/${sharedToken}/${slideId}`);
  }
}
