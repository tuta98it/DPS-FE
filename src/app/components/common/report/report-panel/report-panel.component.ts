import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { INIT_REPORT } from 'src/app/models/report';
import { ReportTemplateService } from 'src/app/services/report-template.service';
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

  @Input() height = 0;
  minusHeight = 65;
  isSmallScreen = true;

  reports: any[] = [];
  activeReportTab = 0;
  visiblePrintPreview = false;

  _disableEditor = true;
  @Input() set disableEditor(value: boolean) {
    this._disableEditor = value;
    this.disableEditorChange.emit(value);
  }
  get disableEditor() {
    return this._disableEditor;
  }
  @Output() disableEditorChange = new EventEmitter<any>();

  reportStates:any = {};

  visibleKeyImages = false;
  visibleHistory = false;

  isSelectedTemplate = false;
  currentTemplate: any = {
    microbodyDescribe: '',
    diagnose: '',
    discuss: '',
    recommendation: '',
    consultation: '',
  };
  customTemplates: any[] = [];
  reportTemplates: TreeNode[] = [];
  selectedReportTemplate: any = null;
  @ViewChildren("reportEditor") private reportEditors!: QueryList<ReportEditorComponent>;
  
  constructor(
    private reportService: ReportService,
    private reportTemplateService: ReportTemplateService,
    private notification: NotificationService,
  ) { 
    Constants.REPORT_STATES.forEach((r: any) => {
      this.reportStates[r.value] = r.label;
    });
    this.isSmallScreen = window.innerWidth < 1600;
    if(!this.isSmallScreen) {
      this.minusHeight = 80;
    }
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

  applyReportTemplate() {
    if (this.reportEditors) {
      let reportEditor = this.reportEditors.find(e => e.reportTabIndex == this.activeReportTab);
      if (reportEditor) {
        reportEditor.checkReport(this.currentTemplate);
      }
    }
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

  onSelectTemplate(event: any, isCustom=false) {
    this.currentTemplate = isCustom ? event.value : event.node.data;
    this.isSelectedTemplate = true;
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

  onReportPrinted() {
    
  }
}
