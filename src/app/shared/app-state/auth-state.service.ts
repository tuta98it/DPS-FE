import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  protected subject: BehaviorSubject<IAuthModel>;
  protected model: IAuthModel;

  // TODO add a select method to this class that allows selection of a copy of the model
  constructor()
  {
    this.model   = JSON.parse(JSON.stringify(INIT_AUTH_MODEL));
    this.subject = new BehaviorSubject<IAuthModel>(this.model);
  }
  
  public subscribe(callback: (model: IAuthModel) => void): Subscription {
    return this.subject.subscribe(callback);
  }

  public dispatch(payload: any | null): void {
    const data: Partial<IAuthModel> = payload as Partial<IAuthModel>;
    this.model = {...this.model, ...data};

    const dispatchedModel: IAuthModel = JSON.parse(JSON.stringify(this.model));

    this.subject.next(dispatchedModel);
  }
}
