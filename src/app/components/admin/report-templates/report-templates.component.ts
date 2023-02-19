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
    uploadedFiles: any[] = [];
    isVisibleImportReportDialog = false;
    loading = false;
    saving = false;
    isExporting = false;
    isImporting = false;
    isVisibleDragDropReport = false;
    useExtendReportFields = false;
    validateDrop = false;

    deleting = false;
    text = '';
    currentTemplate = JSON.parse(JSON.stringify(INIT_REPORT_TEMPLATE));
    selectedParent: TreeNode | null = null;
    isVisibleDeleteItemDialog = false;
    textConfirmDelete = '';
    jsonData = [];
    payloadUpdateReport = [];
    isVisibleDragDropReports = false;
    reportTemplatesDefault: any;
    listTemplateReportsUpload = [];
    listTemplateReportsCurrent = [];

    constructor(
        private reportTemplateService: ReportTemplateService,
        private notification: NotificationService
    ) {}

    ngOnInit(): void {
        this.getAll();
        // this.reportTemplates=this.reportTemplateService.data.data
    }

    getAll() {
        this.loading = true;
        this.reportTemplates = [];
        this.reportTemplateService
            .getAll()
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        this.extractReportTemplates(
                            res.jsonData,
                            this.reportTemplates
                        );
                        // console.log(this.reportTemplates);
                        this.reportTemplatesDefault = JSON.parse(
                            JSON.stringify(this.reportTemplates)
                        );
                    }
                },
            })
            .add(() => {
                this.loading = false;
            });
    }

    selectTemplate(event: any) {
        console.log(event);

        this.selectedParent = null;
        this.currentTemplate = JSON.parse(JSON.stringify(INIT_REPORT_TEMPLATE));
        if (!event.node.isTemplate) return;

        this.currentTemplate = event.node.data;
        this.currentTemplate.isFirstChild = !event.node.parent.isTemplate
            ? true
            : false;
        console.log('currentTemplate', this.currentTemplate);
        if (event.node.data.parentId != Constants.OBJECT_ID_EMPTY) {
            this.selectedParent = {};
            this.selectedParent.key = event.node.data.parentId;
            this.selectedParent.label = event.node.data.parentName;
            //   console.log('parent', this.selectedParent);
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
    extractReportTemplates(resData: any[], extractedData: any[] | undefined) {
        if (resData) {
            for (let i = 0; i < resData.length; ++i) {
                let newNode: TreeNode = {
                    label: resData[i].templateName,
                    key: resData[i].templateId,
                    draggable: !!resData[i]?.isTemplate,
                    isTemplate: resData[i].isTemplate,
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
                        isTemplate: resData[i].isTemplate,
                    },
                    children: [],
                };
                this.extractReportTemplates(resData[i].child, newNode.children);
                extractedData?.push(newNode);
            }
        }
        // this.reportTemplatesDefault = JSON.parse(JSON.stringify(extractedData));
    }

    extractReportTemplatesFromFile(
        resData: any[],
        extractedData: any[] | undefined
    ) {
        if (resData) {
            for (let i = 0; i < resData.length; ++i) {
                let newNode: TreeNode = {
                    label: resData[i].TemplateName,
                    key: resData[i].TemplateId,
                    isTemplate: resData[i].IsTemplate,
                    data: {
                        templateId: resData[i].TemplateId,
                        templateName: resData[i].TemplateName,
                        code: resData[i].Code,
                        templateExtName: resData[i].TemplateExtName,
                        hasChild: resData[i].HasChild,
                        parentName: resData[i].ParentName,
                        parentId: resData[i].ParentId,
                        microbodyDescribe: resData[i].MicrobodyDescrible,
                        diagnose: resData[i].Diagnose,
                        discuss: resData[i].Discuss,
                        recommendation: resData[i].Recommendation,
                        consultation: resData[i].Consultaion,
                        isTemplate: resData[i].isTemplate,
                    },
                    children: [],
                };
                this.extractReportTemplatesFromFile(
                    resData[i].Child,
                    newNode.children
                );
                extractedData?.push(newNode);
            }
        }
        // this.reportTemplatesDefault = JSON.parse(JSON.stringify(extractedData));
    }

    deExtractReportTemplates(treeData: any[], jsonData: any[] | undefined) {
        if (treeData.length > 0) {
            for (let i = 0; i < treeData.length; ++i) {
                console.log(treeData[i]);

                let newNode = {
                    templateId: treeData[i].data.templateId,
                    templateName: treeData[i].data.templateName,
                    templateExtName: treeData[i].data.templateExtName,
                    isTemplate: treeData[i].isTemplate,
                    hasChild: treeData[i].data.hasChild,
                    code: treeData[i].data.code,
                    parentName: treeData[i].data.parentName,
                    parentId: treeData[i].data.parentId,
                    microbodyDescribe: treeData[i].data.microbodyDescrible,
                    diagnose: treeData[i].data.diagnose,
                    discuss: treeData[i].data.discuss,
                    recommendation: treeData[i].data.recommendation,
                    consultation: treeData[i].data.consultaion,
                    child: [],
                };

                jsonData?.push(newNode);
                this.deExtractReportTemplates(
                    treeData[i].children,
                    newNode.child
                );
            }
        }
    }
    onNodeDrop(event: any) {
        console.log(event);
        if (this.reportTemplates.length != this.reportTemplatesDefault.length) {
            this.reportTemplates = JSON.parse(
                JSON.stringify(this.reportTemplatesDefault)
            );
            this.notification.warn('Không thể thực hiện hành động này', '');
        }
        else if (
            event.dragNode.parent.key != event.dropNode.key &&
            !event.dropNode.isTemplate
        ) {
            this.isVisibleDragDropReports = true;
        }
        else{this.confirmSaveReports()}
        if (this.validateDrop) {
            if (true) {
                event.accept();
                this.confirmSaveReports()
            }
        }


    }

    confirmSaveReports() {
        this.payloadUpdateReport = [];
        this.deExtractReportTemplates(
            this.reportTemplates,
            this.payloadUpdateReport
        );
        console.log(this.payloadUpdateReport);
        this.loading = true;
        this.reportTemplateService
            .updateAll({ jsonData: this.payloadUpdateReport })
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        // this.getAll();
                        this.notification.success('Cập nhật thành công', '');
                    } else {
                        this.notification.success('Có lỗi xảy ra', '');
                    }
                    this.getAll()
                },
                error: (error) => {
                    this.notification.error('Có lỗi xảy ra', '');
                },
            })
            .add(() => {
                this.loading = false;
                this.isVisibleDragDropReports = false;
            });
    }
    cancelSaveReports() {
        this.reportTemplates = JSON.parse(
            JSON.stringify(this.reportTemplatesDefault)
        );
        this.isVisibleDragDropReports = false;
    }
    myUploader(event: { files: any }) {
        this.listTemplateReportsUpload = [];
        const file = event.files[0];
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            let data = JSON.parse(reader.result as string);
            console.log(data);

            this.extractReportTemplatesFromFile(
                data,
                this.listTemplateReportsUpload
            );
            console.log(this.listTemplateReportsUpload);
            this.listTemplateReportsCurrent = JSON.parse(
                JSON.stringify(this.reportTemplates)
            );
            console.log(this.listTemplateReportsCurrent);

            this.isVisibleImportReportDialog = true;
        };
        return;
    }
    saveListReport() {
        let payloadUpload: any[] = [];
        // console.log(this.listTemplateReportsCurrent);

        this.deExtractReportTemplates(
            this.listTemplateReportsCurrent,
            payloadUpload
        );
        console.log(payloadUpload);

        this.reportTemplateService
            .updateAll({ jsonData: payloadUpload })
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        // this.getAll();
                        this.notification.success('Cập nhật thành công', '');
                        this.isVisibleImportReportDialog = false;
                    } else {
                        this.notification.success('Có lỗi xảy ra', '');
                    }
                    this.getAll()
                },
                error: (error) => {
                    this.notification.error('Có lỗi xảy ra', '');
                },
            })
            .add(() => {
                this.loading = false;
                this.isVisibleDragDropReports = false;
            });
    }
}
