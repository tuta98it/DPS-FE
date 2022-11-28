import { Injectable } from '@angular/core';
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
  getListSlideOfCaseStudy(studyId: string) {
    return this.get(`${this.listSlideUrl}/${studyId}`);
  }
  getListKeyImageOfSlide(slideId: string) {
    return this.get(`${this.listKeyImageUrl}/${slideId}`);
  }
}
