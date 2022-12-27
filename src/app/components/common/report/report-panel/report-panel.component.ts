import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { INIT_REPORT } from 'src/app/models/report';
import { ReportService } from 'src/app/services/report.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
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

  @Input() height = 0;
  minusHeight = 65;
  isSmallScreen = true;

  reports: any[] = [];
  activeReportTab = 0;
  visiblePrintPreview = false;

  _disableEditor = true;
  @Input() set disableEditor(value: boolean) {
    this._disableEditor = value;
    if (!value) {
      this.currentReport = JSON.stringify(this.reports[this.activeReportTab]);
    }
    this.disableEditorChange.emit(value);
  }
  get disableEditor() {
    return this._disableEditor;
  }
  @Output() disableEditorChange = new EventEmitter<any>();

  currentReport: any = {};

  reportStates:any = {};

  constructor(
    private reportService: ReportService,
    private notification: NotificationService,
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
    } else if (event.action == Constants.REPORT_ACTIONS.DISCARD) {
      this.reports[this.activeReportTab] = JSON.parse(this.currentReport);
      this.disableEditor = true;
    } else if (event.action == Constants.REPORT_ACTIONS.ADD) {
      this.addReportTab();
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
      this.disableEditor = false;
    }, 100);
    this.disableEditor = true;
  }
}
