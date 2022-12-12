import { Injectable } from '@angular/core';
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
}
