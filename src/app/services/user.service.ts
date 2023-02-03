import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  override url = '/User';
  getUserRoles(data: any): Observable<any> {
    return this.post(`${this.url}/Role`, data);
  }
  getUsers(data: any): Observable<any> {
    return this.post(`${this.url}/Get`, data);
  }
  registerUser(payload: any): Observable<any> {
    return this.post(`${this.url}/Register`,payload);
  }
  updateDisable(id: any): Observable<any> {
    return this.get(`${this.url}/Disable/${id}`);
  }
  addUsername(payload: any): Observable<any> {
    return this.post(`${this.url}/Username`, payload);
  }
}
