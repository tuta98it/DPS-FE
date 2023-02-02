import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { NotificationStateService } from 'src/app/shared/app-state/notification-state.service';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { Constants, StorageKeys } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { VTWorklistComponent } from '../../vt-worklist/vt-worklist.component';
import { WorklistComponent } from '../../worklist/worklist.component';

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
  @ViewChild('worklist') worklist!: WorklistComponent;
  @ViewChild('VTWorklist') VTWorklist!: VTWorklistComponent;

  constructor(
    private firebaseService: FirebaseService,
    private notification: NotificationService,
    public configService: AppConfigService,
    private viewerState: ViewerStateService,
    private notificationState: NotificationStateService,
  ) {
    this.layoutConfig = this.configService.getConfig().layout;
    let layout = localStorage.getItem(StorageKeys.LAYOUT);
    if (layout !== null) {
      this.selectedLayout = +layout;
      this.currentSelectedLayout = this.selectedLayout;
    }
    this._currentCaseSubscription = this.viewerState.subscribeCurrentCase( (tab: any) => {
      // console.log('subscribeCurrentCase here', tab);
      if (tab != null && tab.caseStudyId != undefined && tab.caseStudyId != 'null') {
        this.isShowViewer = true;
      } else {
        this.isShowViewer = false;
      }
    });
    this.firebaseService.requestPermission();
    this.firebaseService.receiveMessage();
    this._notificationSub = this.firebaseService.currentMessage.subscribe((message: any) => {
      console.log(message);
      this.onFirebaseMessage(message);
    });
  }

  ngOnInit(): void { }

  public ngOnDestroy(): void {
    this._currentCaseSubscription.unsubscribe();
    this._notificationSub.unsubscribe();
  }

  onFirebaseMessage(message: any) {
    if (message) {
      this.notification.firebase(message.data.title, message.data.message);
      let fileData = JSON.parse(message.data.otherInfo);
      let uploadId = fileData.OriginFileName.split('.')[0];
      let state = message.data.type == Constants.UPLOAD_PROCESS_TYPE.PROCESS_DONE ?
        Constants.UPLOAD_STATUS.COMPLETED : Constants.UPLOAD_STATUS.ERROR;
      this.notificationState.updateState(uploadId, state);
      if (state == Constants.UPLOAD_STATUS.COMPLETED) {
        if (this.layoutConfig == this.LAYOUT_CONFIG.DEFAULT) {
          this.worklist.onCaseStudyAction({ action: Constants.CASE_STUDY_ACTIONS.REFRESH });
        } else if (this.layoutConfig == this.LAYOUT_CONFIG.VT) {
          this.VTWorklist.getKeyImages();
          this.VTWorklist.getPrintedKeyImages();
          setTimeout(() => {
            this.VTWorklist.onCaseStudyAction({ action: Constants.CASE_STUDY_ACTIONS.REFRESH });
          }, 100);
        }
      }
    }
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
