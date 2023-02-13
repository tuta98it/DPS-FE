import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, NgZone } from '@angular/core';
import { INIT_SEARCH_CASE_STUDY, SearchCaseStudy } from 'src/app/models/search-case-study';
import { CaseStudyService } from 'src/app/services/case-study.service';
import { PrintTemplateService } from 'src/app/services/print-template.service';
import { Constants } from 'src/app/shared/constants/constants';
import { CaseStudyTableComponent } from '../../worklist/case-study-table/case-study-table.component';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'export-multiple-reports',
  templateUrl: './export-multiple-reports.component.html',
  styleUrls: ['./export-multiple-reports.component.scss']
})
export class ExportMultipleReportsComponent implements OnInit {
  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    if (value) {
      this.isShowSearch = true;
      this.getAllTemplates();
    } else {
      this.searchData = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
      this.caseStudies = [];
      this.skipLazyLoad = true;
    }
    this.visibleChange.emit(value);
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();

  loading = false;
  lastMaxStart = -1;

  _searchData = JSON.parse(JSON.stringify(INIT_SEARCH_CASE_STUDY));
  set searchData(value: SearchCaseStudy) {
    this._searchData = value;
    this.searchData.from = this.searchData.from ? new Date(this.searchData.from) : '';
    this.searchData.to = this.searchData.to ? new Date(this.searchData.to) : '';
  }
  get searchData(): SearchCaseStudy {
    return this._searchData;
  }
  isShowSearch = true;
  caseStudies: any = [];

  isSmallScreen = true;
  minusHeight = 185; //px
  tableHeight = 600; 

  requestTypes:any = {};
  reportStates:any = {};

  listPrintTemplates: any[] = [];
  selectedTemplateId: any;
  selectedTemplateInfo: any = null;
  skipLazyLoad = true;

  isPrinting = false;
  printedReportCount = 0;
  private curPrintingIdx = 0;
  private lstReportIds = [];
  private curPatientName: string = '';
  private curPatientId: string = '';
  private sHtmlContent: string = '';
  private isPdf = false;
  private zipFile: any;

  private isIframeReady: boolean = false;
  private isWaiting4Show: boolean = false;

  private iframePreviewFunction: any = null;
  private iframePrintFunction: any = null;
  private iframeSavePdfFunction: any = null;

  @ViewChild('caseStudyTable') caseStudyTable!: CaseStudyTableComponent;

  //alert modal dialog
  isVisibleAlertDialog = false;
  sAlertMessage: string = "";

  constructor(
    private caseStudyService: CaseStudyService,
    private printTemplateService: PrintTemplateService,
    private zone: NgZone,
  ) { 
    this.isSmallScreen = window.innerWidth < 1600;
    if(this.isSmallScreen) {
      this.minusHeight = 240;
    }
    this.setTableHeight();
    Constants.REQUEST_TYPES.forEach((r: any) => {
      this.requestTypes[r.value] = r.label;
    });
    Constants.REPORT_STATES.forEach((r: any) => {
      this.reportStates[r.value] = r.label;
    });

    //bind functions for iframe
    (<any>window).multiReportPrintCallbacks= this.multiReportPrintCallbacks.bind(this);
    (<any>window).onPrintCompleted= this.onPrintCompleted.bind(this);
  }

  ngOnInit(): void {
  }
  
  search() {
    this.loading = true;
    let datePipe = new DatePipe('en-US');
    this.caseStudyService.search({ ...this.searchData }).subscribe({
      next: (res) => {
        res.jsonData.data.forEach((r: any) => {
          r.stateLabel = this.reportStates[r.state];
          r.requestTypeLabel = this.requestTypes[r.requestType];
          let htmlChecked = '<i class="pi pi-check text-xl text-green-500 font-bold"></i>'
          r.hasSlide = r.slideCount > 0 ? htmlChecked : '';
          r.hasConclusion = (r.conclusion != null && r.conclusion != "") ? htmlChecked : '';
          r.isApprove = r.state == Constants.REPORT_STATES[4].value ? htmlChecked : '';
          r.isPrint = r.isPrint ? htmlChecked : '';
          r.createdDate = r.createdDate ? datePipe.transform(r.createdDate, 'HH:mm dd/MM/yyyy') : '';
        });
        this.caseStudies = [...this.caseStudies, ...res.jsonData.data];
      }
    }).add(() => {
      this.loading = false;
    });
  }

  onSearch(data: any) {
    this.searchData = JSON.parse(JSON.stringify(data));
    this.searchData.page = 1;
    this.caseStudyTable.selectedCaseStudy = {};
    this.caseStudies = [];
    this.caseStudyTable.resetScrollTop();
    this.lastMaxStart = -1;
    this.search();
  }

