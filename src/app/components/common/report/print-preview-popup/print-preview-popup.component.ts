import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrintTemplateService } from 'src/app/services/print-template.service';

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

  lstPrintTemplates: any[];
  selectedTemplateId: any;

  lstCommonInfos: any[] = [];

  iframePrintFunction: any = null;

  constructor(
    private printTemplateService: PrintTemplateService
  ) {
    this.lstPrintTemplates = [
      {name: 'New York', id: 'NY'},
      {name: 'Rome', id: 'RM'},
      {name: 'London', id: 'LDN'},
      {name: 'Istanbul', id: 'IST'},
      {name: 'Paris', id: 'PRS'}
    ];

    //bind functions for iframe
    (<any>window).registerShowPrint= this.registerShowPrint.bind(this);
  }

  ngOnInit(): void {
  }

  ///////////////////////////////////////////////////////
  // popup utilities
  onShow(): void {
    this.getAllTemplates();
  }
  
  onClose(): void {

  }

  closePopup(): void {
    this.visible = false;
  }
  // popup utilities - end
  ///////////////////////////////////////////////////////

  getAllTemplates() {
    this.printTemplateService.searchForms('', 1, 50).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.lstPrintTemplates = res.jsonData.data;
          if(this.lstPrintTemplates.length > 0) {
            this.selectedTemplateId = this.lstPrintTemplates[0].id;
            this.showPreview(this.selectedTemplateId);
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
          this.showPrintTemplate(res.jsonData);
        }
      }
    });
  }

  printReport(): void {

  }

  showPrintTemplate(templateInfo: any) {
    if(this.iframePrintFunction != null) {
      this.iframePrintFunction(templateInfo, this.lstCommonInfos);
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
  registerShowPrint(callback:any) {
    this.iframePrintFunction = callback;
  }
  
}
