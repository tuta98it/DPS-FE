import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ISlideNotification } from 'src/app/models/slide-notification';
import { Constants } from '../constants/constants';
@Injectable({
  providedIn: 'root'
})
export class NotificationStateService {
  protected notificationsSubject: BehaviorSubject<ISlideNotification[]>;
  protected notifications:ISlideNotification[] = [];

  constructor() {
    this.notificationsSubject = new BehaviorSubject<ISlideNotification[]>(this.notifications);
  }

  public subscribeNotifications(callback: (data: ISlideNotification[]) => void): Subscription {
    return this.notificationsSubject.subscribe(callback);
  }

  public dispatchNotifications(notifications: ISlideNotification[]): void {
    // const dispatchedModel: ISlideNotification[] = JSON.parse(JSON.stringify(notifications));
    // this.notificationsSubject.next(dispatchedModel);
    this.notificationsSubject.next(notifications);
  }

  public updateProgress(id: string, progress: number) {
    this.notifications.forEach(n => {
      if (n.id == id) {
        n.uploadProgress = progress;
      }
    });
    this.dispatchNotifications(this.notifications);
  }

  public updateProcessing(id: string) {
    this.notifications.forEach(n => {
      if (n.id == id) {
        n.state = Constants.UPLOAD_STATUS.PROCESSING;
      }
    });
    this.dispatchNotifications(this.notifications);
  }

  public addNotification(newNotification: ISlideNotification) {
    this.notifications.push(newNotification);
    this.dispatchNotifications(this.notifications);
  }

  public removeNotification(id: string) {
    let i = this.notifications.findIndex(n => n.id == id);
    if (i > -1) {
      this.notifications.splice(i, 1);
      this.dispatchNotifications(this.notifications);
    }
  }
}
