import { Injectable } from '@angular/core';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class MarkTypeService extends BaseService {
  override url = '/MarkType';
}
