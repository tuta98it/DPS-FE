import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class UserSettingsService extends BaseService {
  override url = '/UserSettings';
  
  getUserSettings(): Observable<any> {
    return this.get(`${this.url}`);
  }
  saveUserSetting(payload: any): Observable<any> {
    return this.put(`${this.url}`, payload);
  }
  saveKeyImageSettings(payload: any): Observable<any> {
    return this.put(`${this.url}/KeyImage`, payload);
  }
}
