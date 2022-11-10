import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class PrintTemplateService extends BaseService {
  url = '/PrintTemplate';
}
