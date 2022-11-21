import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class PatientService extends BaseService {
  override url = '/Patient';
  createPatient(isCheckDuplicate=true, data: any): Observable<any> {
    return this.post(`${this.url}/${isCheckDuplicate}`, data);
  }
}
