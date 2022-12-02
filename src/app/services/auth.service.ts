import { Constants } from 'src/app/shared/constants/constants';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "./base-service";

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {
  login(payload: any): Observable<any> {
    return this.post('/login', payload);
  }

  logout(): Observable<any> {
    let token = localStorage.getItem(Constants.FIREBASE_TOKEN);
    let headers = { 'FB_Token': token };

    return this.post('/logout', null, {}, '', headers);
  }
}