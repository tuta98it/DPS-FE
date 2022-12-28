import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IViewerTab } from 'src/app/models/viewer-tab';

@Injectable({
  providedIn: 'root'
})
export class ViewerStateService {
  protected currentCaseSubject: BehaviorSubject<any>;
  // protected currentCaseId = '';
  protected currentCase:any = {};

  protected currentTabsSubject: BehaviorSubject<IViewerTab[]>;
  protected currentTabs:IViewerTab[] = [];

  constructor()
  {
    // this.currentCaseSubject = new BehaviorSubject<string>(this.currentCaseId);
    this.currentCaseSubject = new BehaviorSubject<string>(this.currentCase);
    this.currentTabsSubject = new BehaviorSubject<IViewerTab[]>(this.currentTabs);
  }
  
  public subscribeCurrentCase(callback: (data: any) => void): Subscription {
    return this.currentCaseSubject.subscribe(callback);
  }

  public dispatchCurrentCase(data: IViewerTab): void {
    this.currentCase = {
      caseStudyId: data.caseStudyId,
      sharedToken: data.sharedToken
    };
    this.currentCaseSubject.next(this.currentCase);
  }

  public subscribeCurrentTabs(callback: (data: IViewerTab[]) => void): Subscription {
    return this.currentTabsSubject.subscribe(callback);
  }

  public dispatchCurrentTabs(): void {
    const dispatchedModel: IViewerTab[] = JSON.parse(JSON.stringify(this.currentTabs));

    this.currentTabsSubject.next(dispatchedModel);
  }

  public openTab(newTab: IViewerTab) {
    if (this.currentTabs.findIndex(t => t.caseStudyId == newTab.caseStudyId) == -1) {
      this.currentTabs.push(newTab);
      this.dispatchCurrentTabs();
    } 
    // this.dispatchCurrentCase(newTab.caseStudyId);
    this.dispatchCurrentCase(newTab);
  }

  public closeTab(id: string) {
    let i = this.currentTabs.findIndex(t => t.caseStudyId == id);
    if (i > -1) {
      this.currentTabs.splice(i, 1);
      this.dispatchCurrentTabs();
    }
    if (this.currentTabs.length > i) {
      this.dispatchCurrentCase(this.currentTabs[i]);
    } else if (i > 0) {
      this.dispatchCurrentCase(this.currentTabs[i-1]);
    } else {
      this.dispatchCurrentCase({
        caseStudyId: '',
        sharedToken: ''
      });
    }
  }
}
