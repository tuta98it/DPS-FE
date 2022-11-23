import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IViewerTab } from 'src/app/models/viewer-tab';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'viewer-tabs',
  templateUrl: './viewer-tabs.component.html',
  styleUrls: ['./viewer-tabs.component.scss']
})
export class ViewerTabsComponent implements OnInit, OnDestroy {
  protected _currentTabsSubscription: Subscription;
  currentTabs:IViewerTab[] = [];
  LAYOUT = Constants.LAYOUT;
  @Input() selectedLayout = Constants.LAYOUT.FULL;
  currentCaseId = '';
  protected _currentCaseSubscription: Subscription;

  constructor(
    private viewerState: ViewerStateService,
  ) { 
    this._currentTabsSubscription = this.viewerState.subscribeCurrentTabs( (tabs: IViewerTab[]) => {
      this.currentTabs = tabs;
    });
    this._currentCaseSubscription = this.viewerState.subscribeCurrentCase( (id: string) => {
      this.currentCaseId = id;
    });
  }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this._currentTabsSubscription.unsubscribe();
    this._currentCaseSubscription.unsubscribe();
  }

  closeTab(id: string) {
    this.viewerState.closeTab(id);
  }

  openTab(tab: IViewerTab) {
    this.viewerState.openTab(tab);
  }
}
