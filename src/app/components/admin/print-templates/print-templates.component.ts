import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  textConfirmDelete = '';
  deletedItem: any = {};
  loading = false;
  total = 0;

  constructor(
    private notification: NotificationService,
    private router: Router,
    private printTemplateService: PrintTemplateService
  ) {
  
  }

  ngOnInit() {
    this.cols = [
      { field: 'name', header: 'Tên mẫu in', width: '50rem' },
      { field: 'id', header: 'Id', width: '30rem' },
      { field: 'priority', header: 'Độ ưu tiên', width: '10rem' },
    ];
    this.getAll();
  }

  getAll() {
    this.loading = true;
    this.printTemplateService.searchForms('', 1, 50).subscribe({
      next: (res) => {
        if (res.isValid) {
          this.printTemplates = res.jsonData.data;
          this.total = res.jsonData.total;
        }
      }
    }).add(() => {
      this.loading = false
    });;
  }

  onCreateItem() {
    this.router.navigate(['/admin/print-templates/detail']);
  }

  onEditItem(item: any) {
    this.router.navigate(['/admin/print-templates/detail/' + item.id]);
  }

  onDeleteItem(item: any) {
    this.textConfirmDelete = `Xác nhận xóa mẫu in <b>${item.templateName}</b>?`
    this.deletedItem = item;
    this.isVisibleDeleteItemDialog = true;
  }

  selectPrintTemplate(printTemplate: any) {
    this.selectedPrintTemplate = printTemplate;
  }

  deletePrintTemplate() {
    this.printTemplateService.deleteById(this.deletedItem.id).subscribe({
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