  getAllTemplates() {
    this.printTemplateService.searchForms('', 1, 50).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.listPrintTemplates = res.jsonData.data;
          if(this.listPrintTemplates.length > 0) {
            this.selectedTemplateId = this.listPrintTemplates[0].id;
            // console.log('getAllTemplates, ' + this.selectedTemplateId);
            this.getTemplateInfo();
          }
        }
      }
    });
  }

  getTemplateInfo() {
    this.printTemplateService.getFormData(this.selectedTemplateId).subscribe({
      next: (res) => {
        if (res.isValid) {
          console.log('form:', res.jsonData);
          this.selectedTemplateInfo = res.jsonData;
        }
      }
    });
  }

  onPrintTemplateChanged(event: any) {
    // console.log('onPrintTemplateChanged, ' + this.selectedTemplateId + ', event.value: ' + event.value);
    this.selectedTemplateInfo = null;
    this.getTemplateInfo();
  }

  onLazyLoad(event:any) {
    if (!this.skipLazyLoad) {
      if (this.lastMaxStart < event.first && !this.loading) {
        this.lastMaxStart = event.first;
        this.searchData.page += 1;
        this.search();
      }
    } else {
      this.skipLazyLoad = false;
    }
  }

  setTableHeight() {
    let dialogHeight = window.innerHeight * 0.9;
    this.tableHeight = dialogHeight - this.minusHeight;
  }

  ///////////////////////////////////////////////////////////////
  // printing functions
  ///////////////////////////////////////////////////////////////

  printAll(): void {
    console.log('printAll');
    if(this.caseStudies.length == 0) 
      return;

    this.isPrinting = true;
    this.sHtmlContent = '';
    // console.log(this.caseStudies);

    this.curPrintingIdx = 0;
    this.printedReportCount = 0;
    this.isPdf = false;
    this.getListReportIds();
  }

  printPdfAll(): void {
    console.log('printAll');
    if(this.caseStudies.length == 0) 
      return;

    this.isPrinting = true;

    //prepare JSZip
    this.zipFile = new JSZip();

    this.curPrintingIdx = 0;
    this.printedReportCount = 0;
    this.isPdf = true;
    this.getListReportIds();
  }

  getListReportIds() {
    console.log('getListReportIds');
    this.caseStudyService.getListReportIdsByFilter(this.searchData).subscribe({
      next: (res) => {
        if (res.isValid) {
          console.log(res.jsonData);
          this.lstReportIds = res.jsonData;
          this.doPrinting();
        }
      }
    });
  }

  /**
   * Register a showing function
   * @param callback a function(formInfo, commonInfoData): 2 parameters
   * formInfo: json data of form
   * commonInfoData: array of common info values
   */
  multiReportPrintCallbacks(previewCallback:any, printCallback: any, savePdfCallback: any) {
    console.log('multiReportPrintCallbacks, isIframeReady before: ' + this.isIframeReady);
    this.iframePreviewFunction = previewCallback;
    this.iframePrintFunction = printCallback;
    this.iframeSavePdfFunction = savePdfCallback;
    this.isIframeReady = true;
  }

  doPrinting() {
    //check if finished
    if(this.curPrintingIdx == this.lstReportIds.length) {
      var _self = this;
      setTimeout(function() {
        _self.onPrintCompletedAll();
      }, 200);
      return;
    }

    //render current content
    let reportId = this.lstReportIds[this.curPrintingIdx];
    this.getReportInfo(reportId);
  }

  getReportInfo(reportId: any) {
    console.log('getReportInfo, id: ' + reportId);
    this.caseStudyService.getCaseStudyReportInfo(reportId).subscribe({
      next: (res) => {
        if (res.isValid) {
          console.log(res.jsonData);

          this.curPatientName = res.jsonData.patientsName;
          this.curPatientId = res.jsonData.patientCode;

          //show content into iframe
          //will get print content from iframe in onPrintCompleted method
          this.iframePreviewFunction(this.selectedTemplateInfo, res.jsonData);
        }
      }
    });
  }

  onPrintCompleted(htmlContent: any) {
    console.log('onPrintCompleted');
    if(!this.isPdf) { //printing
      this.sHtmlContent += `<div style="margin:0;padding:0;position:relative;width:210mm;height:297mm;page-break-after:always;">
      ${htmlContent}
  </div>
  `;

      this.printedReportCount++;

      //next study
      this.curPrintingIdx++;
      var _self = this;
      setTimeout(function() {
        _self.doPrinting();
      }, 50);
    }
    else { //pdf exporting
      //get Blob of the file
      let filename = this.curPatientName + '_' + this.curPatientId + '.pdf';
      var _self = this;
      this.iframeSavePdfFunction(filename, true, function(blob: any) {
        _self.zipFile.file(filename, blob, { binary: true });

        _self.printedReportCount++;

        //next study
        _self.curPrintingIdx++;
        setTimeout(function() {
          _self.doPrinting();
        }, 50);
      });
    }
  }

  onPrintCompletedAll() {
    //safety check if we have no report to print
    if(this.printedReportCount == 0) {
      this.showAlert("Không có ca khám nào có báo cáo kết quả!<br/>Hãy xem lại bộ lọc dữ liệu..");
      this.zone.run(() => {
        this.isPrinting = false;
      });
      return;
    }

    if(!this.isPdf) { //printing
      //show print popup
      let content = this.sHtmlContent;
      // console.log(content);
      let html = `<html>
      <head>
          <title></title>
          <style media="print">@page { size: 210mm 297mm; margin: 0;}</style>
          <link rel="stylesheet" type="text/css" href="/html/print-template/styles/mscform.css" media="print" />
      </head>
      <body style="padding: 0; margin: 0;" onload="window.focus(); window.print(); window.close()">
        ${content}
      </body>
  </html>`;

      let printWindow = window.open('', undefined, 'height=680,width=800');
      if(printWindow == null) {
          console.log("Why printWindow == null???");
          this.showAlert("Lỗi: Không mở được popup để in!<br/>Bạn hãy mở tính năng enable popup cho trang web này (xem trên thanh địa chỉ của trình duyệt web) hoặc liên hệ với bộ phận chăm sóc khách hàng để được hướng dẫn.");
          this.zone.run(() => {
            this.isPrinting = false;
          });
          
          return;
      }
      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    }
    else { //pdf exporting
      //download zip file
      let today = new Date();
      let filename = 'dps_' + today.getDate() + today.getMonth() + today.getFullYear() + '.zip';
      this.zipFile.generateAsync({ type: "blob" }).then(function(content: any) {
        saveAs(content, filename);
      });
    }

    //done all
    this.zone.run(() => {
      this.isPrinting = false;
    });
  }

  showAlert(msg: any) {
    this.sAlertMessage = msg;
    this.isVisibleAlertDialog = true;
  }
}
