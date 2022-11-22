import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IViewerTab } from 'src/app/models/viewer-tab';

@Injectable({
  providedIn: 'root'
})
export class ViewerStateService {
  protected currentCaseSubject: BehaviorSubject<string>;
  protected currentCaseId = '';

  protected currentTabsSubject: BehaviorSubject<IViewerTab[]>;
  protected currentTabs:IViewerTab[] = [];

  constructor()
  {
    this.currentCaseSubject = new BehaviorSubject<string>(this.currentCaseId);
    this.currentTabsSubject = new BehaviorSubject<IViewerTab[]>(this.currentTabs);
  }
  
  public subscribeCurrentCase(callback: (data: string) => void): Subscription {
    return this.currentCaseSubject.subscribe(callback);
  }

  public dispatchCurrentCase(data: string): void {
    this.currentCaseId = data;
    this.currentCaseSubject.next(data);
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
    this.dispatchCurrentCase(newTab.caseStudyId);
  }

  public closeTab(id: string) {
    let i = this.currentTabs.findIndex(t => t.caseStudyId == id);
    if (i > -1) {
      this.currentTabs.splice(i, 1);
      this.dispatchCurrentTabs();
    }
    if (this.currentTabs.length > i) {
      this.dispatchCurrentCase(this.currentTabs[i].caseStudyId);
    } else if (i > 0) {
      this.dispatchCurrentCase(this.currentTabs[i-1].caseStudyId);
    } else {
      this.dispatchCurrentCase('');
    }
  }


}
