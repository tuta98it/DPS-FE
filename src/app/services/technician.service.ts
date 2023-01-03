import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
@Injectable({
  providedIn: 'root'
})
export class TechnicianService extends BaseService  {
  override url = '/Technician';
}
