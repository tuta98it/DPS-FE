import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { INIT_REPORT } from 'src/app/models/report';
import { ReportService } from 'src/app/services/report.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
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
  visiblePrintPreview = false;
  disableEditor = true;

  reportStates:any = {};

  constructor(
    private reportService: ReportService,
    private notification: NotificationService,
    private ref: ChangeDetectorRef
  ) { 
    Constants.REPORT_STATES.forEach((r: any) => {
      this.reportStates[r.value] = r.label;
    });
    this.isSmallScreen = window.innerWidth < 1600;
    if(!this.isSmallScreen) {
      this.minusHeight = 80;
    }
  }

  ngOnInit(): void {

  }

  onReportAction(event: any) {
    if (event.action == Constants.REPORT_ACTIONS.SAVE) {
      this.saveReport();
    } else if (event.action == Constants.REPORT_ACTIONS.PRINT) {
      this.visiblePrintPreview = true;
    }
  }

  getReports() {
    this.reports = [];
    this.reportService.getCaseStudyReports(this.caseStudyId+'').subscribe({
      next: (res) => {
        if (res.jsonData.length > 0) {
          res.jsonData.forEach((r: any) => {
            r.stateLabel = this.reportStates[r.state];
          });
          this.reports = res.jsonData;
        } else {
          this.addDraftReport();
        }
      }
    });
  }

  saveReport() {
    if (this.reports[this.activeReportTab].id) {
      this.updateReport();
    } else {
      this.createReport();
    }
  }

  createReport() {
    let payload = {
      ...this.reports[this.activeReportTab],
      caseStudyId: this.caseStudyId
    };
    this.reportService.create(payload).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.reports[this.activeReportTab]['id'] = res.jsonData.id;
          this.reports[this.activeReportTab]['caseStudyId'] = res.jsonData.caseStudyId;
          this.updateReport();
        }
      }
    });
  }

  updateReport() {
    this.reportService.updateReport(this.reports[this.activeReportTab]).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.getReports();
          this.notification.success('Lưu báo cáo thành công');
          this.disableEditor = true;
        }
      }
    });
  } 

  addDraftReport() {
    this.reports.push(JSON.parse(JSON.stringify(INIT_REPORT)));
  }

  addReportTab() {
    this.addDraftReport();
    setTimeout(() => {
      this.activeReportTab = this.reports.length - 1;
    }, 100);
    this.disableEditor = true;
  }
}
