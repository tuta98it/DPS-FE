import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IViewerTab } from 'src/app/models/viewer-tab';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { AnnotationService } from 'src/app/services/annotation.service';
import { IAuthModel, INIT_AUTH_MODEL } from 'src/app/models/auth-model';
import { AppConfigService } from 'src/app/shared/app-config.service';
import { AuthStateService } from 'src/app/shared/app-state/auth-state.service';
import { UserSettingsService } from 'src/app/services/user-settings.service';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {
  protected _currentTabsSubscription: Subscription;
  currentTabs:IViewerTab[] = [];
  currentCaseId = '';
  protected _currentCaseSubscription: Subscription;
  @ViewChild("viewerContainer") viewerContainer!: ElementRef;
  renderedCases:string[] = [];

  protected _authSubscription: Subscription;
  currentUser = INIT_AUTH_MODEL;

  baseUrl = '';
  baseUrlDz = '';

  isLoading = false;

  sharedToken = '';
  isUseToken:boolean = false;

  constructor(
    private viewerState: ViewerStateService,
    private authState: AuthStateService,
    private renderer: Renderer2,
    private caseStudyService: CaseStudyService,
    private annotationService: AnnotationService,
    protected configService: AppConfigService,
    protected userSettingsService: UserSettingsService
  ) { 
    this._currentTabsSubscription = this.viewerState.subscribeCurrentTabs( (tabs: IViewerTab[]) => {
      this.currentTabs = tabs;
    });
    this._currentCaseSubscription = this.viewerState.subscribeCurrentCase( (tab: any) => {
      this.currentCaseId = tab.caseStudyId;
      this.sharedToken = tab.sharedToken;
      if(this.sharedToken != undefined && this.sharedToken != '')
        this.isUseToken = true;

      console.log('currentCaseId: ' + this.currentCaseId + ', useToken: ' + this.isUseToken);
      this.changeCaseStudy(this.currentCaseId);
    });
    this._authSubscription = this.authState.subscribe( (m: IAuthModel) => {
      this.currentUser = m;
    });

    this.baseUrl = this.configService.getConfig().api.baseUrl;
    var j = this.baseUrl.indexOf('/api');
    if(j > 0)
      this.baseUrl = this.baseUrl.substring(0, j);

    this.baseUrlDz = this.configService.getConfig().deepzoom.baseUrl;
    j = this.baseUrlDz.indexOf('/api');
    if(j > 0)
      this.baseUrlDz = this.baseUrlDz.substring(0, j);

    //bind functions for DPSViewer.html
    (<any>window).getStudyInfo= this.getStudyInfo.bind(this);
    (<any>window).getListKeyImages= this.getListKeyImages.bind(this);
    (<any>window).deleteKeyImage= this.deleteKeyImage.bind(this);
    (<any>window).getListAnnotations= this.getListAnnotations.bind(this);
    (<any>window).saveListAnnotations= this.saveListAnnotations.bind(this);
    (<any>window).getUserSettings= this.getUserSettings.bind(this);
    (<any>window).saveUserSettings= this.saveUserSettings.bind(this);
    (<any>window).getViewerConfig= this.getViewerConfig.bind(this);
    (<any>window).uploadFileXml= this.uploadFileXml.bind(this);
    (<any>window).getAnnotationsInsideBounds= this.getAnnotationsInsideBounds.bind(this);
  }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
    this._currentTabsSubscription.unsubscribe();
    this._currentCaseSubscription.unsubscribe();
    this._authSubscription.unsubscribe();
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
    this.renderer.listen(newIFrame, 'load', () => {
      this.isLoading = false;
    });
    this.renderer.setAttribute(newIFrame, 'id', '0');
    this.renderer.setAttribute(newIFrame, 'style', 'border:none;width:100%;top:0;left:0;right:0;bottom:0;position:absolute;height:100%;');
    if(!this.isUseToken)
      this.renderer.setAttribute(newIFrame, 'src', '/html/slide-viewer/dpsviewer.html?domain=' + this.baseUrl + '&domainSlide=' + this.baseUrlDz + '&study=' + id + '&shared=false&userId=' + this.currentUser.userId + '&username=' + this.currentUser.userName);
    else
      this.renderer.setAttribute(newIFrame, 'src', '/html/slide-viewer/dpsviewer.html?domain=' + this.baseUrl + '&domainSlide=' + this.baseUrlDz + '&study=' + id + '&shared=true');

    this.renderer.appendChild(newContainer, newIFrame);
    this.renderer.appendChild(this.viewerContainer.nativeElement, newContainer);
    this.setCurrentViewer(id);
    this.isLoading = true;
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

  /////////////////////////////////////////////////////////
  // functions for iframe dpsviewer.html
  ////////////////////////////////////////////////////////
  getStudyInfo(studyId: string, callback: any) {
    console.log('parent getStudyInfo, studyId: ' + studyId);
    if(!this.isUseToken) {
      this.caseStudyService.getCaseStudyInfo(studyId).subscribe({
        next: (res) => {
          if (res.isValid) {
            if(callback != undefined)
              callback(res.jsonData);
          }
        }
      });
    }
    else {
      this.caseStudyService.getCaseStudyInfoByToken(studyId, this.sharedToken).subscribe({
        next: (res) => {
          if (res.isValid) {
            if(callback != undefined)
              callback(res.jsonData);
          }
        }
      });
    }
  }

  getListKeyImages(slideId: string, callback: any) {
    console.log('parent getListKeyImages, slideId: ' + slideId);
    if(!this.isUseToken) {
      this.caseStudyService.getListKeyImageOfSlide(slideId).subscribe({
        next: (res) => {
          if (res.isValid) {
            if(callback != undefined)
              callback(res.jsonData);
          }
        }
      });
    }
    else {
      this.caseStudyService.getListKeyImageOfSlideByToken(slideId, this.sharedToken).subscribe({
        next: (res) => {
          if (res.isValid) {
            if(callback != undefined)
              callback(res.jsonData);
          }
        }
      });
    }
  }

  deleteKeyImage(keyImageId: string, callback: any) {
    console.log('parent deleteKeyImage, keyImageId: ' + keyImageId);
    if(!this.isUseToken) {
      this.caseStudyService.deleteKeyImage(keyImageId).subscribe({
        next: (res) => {
          if (res.isValid) {
            if(callback != undefined)
              callback(res.jsonData);
          }
        }
      });
    }
    else {
      console.error('Should not deleteKeyImage in shared mode!!!');
    }
    
  }

  getListAnnotations(slideId: string, callback: any) {
    console.log('parent getListAnnotations, slideId: ' + slideId);
    if(!this.isUseToken) {
      this.annotationService.getListAnnotationOfSlide(slideId).subscribe({
        next: (res) => {
          if (res.isValid) {
            if(callback != undefined)
              callback(res.jsonData);
          }
        }
      });
    }
    else {
      this.annotationService.getListAnnotationOfSlideByToken(slideId, this.sharedToken).subscribe({
        next: (res) => {
          if (res.isValid) {
            if(callback != undefined)
              callback(res.jsonData);
          }
        }
      });
    }
    
  }

  saveListAnnotations(data: any, callback: any) {
    // console.log('parent getListAnnotations, slideId: ' + slideId);
    if(!this.isUseToken) {
      this.annotationService.saveAnnotationsBySlide(data).subscribe({
        next: (res) => {
          if (res.isValid) {
            if(callback != undefined)
              callback(res.jsonData);
          }
        }
      });
    }
    else {

    }
  }

  getUserSettings(callback: any) {
    this.userSettingsService.getUserSettings().subscribe({
      next: (res) => {
        if (res.isValid) {
          if(callback != undefined)
            callback(res.jsonData);
        }
      }
    });
  }

  saveUserSettings(data: any, callback: any) {
    this.userSettingsService.saveKeyImageSettings(data).subscribe({
      next: (res) => {
        // if (res.isValid) {
          if(callback != undefined)
            callback(res);
        // }
      }
    });
  }

  getViewerConfig(callback: any) {
    let cfg = this.configService.getConfig().viewerConfig;
    if(callback != undefined)
      callback(cfg);
  }

  uploadFileXml(slideId:any, fileInput:any, callback: any) {
    console.log('uploadFileXml, slideId: ' + slideId);
    console.log(fileInput);
    if(!this.isUseToken) {
      let file = new Blob([fileInput], { type: fileInput.type })
      const formData: FormData = new FormData();
      formData.append('FormFile', file, fileInput.name);
      formData.append('SlideId', slideId);
      // console.log(formData);

      this.annotationService.UploadXmlFileBySlide(formData).subscribe({
        next: (res) => {
          if (res.isValid) {
            if(callback != undefined)
              callback(res.jsonData);
          }
        }
      });
    }
    else {

    }
  }

  getAnnotationsInsideBounds(slideId: any, bounds: any, callback: any) {
    this.annotationService.getAnnotationsInsideBounds(slideId, bounds).subscribe({
      next: (res) => {
        if (res.isValid) {
          if(callback != undefined)
            callback(res.jsonData);
        }
      }
    });
  }
}
