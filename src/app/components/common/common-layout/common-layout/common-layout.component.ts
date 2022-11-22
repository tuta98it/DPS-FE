import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationComponent } from 'src/app/components/notification/notification.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { Constants, StorageKeys } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss'],
})
export class CommonLayoutComponent implements OnInit {
  LAYOUT = Constants.LAYOUT;
  isVisibleSelectLayout = false;
  selectedLayout = Constants.LAYOUT.FULL;
  currentSelectedLayout = Constants.LAYOUT.FULL;
  isShowViewer = false;
  @ViewChild("notification") notificationComponent!: NotificationComponent;
  protected _currentCaseSubscription: Subscription;
  currentCaseId = '';

  constructor(
    private firebaseService: FirebaseService,
    private viewerState: ViewerStateService,

  ) {
    let layout = localStorage.getItem(StorageKeys.LAYOUT);
    if (layout !== null) {
      this.selectedLayout = +layout;
      this.currentSelectedLayout = this.selectedLayout;
    }

    this.firebaseService.requestPermission();
    this.firebaseService.receiveMessage();
    this.firebaseService.currentMessage.subscribe((message) => {
      this.notificationComponent.showConfirm(message);
    });

    this._currentCaseSubscription = this.viewerState.subscribeCurrentCase( (id: string) => {
      this.currentCaseId = id;
      if (id) {
        this.isShowViewer = true;
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
