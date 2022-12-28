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

  private routeSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private viewerState: ViewerStateService,
    private sharedCasestudyService: SharedCasestudyService
  ) { }

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.sharedToken = params['token'];
      if(this.sharedToken == undefined) {
        //TODO: redirect to some where?
        console.error('Not found token!!!');
        return;
      }
        
      setTimeout(() => {
        this.getCaseStudyByToken();
      }, 100);
   });
  }

  getCaseStudyByToken() {
    //test
    let caseStudy = {
      caseStudyId: 'sharing',
      patientsName: 'Test BN',
      createdTime: '20221212T001818',
    }
    this.openViewer(caseStudy);

    // don't need this API
    // this.sharedCasestudyService.getCaseStudyByToken(this.sharedToken).subscribe({
    //   next: (res) => {
    //     if (res.isValid) {
    //       console.log(res);
    //     }
    //   }
    // });
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
