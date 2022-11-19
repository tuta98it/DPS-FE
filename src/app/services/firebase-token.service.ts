import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseTokenService extends BaseService {
  save(payload: any): Observable<any> {
    return this.post("/SaveToken", payload);
  }
}
