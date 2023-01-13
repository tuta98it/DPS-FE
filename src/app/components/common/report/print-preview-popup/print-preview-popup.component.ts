import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrintTemplateService } from 'src/app/services/print-template.service';
import { CaseStudyService } from 'src/app/services/case-study.service';

@Component({
  selector: 'print-preview-popup',
  templateUrl: './print-preview-popup.component.html',
  styleUrls: ['./print-preview-popup.component.scss']
})
export class PrintPreviewPopupComponent implements OnInit {

  // popup utilities
  _visible = false;
  @Input() set visible(value: boolean) {
    this._visible = value;
    this.visibleChange.emit(value);
    if (value) {
      this.onShow();
    }
    else {
      this.onClose();
    }
  }
  get visible() {
    return this._visible;
  }
  @Output() visibleChange = new EventEmitter<any>();
  // popup utilities - end

  _reportId = '';
  @Input() set reportId(id: any) {
    this._reportId = id;
  }
  get reportId() {
    return this._reportId;
  }
  @Input() caseStudyId = '';

  lstPrintTemplates: any[];
  selectedTemplateId: any;

  lstCommonInfos: any = null;

  isIframeReady: boolean = false;
  isWaiting4Show: boolean = false;

  iframePreviewFunction: any = null;
  iframePrintFunction: any = null;
  iframeSavePdfFunction: any = null;

  @Output() onPrint = new EventEmitter<any>();

  constructor(
    private printTemplateService: PrintTemplateService,
    private caseStudyService: CaseStudyService,
  ) {
    this.lstPrintTemplates = [];

    //bind functions for iframe
    (<any>window).registerShowPrint= this.registerShowPrint.bind(this);
  }

  ngOnInit(): void {
  }

  ///////////////////////////////////////////////////////
  // popup utilities
  onShow(): void {
    this.getAllTemplates();
    this.getReportInfo();
  }
  
  onClose(): void {
    this.isIframeReady = false;
  }

  closePopup(): void {
    this.visible = false;
  }
  // popup utilities - end
  ///////////////////////////////////////////////////////

  getReportInfo() {
    console.log('getReportInfo, id: ' + this._reportId);
    this.caseStudyService.getCaseStudyReportInfo(this._reportId).subscribe({
      next: (res) => {
        if (res.isValid) {
          // console.log(res.jsonData);
          this.lstCommonInfos = {};
          Object.assign(this.lstCommonInfos, res.jsonData);
          if(this.isIframeReady && this.isWaiting4Show) {
            this.isWaiting4Show = false;
            this.showPreview(this.selectedTemplateId);
          }
        }
      }
    });
  }

  getAllTemplates() {
    this.printTemplateService.searchForms('', 1, 50).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.lstPrintTemplates = res.jsonData.data;
          if(this.lstPrintTemplates.length > 0) {
            this.selectedTemplateId = this.lstPrintTemplates[0].id;
            if(this.isIframeReady && this.lstCommonInfos != null)
              this.showPreview(this.selectedTemplateId);
            else
              this.isWaiting4Show = true;
          }
        }
      }
    });
  }

  onTemplateChanged(event: any): void {
    console.log('onTemplateChanged: ', event.value); //event.value: report template item
    this.showPreview(event.value);
  }

  showPreview(templateId:any) {
    console.log('show preview report here for: ' + templateId);
    this.printTemplateService.getFormData(templateId).subscribe({
      next: (res) => {
        if (res.isValid) {
          console.log('form:', res.jsonData);
          if(this.iframePreviewFunction != null)
            this.showPrintTemplate(res.jsonData);
          else {
            console.log('here timeout for 200');
            var _self = this;
            setTimeout(function() {
              _self.showPrintTemplate(res.jsonData);
            }, 200);
          }
        }
      }
    });
  }

  printReport(): void {
    if(this.iframePrintFunction != null) {
      this.caseStudyService.markAsPrinted(this.caseStudyId).subscribe({
        next: (res) => {
          if (res.isValid) {
            this.onPrint.emit();
          }
        }
      });
      //A4 for now
      //TODO: choose paper size from form info or user input
      this.iframePrintFunction('210mm', '297mm', '0', '/html/print-template'); 
      var _self = this;
      setTimeout(function() {
        _self.closePopup();
      }, 500);
    }
  }

  printReport2Pdf(): void {
    if(this.iframeSavePdfFunction != null) {
      var patientName = (this.lstCommonInfos.patientsName != undefined && this.lstCommonInfos.patientsName != "") ? this.lstCommonInfos.patientsName : "dps-report";
      this.iframeSavePdfFunction(patientName, '210mm', '297mm', '0', '/html/print-template');
    }
  }

  showPrintTemplate(templateInfo: any) {
    if(this.iframePreviewFunction != null) {
      this.iframePreviewFunction(templateInfo, this.lstCommonInfos);
    }
  }

  ////////////////////////////////////////////////
  // iframe functions
  ////////////////////////////////////////////////

  /**
   * Register a showing function
   * @param callback a function(formInfo, commonInfoData): 2 parameters
   * formInfo: json data of form
   * commonInfoData: array of common info values
   */
  registerShowPrint(previewCallback:any, printCallback: any, savePdfCallback: any) {
    console.log('isIframeReady before: ' + this.isIframeReady);
    this.iframePreviewFunction = previewCallback;
    this.iframePrintFunction = printCallback;
    this.iframeSavePdfFunction = savePdfCallback;
    this.isIframeReady = true;
    if(this.isWaiting4Show && this.lstCommonInfos != null) {
      this.isWaiting4Show = false;
      this.showPreview(this.selectedTemplateId);
    }
  }
  
}
