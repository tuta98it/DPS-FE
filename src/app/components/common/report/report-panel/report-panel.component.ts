import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
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
    }
  }
  get caseStudyId() {
    return this._caseStudyId;
  }
  @ViewChild('reportEditor') reportEditor!: ReportEditorComponent;

  @Input() height = 0;
  minusHeight = 30;
  isSmallScreen = true;

  constructor(
    private reportService: ReportService,
    private ref: ChangeDetectorRef
  ) { 
    this.isSmallScreen = window.innerWidth < 1600;
    if(!this.isSmallScreen) {
      this.minusHeight = 45;
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
    this.reportService.getCaseStudyReports(this.caseStudyId+'').subscribe({
      next: (res) => {
        console.log('getReports', res)
      }
    });
  }

  createReport() {
    let payload = {
      ...this.reportEditor.reportForm,
      caseStudyId: this.caseStudyId
    }
    this.reportService.create(payload).subscribe({
      next: (res) => {
        console.log('createReport', res)
      }
    });
  }
}
