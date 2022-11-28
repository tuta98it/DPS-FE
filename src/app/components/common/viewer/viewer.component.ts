import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IViewerTab } from 'src/app/models/viewer-tab';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {
  // @Input() caseStudyId = '';
  protected _currentTabsSubscription: Subscription;
  currentTabs:IViewerTab[] = [];
  currentCaseId = '';
  protected _currentCaseSubscription: Subscription;
  @ViewChild("viewerContainer") viewerContainer!: ElementRef;
  renderedCases:string[] = [];
  constructor(
    private viewerState: ViewerStateService,
    private renderer:Renderer2
  ) { 
    this._currentTabsSubscription = this.viewerState.subscribeCurrentTabs( (tabs: IViewerTab[]) => {
      this.currentTabs = tabs;
    });
    this._currentCaseSubscription = this.viewerState.subscribeCurrentCase( (id: string) => {
      this.currentCaseId = id;
      this.changeCaseStudy(id);
    });
  }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this._currentTabsSubscription.unsubscribe();
    this._currentCaseSubscription.unsubscribe();
  }

  changeCaseStudy(id: string) {
    if (this.viewerContainer) {
      if (!id) {
        this.removeViewers();
      }
      else if (!this.renderedCases.includes(id)) {
        this.addNewViewer(id);
        this.renderedCases.push(id);
      } else {
        this.setCurrentViewer(id);
      }
    }
  }

  addNewViewer(id: string) {
    const newContainer = this.renderer.createElement('div');
    this.renderer.setAttribute(newContainer, 'id', 'case'+id);
    this.renderer.addClass(newContainer, 'msc-viewer-container');
    this.renderer.addClass(newContainer, 'w-full');
    this.renderer.addClass(newContainer, 'h-full');
    this.renderer.addClass(newContainer, 'relative');
    this.renderer.addClass(newContainer, 'hidden');

    const newIFrame = this.renderer.createElement('iframe');
    this.renderer.setAttribute(newIFrame, 'id', '0');
    this.renderer.setAttribute(newIFrame, 'style', 'border:none;width:100%;top:0;left:0;right:0;bottom:0;position:absolute;height:100%;');
    this.renderer.setAttribute(newIFrame, 'src', '/html/slide-viewer/dpsviewer.html?domain=https://dpstest2-dz.pmr.vn&slide=63809c0a36105750a6a972ef');

    this.renderer.appendChild(newContainer, newIFrame);
    this.renderer.appendChild(this.viewerContainer.nativeElement, newContainer);
    this.setCurrentViewer(id);
  }

  removeViewers() {
    this.renderedCases = [];
    let viewers = this.viewerContainer.nativeElement.querySelectorAll('.msc-viewer-container');
    viewers.forEach((v:any) => {
      this.renderer.removeChild(this.viewerContainer.nativeElement, v);
    });
  }

  setCurrentViewer(id: string) {
    let viewers = this.viewerContainer.nativeElement.querySelectorAll('.msc-viewer-container');
    viewers.forEach((v:any) => {
      if (this.currentTabs.findIndex(t => t.caseStudyId == v.id.substring(4)) > -1) {
        this.renderer.addClass(v, 'hidden');
      } else {
        this.renderer.removeChild(this.viewerContainer.nativeElement, v);
        let removedId = this.renderedCases.indexOf(v.id.substring(4));
        if (removedId > -1) { 
          this.renderedCases.splice(removedId, 1);
        }
      }
    });
    let currentViewer = this.viewerContainer.nativeElement.querySelector('#'+'case'+id);
    if (currentViewer) {
      this.renderer.removeClass(currentViewer, 'hidden');
    }
  }
}
