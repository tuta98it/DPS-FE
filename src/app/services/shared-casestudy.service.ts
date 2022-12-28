import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class SharedCasestudyService extends BaseService {
  override url = '/SharedCasestudy';
  getCaseStudyLinks(caseStudyId: string) {
    return this.get(`${this.url}/CaseStudy/${caseStudyId}`);
  }
}
