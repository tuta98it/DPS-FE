import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class ReportTemplateService extends BaseService {
  override url = '/Template';
}
