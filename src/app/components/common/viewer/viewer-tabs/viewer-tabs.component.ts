import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IViewerTab } from 'src/app/models/viewer-tab';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';

@Component({
  selector: 'viewer-tabs',
  templateUrl: './viewer-tabs.component.html',
  styleUrls: ['./viewer-tabs.component.scss']
})
export class ViewerTabsComponent implements OnInit {
  protected _currentTabsSubscription: Subscription;
  currentTabs:IViewerTab[] = [];
  
  constructor(
    private viewerState: ViewerStateService,

  ) { 
    this._currentTabsSubscription = this.viewerState.subscribeCurrentTabs( (tabs: IViewerTab[]) => {
      this.currentTabs = tabs;
    });
  }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this._currentTabsSubscription.unsubscribe();
  }

  closeTab(id: string) {
    this.viewerState.closeTab(id);
  }
}
