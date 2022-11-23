import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  override url = '/User';
  getUserRoles(data: any): Observable<any> {
    return this.post(`/${this.url}/Role`, data);
  }
  getUsers(data: any): Observable<any> {
    return this.post(`/${this.url}/Get`, data);
  }
}
