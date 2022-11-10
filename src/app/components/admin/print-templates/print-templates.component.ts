import { Component, OnInit } from '@angular/core';
import { PrintTemplateService } from 'src/app/services/print-template.service';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
  selector: 'app-print-templates',
  templateUrl: './print-templates.component.html',
  styleUrls: ['./print-templates.component.scss']
})
export class PrintTemplatesComponent implements OnInit {
  isVisiblePrintTemplateDialog = false;
  isVisibleDeleteItemDialog = false;
  printTemplates: any = [];
  cols: any[] = [];
  selectedPrintTemplate = {};
  isEditPrintTemplate = false;
  deletedItem: any = {};
  loading = false;
  constructor(
    private notification: NotificationService,
    private printTemplateService: PrintTemplateService
  ) {
  
  }

  ngOnInit() {
    this.cols = [
      { field: 'id', header: 'Id', width: '30rem' },
      { field: 'priority', header: 'Độ ưu tiên', width: '30rem' },
      { field: 'templateName', header: 'Tên mẫu in', width: '50rem' },
    ];
    this.getAll();
  }

  getAll() {
    this.loading = true;
    this.printTemplateService.getAll(this.printTemplateService.url).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.printTemplates = res.jsonData;
          console.log('this.printTemplates', this.printTemplates)
        }
      }
    }).add(() => {
      this.loading = false
    });;
  }

  onCreateItem() {
    
  }

  onEditItem(item: any) {
    
  }

  onDeleteItem(item: any) {
    this.deletedItem = item;
    this.isVisibleDeleteItemDialog = true;
  }

  selectPrintTemplate(printTemplate: any) {
    this.selectedPrintTemplate = printTemplate;
  }

  deletePrintTemplate() {
    this.printTemplateService.deleteById(this.printTemplateService.url, this.deletedItem.id).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.notification.success('Xóa mẫu in thành công', '');
          this.isVisibleDeleteItemDialog = false;
          this.getAll();
        }
      }
    });
  }
}
