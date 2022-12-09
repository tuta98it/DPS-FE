import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class ReportTemplateService extends BaseService {
  override url = '/Template';

  // get list in array, instead of tree
  getList() {
    return this.get(`${this.url}/List`);
  }
}
