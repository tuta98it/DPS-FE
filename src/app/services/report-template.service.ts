import { Injectable } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { Observable } from 'rxjs';
import { BaseService } from './base-service';

@Injectable({
    providedIn: 'root',
})
export class ReportTemplateService extends BaseService {
    override url = '/Template';
    export(): Observable<any> {
        return this.get(`${this.url}/Export`, undefined, 'blob');
    }
    import(formData: any): Observable<any> {
        return this.post(`${this.url}/Import`, formData);
    }
    updateAll(payload: any): Observable<any> {
        return this.post(`${this.url}/UpdateAll`, payload);
    }
    // get list in array, instead of tree
    getList() {
        return this.get(`${this.url}/List`);
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

        deExtractReportTemplates(treeData: any[], jsonData: any[] | undefined) {
            if (treeData.length > 0) {
                for (let i = 0; i < treeData.length; ++i) {
                    console.log(treeData[i]);
                    console.log(jsonData);


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
}
