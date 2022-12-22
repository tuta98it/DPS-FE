import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {
  override url = '/Report';
  
  getCaseStudyReports(caseStudyId: string): Observable<any> {
    return this.get(`${this.url}/CaseStudy/${caseStudyId}`);
  }
  
  unapprove(reportId: string) {
    return this.get(`${this.url}/UnApprove/${reportId}`);
  }
  
  updateReport(data: any) {
    return this.post(`${this.url}/Read/${data.id}`, data);
  }
}
