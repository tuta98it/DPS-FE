import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class VisitService extends BaseService {
  override url = '/Visit';
  saveVisit(payload: any) {
    return this.post(`${this.url}/Save`, payload);
  }
}
