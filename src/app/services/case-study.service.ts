import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class CaseStudyService extends BaseService {
  override url = '/CaseStudy';
  addTemporaryCaseStudy() {
    return this.post(`${this.url}/AddTemporaryCaseStudy`, '');
  }
  getCaseStudyOfPatient(patientId: string) {
    return this.get(`${this.url}/Patient/${patientId}`);
  }
}
