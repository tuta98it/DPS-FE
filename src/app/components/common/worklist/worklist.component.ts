import { Component, OnInit } from '@angular/core';
import { CaseStudyService } from 'src/app/services/case-study.service';

@Component({
  selector: 'app-worklist',
  templateUrl: './worklist.component.html',
  styleUrls: ['./worklist.component.scss']
})
export class WorklistComponent implements OnInit {
  searchData = {
    patientName: '',
    patientCode: '',
    requestType: '',
    from: '',
    to: '',
    approveFrom: '',
    approveTo: '',
    page: 1,
    pageSize: 20,
    status: '',
    conclusion: '',
    diagnose: '',
    specimensCode: '',
    sort: []
  };
  caseStudies: any = [];
  totalCaseStudies = 0;
  tableHeight = 300;
  lastMaxStart = -1;

  isVisibleCaseStudyInfo = false;
  caseStudyInfoHeader = '';


  constructor(
    private caseStudyService: CaseStudyService
  ) { }

  ngOnInit(): void {
    this.setTableHeight(33.33);
    this.search();
  }

  search() {
    this.caseStudyService.search(this.caseStudyService.url+ '/Search', this.searchData).subscribe({
      next: (res) => {
        this.caseStudies = [...this.caseStudies, ...res.d.source];
        this.totalCaseStudies = res.d.itemCount;
      }
    });
  }

  onCreateCaseStudy() {
    this.caseStudyInfoHeader = 'Thêm ca thăm khám';
    this.isVisibleCaseStudyInfo = true;
  }

  onEditCaseStudy(event: any) {
    console.log('onEditCaseStudy', event);
  }

  onResizeEnd(event: any) {
    this.setTableHeight(event.sizes[0]);
  }

  setTableHeight(worklistSizes: number) {
    let fontSize = parseInt(getComputedStyle(document.documentElement).fontSize);
    const headerHeight = 3.5;
    let contentHeight = window.innerHeight - headerHeight*fontSize;
    this.tableHeight = contentHeight*worklistSizes/100 - 80;
  }

  onLazyLoad(event:any) {
    if (this.lastMaxStart < event.first) {
      this.lastMaxStart = event.first;
      this.searchData.page += 1;
      this.search();
    }
  }
}
