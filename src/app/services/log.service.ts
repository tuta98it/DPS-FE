import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class LogService extends BaseService {
  override url = '/Log';
  getCaseStudyHistory(caseStudyId: string) {
    return this.get(`${this.url}/Casestudy/${caseStudyId}`);
  }
}
