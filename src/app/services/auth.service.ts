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
}