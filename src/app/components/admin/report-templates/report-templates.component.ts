import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { INIT_REPORT_TEMPLATE } from 'src/app/models/report-template';
import { ReportTemplateService } from 'src/app/services/report-template.service';

@Component({
  selector: 'app-report-templates',
  templateUrl: './report-templates.component.html',
  styleUrls: ['./report-templates.component.scss']
})
export class ReportTemplatesComponent implements OnInit {
  
  reportTemplates: TreeNode[] = [];
  loading = false;
  text = ''
  currentTemplate = INIT_REPORT_TEMPLATE;
  constructor(
    private reportTemplateService: ReportTemplateService
  ) { }

  ngOnInit(): void {
    this.getAll();
  }

  getAll() {
    this.loading = true;
    this.reportTemplateService.getAll(this.reportTemplateService.url).subscribe({
      next: (res) => {
        if (res.isValid) {
          // this.printTemplates = res.jsonData;
          this.extractReportTemplates(res.jsonData, this.reportTemplates);
          console.log('this.reportTemplates', res)
        }
      }
    }).add(() => {
      this.loading = false
    });;
  }

  extractReportTemplates(resData: any[], extractedData: any[] | undefined) {
    if (resData) {
      for (let i=0; i<resData.length; ++i) {
        let newNode: TreeNode = {
          label: resData[i].templateName,
          key: resData[i].templateId,
          data: {
            templateId: resData[i].templateId,
            templateName: resData[i].templateName,
            templateExtName: resData[i].templateExtName,
            hasChild: resData[i].hasChild,
            parentName: resData[i].parentName,
            parentId: resData[i].parentId,
            microbodyDescrible: resData[i].microbodyDescrible,
            diagnose: resData[i].diagnose,
            discuss: resData[i].discuss,
            recommendation: resData[i].recommendation,
            consultaion: resData[i].consultaion,
          },
          children: [] 
        }
        this.extractReportTemplates(resData[i].child, newNode.children);
        extractedData?.push(newNode);
      }
    }
  }

  selectTemplate(event: any) {
    this.currentTemplate = event.node.data;
  }
}
