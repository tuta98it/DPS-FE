import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class BodyPartService extends BaseService {
  override url = '/BodyPart';
  toggle(id: any): Observable<any> {
    return this.get(`${this.url}/Toggle/${id}`);
  }
}
