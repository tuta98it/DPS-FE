import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { Constants, StorageKeys } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss'],
})
export class CommonLayoutComponent implements OnInit, OnDestroy {
  LAYOUT = Constants.LAYOUT;
  isVisibleSelectLayout = false;
  selectedLayout = Constants.LAYOUT.FULL;
  currentSelectedLayout = Constants.LAYOUT.FULL;
  isShowViewer = false;
  protected _currentCaseSubscription: Subscription;

  constructor(
    private firebaseService: FirebaseService,
    private notification: NotificationService,
    private viewerState: ViewerStateService,

  ) {
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
    this.firebaseService.currentMessage.subscribe((message: any) => {
      if (message) {
        this.notification.add('info', message.data.title, message.data.message, 'c', true);
      }
    });
  }

  ngOnInit(): void { }

  public ngOnDestroy(): void {
    this._currentCaseSubscription.unsubscribe();
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
