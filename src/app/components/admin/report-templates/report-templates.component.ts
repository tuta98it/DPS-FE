import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { INIT_REPORT_TEMPLATE } from 'src/app/models/report-template';
import { ReportTemplateService } from 'src/app/services/report-template.service';
import { Constants } from 'src/app/shared/constants/constants';
import Utils from 'src/app/shared/helpers/utils';
import { NotificationService } from 'src/app/shared/notification.service';

@Component({
    selector: 'app-report-templates',
    templateUrl: './report-templates.component.html',
    styleUrls: ['./report-templates.component.scss'],
})
export class ReportTemplatesComponent implements OnInit {
    reportTemplates: TreeNode[] = [];
    isVisibleImportDialog=false;
    loading = false;
    saving = false;
    isExporting = false;
    deleting = false;
    text = '';
    currentTemplate = JSON.parse(JSON.stringify(INIT_REPORT_TEMPLATE));
    selectedParent: TreeNode | null = null;
    isVisibleDeleteItemDialog = false;
    textConfirmDelete = '';
    test: TreeNode<any>[]=[];

    constructor(
        private reportTemplateService: ReportTemplateService,
        private notification: NotificationService
    ) {}

    ngOnInit(): void {
        this.getAll();
    }

    getAll() {
        this.loading = true;
        this.reportTemplates = [];
        this.reportTemplateService
            .getAll()
            .subscribe({
                next: (res) => {
                    // console.log(res.jsonData);

                    if (res.isValid) {
                        this.extractReportTemplates(
                            res.jsonData,
                            this.reportTemplates
                        );
                        console.log(this.reportTemplates);


                    }
                },
            })
            .add(() => {
                this.loading = false;
            });
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

    selectTemplate(event: any) {
        this.currentTemplate = event.node.data;
        console.log('currentTemplate', this.currentTemplate);
        if (event.node.data.parentId != Constants.OBJECT_ID_EMPTY) {
            this.selectedParent = {};
            this.selectedParent.key = event.node.data.parentId;
            this.selectedParent.label = event.node.data.parentName;
        } else {
            this.selectedParent = null;
        }
    }

    createReportTemplate() {
        this.saving = true;
        this.currentTemplate.parentId = this.selectedParent
            ? this.selectedParent.key
            : Constants.OBJECT_ID_EMPTY;
        this.reportTemplateService
            .create(this.currentTemplate)
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        this.notification.success('Thêm mới thành công', '');
                        this.updateReportTemplates(res.jsonData);
                        this.resetTemplate();
                    }
                },
            })
            .add(() => {
                this.saving = false;
            });
    }

    updateReportTemplate() {
        this.saving = true;
        this.currentTemplate.parentId = this.selectedParent
            ? this.selectedParent.key
            : Constants.OBJECT_ID_EMPTY;
        this.reportTemplateService
            .update(this.currentTemplate.templateId, this.currentTemplate)
            .subscribe({
                next: (res) => {
                    if (res.d.isValid) {
                        this.notification.success('Cập nhật thành công', '');
                        this.updateReportTemplates(res.d.jsonData);
                    }
                },
            })
            .add(() => {
                this.saving = false;
            });
    }

    onSaveTemplate() {
        if (!this.currentTemplate.templateId) {
            this.createReportTemplate();
        } else {
            this.updateReportTemplate();
        }
    }

    deleteReportTemplate() {
        this.isVisibleDeleteItemDialog = false;
        this.deleting = true;
        this.reportTemplateService
            .deleteById(this.currentTemplate.templateId)
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        this.notification.success(
                            'Xóa mẫu báo cáo thành công',
                            ''
                        );
                        this.resetTemplate();
                        this.updateReportTemplates(res.jsonData);
                    }
                },
            })
            .add(() => {
                this.deleting = false;
            });
    }

    onDeleteItem() {
        this.textConfirmDelete = `Xác nhận xóa mẫu báo cáo <b>${this.currentTemplate.templateName}</b>?`;
        this.isVisibleDeleteItemDialog = true;
    }

    resetTemplate() {
        this.currentTemplate = JSON.parse(JSON.stringify(INIT_REPORT_TEMPLATE));
        this.selectedParent = null;
    }

    updateReportTemplates(resData: any[]) {
        this.loading = true;
        this.reportTemplates = [];
        this.extractReportTemplates(resData, this.reportTemplates);
        this.loading = false;
    }

    export() {
        this.isExporting = true;
        this.reportTemplateService.export().subscribe({
            next: (res) => {
                if (res) {
                    let filename = 'Ds mẫu báo cáo';
                    let dataType = res.type;
                    let binaryData = [];
                    binaryData.push(res);
                    let link = window.URL.createObjectURL(
                        new Blob(binaryData, { type: dataType })
                    );

                    Utils.saveLocalFile(link, filename);
                } else {
                    this.notification.error('Xuất file thất bại', '');
                }
            },
            error: (error) => {
                this.notification.error('Xuất file thất bại', '');
            },
            complete: () => {
                this.isExporting = false;
            },
        });
    }
}
