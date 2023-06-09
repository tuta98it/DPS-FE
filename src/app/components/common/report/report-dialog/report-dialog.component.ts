import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { INIT_REPORT } from 'src/app/models/report';
import { ReportTemplateService } from 'src/app/services/report-template.service';
import { ReportService } from 'src/app/services/report.service';
import { Constants } from 'src/app/shared/constants/constants';
import { NotificationService } from 'src/app/shared/notification.service';
import { ReportEditorComponent } from '../report-editor/report-editor.component';

@Component({
  selector: 'report-dialog',
  templateUrl: './report-dialog.component.html',
  styleUrls: ['./report-dialog.component.scss']
})
export class ReportDialogComponent implements OnInit {
  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
    this.isSelectedTemplate = false;
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();
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
  
  reports: any[] = [];
  activeReportTab = 0;
  visiblePrintPreview = false;
  visibleSaveCustomReport = false;

  disableEditor = true;
  
  reportStates:any = {};

  @ViewChildren("reportEditor") private reportEditors!: QueryList<ReportEditorComponent>;

  visibleKeyImages = false;

  customTemplates: any[] = [];
  reportTemplates: TreeNode[] = [];
  selectedReportTemplate: any = null;
  currentTemplate: any = {
    microbodyDescribe: '',
    diagnose: '',
    discuss: '',
    recommendation: '',
    consultation: '',
  };
  customReport = {
    microbodyDescribe: '',
    diagnose: '',
    discuss: '',
    recommendation: '',
    consultation: '',
  };
  isSelectedTemplate = false;

  isSmallScreen = true;
  minusHeight = 240; //px
  editorHeight = 400; 
  templateHeight = 250; 
  initTemplateHeight = 250; 
  _isShowTemplate = true;
  set isShowTemplate(value: boolean) {
    this._isShowTemplate = value;
    this.templateHeight = value ? this.initTemplateHeight : 50;
    this.setEditorHeight();
  }
  get isShowTemplate() {
    return this._isShowTemplate;
  }

  visibleHistory = false;

  constructor(
    private reportService: ReportService,
    private notification: NotificationService,
    private reportTemplateService: ReportTemplateService,
  ) { 
    Constants.REPORT_STATES.forEach((r: any) => {
      this.reportStates[r.value] = r.label;
    });

    this.isSmallScreen = window.innerWidth < 1600;
    if(this.isSmallScreen) {
      this.minusHeight = 210;
    }
    if (window.innerWidth < 1600) {
      this.initTemplateHeight = 150;
      this.templateHeight = 150;
    }
    this.setEditorHeight();

    this.getReportTemplates();
    this.getCustomTemplates();
  }

  ngOnInit(): void {

  }

  onReportAction(event: any) {
    if (event.action == Constants.REPORT_ACTIONS.SAVE) {
      this.saveReport();
    } else if (event.action == Constants.REPORT_ACTIONS.PRINT) {
      this.visiblePrintPreview = true;
    } else if (event.action == Constants.REPORT_ACTIONS.DISCARD) {
      this.discardReport();
    } else if (event.action == Constants.REPORT_ACTIONS.ADD) {
      this.addReportTab();
    } else if (event.action == Constants.REPORT_ACTIONS.KEY_IMAGES) {
      this.visibleKeyImages = true;
    } else if (event.action == Constants.REPORT_ACTIONS.HISTORY) {
      this.visibleHistory = true;
    } else if (event.action == Constants.REPORT_ACTIONS.APPROVE) {
      this.approveReport();
    } else if (event.action == Constants.REPORT_ACTIONS.UNAPPROVE) {
      this.unapproveReport();
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
          this.addReportTab();
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


  approveReport() {
    this.reportService.approveReport(this.reports[this.activeReportTab]).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.getReports();
          this.notification.success('Duyệt báo cáo thành công');
          this.disableEditor = true;
        }
      }
    });
  }

  discardReport() {
    this.reportService.discard(this.reports[this.activeReportTab].id).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.getReports();
          this.disableEditor = true;
          this.activeReportTab = 0;
        }
      }
    });
  }

  unapproveReport() {
    if (this.reports[this.activeReportTab].id != '') {
      this.reportService.unapprove(this.reports[this.activeReportTab].id).subscribe({
        next: (res) => {
          if (res.isValid) {
            this.getReports();
            this.notification.success('Bỏ duyệt báo cáo thành công');
            this.disableEditor = true;
          }
        }
      });
    }
  }

  addDraftReport() {
    this.reports.push(JSON.parse(JSON.stringify(INIT_REPORT)));
  }

  addReportTab() {
    this.addDraftReport();
    setTimeout(() => {
      this.activeReportTab = this.reports.length - 1;
      this.disableEditor = true;
    }, 300);
  }

  onSelectTemplate(event: any, isCustom=false) {
    this.currentTemplate = isCustom ? event.value : event.node.data;
    this.isSelectedTemplate = true;
  }

  onSaveCustomReport() {
    this.customReport.microbodyDescribe = this.reports[this.activeReportTab].microbodyDescribe,
    this.customReport.diagnose = this.reports[this.activeReportTab].diagnose,
    this.customReport.discuss = this.reports[this.activeReportTab].discuss,
    this.customReport.recommendation = this.reports[this.activeReportTab].recommendation,
    this.customReport.consultation = this.reports[this.activeReportTab].consultation,
    this.visibleSaveCustomReport = true;
  }
  
  applyReportTemplate() {
    if (this.reportEditors) {
      let reportEditor = this.reportEditors.find(e => e.reportTabIndex == this.activeReportTab);
      if (reportEditor) {
        reportEditor.checkReport(this.currentTemplate);
      }
    }
  }
  
  getCustomTemplates() {
    this.reportTemplateService.getCustomTemplates().subscribe({
      next: (res) => {
        if (res.isValid) {
          this.customTemplates = res.jsonData;
          this.customTemplates.forEach(t => {
            t.label = t.code + ' - ' + t.templateName;
          });
        }
      }
    });
  }

  getReportTemplates() {
    this.reportTemplates = [];
    this.reportTemplateService.getAll().subscribe({
      next: (res) => {
        if (res.isValid) {
          this.extractReportTemplates(
            res.jsonData,
            this.reportTemplates
          );
        }
      },
    });
  }

  extractReportTemplates(resData: any[], extractedData: any[] | undefined) {
    if (resData) {
      for (let i = 0; i < resData.length; ++i) {
        let newNode: TreeNode = {
          label: resData[i].templateName,
          key: resData[i].templateId,
          data: {
            templateId: resData[i].templateId,
            templateName: resData[i].templateName,
            code: resData[i].code,
            templateExtName: resData[i].templateExtName,
            hasChild: resData[i].hasChild,
            parentName: resData[i].parentName,
            parentId: resData[i].parentId,
            microbodyDescribe: resData[i].microbodyDescrible,
            diagnose: resData[i].diagnose,
            discuss: resData[i].discuss,
            recommendation: resData[i].recommendation,
            consultation: resData[i].consultaion,
          },
          children: [],
        };
        this.extractReportTemplates(resData[i].child, newNode.children);
        extractedData?.push(newNode);
      }
    }
  }

  setEditorHeight() {
    let dialogHeight = window.innerHeight*0.9;
    this.editorHeight = dialogHeight - this.templateHeight - this.minusHeight;
  }
}
