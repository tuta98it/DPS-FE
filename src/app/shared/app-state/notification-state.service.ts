import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationStateService {
  protected currentNotificationsSubject: BehaviorSubject<any[]>;
  protected currentNotifications:any[] = [];

  constructor() {
    this.currentNotificationsSubject = new BehaviorSubject<any[]>(this.currentNotifications);
  }

  public subscribeCurrentNotifications(callback: (data: any[]) => void): Subscription {
    return this.currentNotificationsSubject.subscribe(callback);
  }

  public dispatchCurrentNotifications(): void {
    const dispatchedModel: any[] = JSON.parse(JSON.stringify(this.currentNotifications));
    this.currentNotificationsSubject.next(dispatchedModel);
  }

  public addNotification(newNotification: any) {
    this.currentNotifications.push(newNotification);
    this.dispatchCurrentNotifications();
  }

  public removeNotification(id: string) {
    let i = this.currentNotifications.findIndex(n => n.id == id);
    if (i > -1) {
      this.currentNotifications.splice(i, 1);
      this.dispatchCurrentNotifications();
    }
  }
}
