import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { StorageKeys } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class ViewerStateService {
  protected currentCaseSubject: BehaviorSubject<string>;
  protected currentCaseId = '';

  constructor()
  {
    this.currentCaseSubject = new BehaviorSubject<string>(this.currentCaseId);
  }
  
  public subscribeCurrentCase(callback: (data: string) => void): Subscription {
    return this.currentCaseSubject.subscribe(callback);
  }

  public dispatchCurrentCase(data: string): void {
    this.currentCaseId = data;
    this.currentCaseSubject.next(data);
  }
}
