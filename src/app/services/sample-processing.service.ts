import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
@Injectable({
  providedIn: 'root'
})
export class SampleProcessingService extends BaseService  {
  override url = '/Technician';
}
