import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class PrintTemplateService extends BaseService {
  override url = '/Form';

  getListCommonInfos() {
    return this.get(`/CommonInfo`);
  }

  searchForms(keyword: String, page: any, pageSize: any) {
    let data = {
      keyword: keyword,
      take: pageSize,
      skip: (page - 1) * pageSize
    };
    return this.post(`${this.url}/Search`, data);
  }

  getFormData(formId: String) {
    return this.get(`${this.url}/${formId}`);
  }

  saveFormData(formData: String) {
    return this.post(`${this.url}`, formData);
  }
}
