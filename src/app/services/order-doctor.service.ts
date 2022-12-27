import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class OrderDoctorService extends BaseService {
  override url = '/OrderDoctor';
}
