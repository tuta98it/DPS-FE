import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IViewerTab } from 'src/app/models/viewer-tab';
import { ViewerStateService } from 'src/app/shared/app-state/viewer-state.service';
import { SharedCasestudyService } from 'src/app/services/shared-casestudy.service';

@Component({
  selector: 'app-share-study',
  templateUrl: './share-study.component.html',
  styleUrls: ['./share-study.component.scss']
})
export class ShareStudyComponent implements OnInit {
  sharedToken: string = '';
  canShowViewer: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private viewerState: ViewerStateService,
    private sharedCasestudyService: SharedCasestudyService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sharedToken = params['token'];
      if(this.sharedToken == undefined) {
        //TODO: redirect to some where?
        console.error('Not found token!!!');
        this.canShowViewer = false;
        return;
      }
        
      setTimeout(() => {
        this.getCaseStudyByToken();
      }, 100);
   });
  }

  getCaseStudyByToken() {
    // check valid token
    this.sharedCasestudyService.getCaseStudyByToken(this.sharedToken).subscribe({
      next: (res) => {
        if (res.isValid) {
          console.log('getCaseStudyByToken response: ', res);
          this.canShowViewer = true;

          //study info
          let caseStudy = {
            caseStudyId: res.jsonData.caseStudyId,
            patientsName: res.jsonData.patientsName,
            createdTime: '20221212T001818',
          }
          this.openViewer(caseStudy);
        }
        else {
          this.canShowViewer = false;
        }
      }
    });
  }

  openViewer(caseStudy: any) {
    let newTab: IViewerTab = {
      caseStudyId: caseStudy.caseStudyId,
      patientsName: caseStudy.patientsName,
      createdTime: caseStudy.createdTime,
      sharedToken: this.sharedToken
    }
    this.viewerState.openTab(newTab);
  }

}
