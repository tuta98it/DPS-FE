import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class SourceHospitalService extends BaseService {
    override url = '/SourceHospital';

}
