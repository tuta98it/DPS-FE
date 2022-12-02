import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class KeyImageService extends BaseService {
  override url = '/KeyImage';
  getCaseStudyKeyImages(caseStudyId: string): Observable<any> {
    return this.get(`${this.url}/Casestudy/${caseStudyId}`);
  }
}
