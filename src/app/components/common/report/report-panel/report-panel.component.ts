import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { TabView } from 'primeng/tabview';
import { INIT_REPORT } from 'src/app/models/report';
import { ReportService } from 'src/app/services/report.service';
import { Constants } from 'src/app/shared/constants/constants';
import { ReportEditorComponent } from '../report-editor/report-editor.component';

@Component({
  selector: 'report-panel',
  templateUrl: './report-panel.component.html',
  styleUrls: ['./report-panel.component.scss']
})
export class ReportPanelComponent implements OnInit {
  _caseStudyId = new String('');
  @Input() set caseStudyId(data: String) {
    this._caseStudyId = data;
    if (data != '') {
      this.getReports();
      this.activeReportTab = 0;
    }
  }
  get caseStudyId() {
    return this._caseStudyId;
  }
  @ViewChild('reportEditor') reportEditor!: ReportEditorComponent;

  @Input() height = 0;
  minusHeight = 65;
  isSmallScreen = true;

  reports: any[] = [];
  activeReportTab = 0;

  constructor(
    private reportService: ReportService,
    private ref: ChangeDetectorRef
  ) { 
    this.isSmallScreen = window.innerWidth < 1600;
    if(!this.isSmallScreen) {
      this.minusHeight = 80;
    }
  }

  ngOnInit(): void {

  }

  onReportAction(event: any) {
    if (event.action == Constants.REPORT_ACTIONS.SAVE) {
      this.createReport();
    }
  }

  getReports() {
    this.reports = [];
    this.reportService.getCaseStudyReports(this.caseStudyId+'').subscribe({
      next: (res) => {
        if (res.jsonData.length > 0) {
          this.reports = res.jsonData;
        } else {
          this.addDraftReport();
        }
      }
    });
  }

  createReport() {
    console.log('createReport', this.activeReportTab);
    // let payload = {
    //   ...this.reportEditor.reportForm,
    //   caseStudyId: this.caseStudyId
    // };
    // this.reportService.create(payload).subscribe({
    //   next: (res) => {
    //     this.getReports();
    //   }
    // });
  }

  changeReportTab(event: any) {
    this.activeReportTab = event.index;
  }

  addDraftReport() {
    this.reports.push(JSON.parse(JSON.stringify(INIT_REPORT)));
  }
}
