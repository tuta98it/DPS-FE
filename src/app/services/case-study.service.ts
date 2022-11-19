import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class CaseStudyService extends BaseService {
  override url = '/CaseStudy';
}
