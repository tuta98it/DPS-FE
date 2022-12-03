import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SlideService } from 'src/app/services/slide.service';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { NotificationStateService } from 'src/app/shared/app-state/notification-state.service';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { Constants, StorageKeys } from 'src/app/shared/constants/constants';
import Utils from 'src/app/shared/helpers/utils';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss'],
})
export class CommonLayoutComponent implements OnInit, OnDestroy {
  LAYOUT = Constants.LAYOUT;
  LAYOUT_CONFIG = Constants.LAYOUT_CONFIG;
  layoutConfig = '';
  isVisibleSelectLayout = false;
  selectedLayout = Constants.LAYOUT.FULL;
  currentSelectedLayout = Constants.LAYOUT.FULL;
  isShowViewer = false;
  protected _currentCaseSubscription: Subscription;
  protected _notificationSub: Subscription;

  constructor(
    private firebaseService: FirebaseService,
    private notification: NotificationService,
    public configService: AppConfigService,
    private viewerState: ViewerStateService,
    private notificationState: NotificationStateService,
    private slideService: SlideService,

  ) {
    this.layoutConfig = this.configService.getConfig().layout;
    let layout = localStorage.getItem(StorageKeys.LAYOUT);
    if (layout !== null) {
      this.selectedLayout = +layout;
      this.currentSelectedLayout = this.selectedLayout;
    }
    this._currentCaseSubscription = this.viewerState.subscribeCurrentCase( (id: string) => {
      if (id) {
        this.isShowViewer = true;
      } else {
        this.isShowViewer = false;
      }
    });
    this.firebaseService.requestPermission();
    this.firebaseService.receiveMessage();
    this._notificationSub = this.firebaseService.currentMessage.subscribe((message: any) => {
      if (message) {
        console.log('message', message)
        this.notification.firebase(message.data.title, message.data.message);
      }
    });
    this.getSlideNotifications();
  }

  ngOnInit(): void { }

  public ngOnDestroy(): void {
    this._currentCaseSubscription.unsubscribe();
    this._notificationSub.unsubscribe();
  }

  getSlideNotifications() {
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
    });
  }

  saveLayout() {
    this.selectedLayout = this.currentSelectedLayout;
    localStorage.setItem(
      StorageKeys.LAYOUT,
      this.selectedLayout.toString()
    );
    this.isVisibleSelectLayout = false;
  }

  onSelectLayout(event: any) {
    this.isVisibleSelectLayout = true;
  }
}
