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

  check(reportId: string) {
    return this.get(`${this.url}/Check/${reportId}`);
  }

  discard(reportId: string) {
    return this.get(`${this.url}/Discard/${reportId}`);
  }

  reading(reportId: string) {
    return this.get(`${this.url}/Reading/${reportId}`);
  }

  approving(reportId: string) {
    return this.get(`${this.url}/Approving/${reportId}`);
  }
  
  approveReport(report: any) {
    return this.post(`${this.url}/ApproveReport/${report.id}`, report);
  }
}
