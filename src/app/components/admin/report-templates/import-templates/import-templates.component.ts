import {
    Component,
    Input,
    OnInit,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    OnChanges,
} from '@angular/core';
import { TreeNode } from 'primeng/api';
import { ReportTemplateService } from 'src/app/services/report-template.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { TreeDragDropService } from 'primeng/api';

@Component({
    selector: 'app-import-templates',
    templateUrl: './import-templates.component.html',
    styleUrls: ['./import-templates.component.scss'],
    providers: [TreeDragDropService],
})
export class ImportTemplatesComponent implements OnInit, OnChanges {
    _isVisible = false;
    saving = false;
    selectedParent = {};
    jsonData = [];
    reportTemplatesImport: TreeNode<any>[] = [];
    //   reportTemplates: TreeNode[] = [];
    @Input() reportTemplates: TreeNode[] = [];

    @Input() set isVisible(val: boolean) {
        this._isVisible = val;
    }

    get isVisible(): boolean {
        return this._isVisible;
    }
    uploadedFiles: any[] = [];
    // @ViewChild('inputFile') inputFile: ElementRef<any> | undefined;

    @Output() isVisibleChange: EventEmitter<any> = new EventEmitter();

    constructor(
        private reportTemplateService: ReportTemplateService,
        private notification: NotificationService
    ) {}

    ngOnChanges() {
        console.log(this.reportTemplates);
    }
    ngOnInit(): void {}

    clearValue(event: any) {}

    myUploader(event: { files: any }) {
        // console.log(event.files[0]);
        // for (let file of event.files) {
        //     this.uploadedFiles.push(file);
        // }
        let formData = new FormData();
        formData.append('files', event.files[0]);

        this.reportTemplateService.import(formData).subscribe({
            next: (res) => {
                if (res.isValid) {
                    this.extractReportTemplates(
                        res.jsonData,
                        this.reportTemplatesImport
                    );

                    console.log(this.reportTemplatesImport);
                } else {
                    this.notification.error('Import file thất bại', '');
                }
            },

            error: (error) => {
                this.notification.error('Import file thất bại', '');
            },
            complete: () => {},
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
                console.log(extractedData);
            }
        }
    }

    deExtractReportTemplates(treeData: any[], jsonData: any[] | undefined) {
        if (treeData.length > 0) {
            for (let i = 0; i < treeData.length; ++i) {
                console.log(treeData[i]);

                let newNode = {
                    templateId: treeData[i].data.templateId,
                    templateName: treeData[i].data.templateName,
                    templateExtName: treeData[i].data.templateExtName,
                    hasChild: treeData[i].data.hasChild,
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

    closeDialog() {
        // if(this.inputFile) this.inputFile.nativeElement.value='';
        this.isVisibleChange.emit(false);
    }
    saveImport() {
        this.saving = true;
        this.deExtractReportTemplates(this.reportTemplates, this.jsonData);
        this.reportTemplateService
            .updateAll({ jsonData: this.jsonData })
            .subscribe({
                next: (res) => {
                    if (res.isValid) {
                        this.notification.success('Import file thành công', '');
                    } else {
                        this.notification.success('Import file thành công', '');
                    }
                },
                error: (error) => {
                    this.notification.error('Import file thất bại', '');
                },
            })
            .add(() => {
                this.saving = false;
            });
        console.log(this.jsonData);
    }
}
