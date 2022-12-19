import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ISlideNotification } from 'src/app/models/slide-notification';
import { SlideService } from 'src/app/services/slide.service';
import { NotificationStateService } from 'src/app/shared/app-state/notification-state.service';
import { Constants } from 'src/app/shared/constants/constants';
import Utils from 'src/app/shared/helpers/utils';

@Component({
  selector: 'notification-panel',
  templateUrl: './notification-panel.component.html',
  styleUrls: ['./notification-panel.component.scss']
})
export class NotificationPanelComponent implements OnInit, OnDestroy {
  uploadingList: ISlideNotification[] = [];
  processingList: ISlideNotification[] = [];
  completedList: ISlideNotification[] = [];

  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();

  @Input() isClickOutside = true;
  
  protected _notificationsSubscription: Subscription;
  notifications:ISlideNotification[] = [];

  UPLOAD_STATUS = Constants.UPLOAD_STATUS;
  loading = false;

  constructor(
    private notificationState: NotificationStateService,
    private slideService: SlideService,
  ) { 
    this._notificationsSubscription = this.notificationState.subscribeNotifications( (notifications: ISlideNotification[]) => {
      this.notifications = notifications;
      this.groupNotifications();
    });
    this.getSlideNotifications();
  }

  ngOnInit(): void {
  }
  
  public ngOnDestroy(): void {
    this._notificationsSubscription.unsubscribe();
  }

  getSlideNotifications() {
    this.loading = true;
    this.slideService.getSlideByUploader().subscribe({
      next: (res) => {
        if (res.isValid) {
          res.jsonData.forEach((n:any) => {
            n.fileSizeStr = Utils.humanFileSize(n.fileSize);
            n.modifiedDate = new Date(n.modifiedDate);
          });
          this.notificationState.dispatchNotifications(res.jsonData);
        }
      }
    }).add(() => {
      this.loading = false;
    });
  }

  markAsReadAll() {
    this.slideService.markAsReadAll().subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notificationState.dispatchNotifications([]);
        }
      }
    });
  }

  markAsRead(id: string) {
    this.slideService.markAsRead(id).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notifications = this.notifications.filter(n => n.id != id);
          this.notificationState.dispatchNotifications(this.notifications);
        }
      }
    });
  }

  groupNotifications() {
    this.uploadingList = this.notifications.filter(n => n.state == Constants.UPLOAD_STATUS.UPLOADING);
    this.processingList = this.notifications.filter(n => n.state == Constants.UPLOAD_STATUS.PROCESSING);
    this.completedList = this.notifications.filter(n => 
      n.state == Constants.UPLOAD_STATUS.COMPLETED || n.state == Constants.UPLOAD_STATUS.ERROR);
  }

  onClickOutside(event: any) {
    if (this.visible && this.isClickOutside) {
      this.visible = false;
    }
    this.isClickOutside = true;
  }
}
